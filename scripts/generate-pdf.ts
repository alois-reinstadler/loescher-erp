import { chromium } from 'playwright';
import { createClient } from '@libsql/client';
import { and, eq, or } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/libsql';
import { mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';
import { defaultBrandId } from '../src/lib/pdf/brands.ts';
import { companyToIssuer } from '../src/lib/pdf/company-issuer.ts';
import * as schema from '../src/lib/server/db/schema.ts';
import { createPdfJobsFromOptions, parsePdfCliOptions, type PdfJob } from './pdf-options.ts';

type CompanyCliOption = {
	company: string | null;
	argv: string[];
};

function extractCompanyOption(argv: string[]): CompanyCliOption {
	const rewritten = argv.slice(0, 2);
	let company: string | null = null;

	for (let i = 2; i < argv.length; i++) {
		const arg = argv[i];

		if (arg === '--company') {
			const value = argv[++i];
			if (!value || value.startsWith('--')) throw new Error('--company requires a slug or id.');
			company = value;
		} else {
			rewritten.push(arg);
		}
	}

	return { company, argv: rewritten };
}

async function loadCompanyIssuerForScript(slugOrId: string) {
	const databaseUrl = process.env.DATABASE_URL;
	if (!databaseUrl) throw new Error('DATABASE_URL is not set.');

	const client = createClient({ url: databaseUrl });
	const database = drizzle(client, { schema });

	try {
		const [company] = await database
			.select()
			.from(schema.companies)
			.where(
				and(
					eq(schema.companies.active, true),
					or(eq(schema.companies.slug, slugOrId), eq(schema.companies.id, slugOrId))
				)
			)
			.limit(1);

		return company ? companyToIssuer(company) : null;
	} finally {
		client.close();
	}
}

function applyCompanyToJobs(jobs: PdfJob[], company: string, outputDir: string): PdfJob[] {
	return jobs.map((job) => {
		const url = new URL(job.url);
		url.searchParams.set('company', company);

		return {
			...job,
			brandId: company,
			url: url.toString(),
			outPath: resolve(outputDir, company, job.customerId ?? '_supplier', `${job.doc.id}.pdf`)
		};
	});
}

const baseUrl = process.env.PDF_BASE_URL ?? 'http://localhost:5173';
const outputDir = resolve(process.env.PDF_OUTPUT_DIR ?? 'generated');
const companyOption = extractCompanyOption(process.argv);
const options = parsePdfCliOptions(companyOption.argv);

let jobs: PdfJob[];

if (companyOption.company) {
	const issuer = await loadCompanyIssuerForScript(companyOption.company);

	if (issuer) {
		options.brands = defaultBrandId;
		jobs = applyCompanyToJobs(
			createPdfJobsFromOptions({ options, baseUrl, outputDir }),
			companyOption.company,
			outputDir
		);
		console.log(`Using company issuer ${issuer.name} (${companyOption.company}).`);
	} else {
		console.warn(`Company "${companyOption.company}" was not found; falling back to --brand.`);
		jobs = createPdfJobsFromOptions({ options, baseUrl, outputDir });
	}
} else {
	jobs = createPdfJobsFromOptions({ options, baseUrl, outputDir });
}

if (jobs.length === 0) {
	throw new Error('No jobs to run.');
}

console.log(`Generating ${jobs.length} PDF(s) from ${baseUrl} into ${outputDir}.`);

await mkdir(outputDir, { recursive: true });

const browser = await chromium.launch({ headless: true });

try {
	for (const job of jobs) {
		const page = await browser.newPage({
			viewport: { width: 1280, height: 1800 }
		});

		await page.emulateMedia({ colorScheme: 'light' });
		await page.addInitScript(() => {
			window.__PDF_READY__ = false;
			localStorage.setItem('mode-watcher-mode', 'light');
			localStorage.setItem('mode-watcher-theme', 'neutral');
			document.documentElement.classList.remove('dark');
			document.documentElement.style.colorScheme = 'light';
		});

		await page.goto(job.url, { waitUntil: 'networkidle' });

		await page.evaluate(() => {
			localStorage.setItem('mode-watcher-mode', 'light');
			localStorage.setItem('mode-watcher-theme', 'neutral');
			document.documentElement.classList.remove('dark');
			document.documentElement.style.colorScheme = 'light';
		});

		await page.waitForFunction(
			() => window.__PDF_READY__ === true && !document.querySelector('[data-pdf-pending="true"]'),
			null,
			{ timeout: 10000 }
		);

		await mkdir(resolve(job.outPath, '..'), { recursive: true });

		await page.pdf({
			path: job.outPath,
			format: 'A4',
			printBackground: true,
			preferCSSPageSize: true,
			margin: { top: '0mm', right: '0mm', bottom: '0mm', left: '0mm' },
			tagged: true,
			outline: true
		});

		await page.close();
		console.log(`✓ ${job.outPath}`);
	}
} finally {
	await browser.close();
}
