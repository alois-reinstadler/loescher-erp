import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';
import { createPdfJobsFromOptions, parsePdfCliOptions } from './pdf-options.ts';

const baseUrl = process.env.PDF_BASE_URL ?? 'http://localhost:5173';
const outputDir = resolve(process.env.PDF_OUTPUT_DIR ?? 'generated');
const options = parsePdfCliOptions(process.argv);
const jobs = createPdfJobsFromOptions({ options, baseUrl, outputDir });

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
