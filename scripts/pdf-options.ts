import { resolve } from 'node:path';
import {
	PDF_BRAND_IDS,
	PDF_CUSTOMER_IDS,
	PDF_DOCUMENTS,
	type PdfDocumentSpec
} from '../src/lib/pdf/catalog.ts';

export type PdfCliOptions = {
	docs: string;
	brands: string;
	customers: string;
};

export type PdfJob = {
	doc: PdfDocumentSpec;
	brandId: string;
	customerId: string | null;
	url: string;
	outPath: string;
};

export function parsePdfCliOptions(argv: string[]): PdfCliOptions {
	let docs = 'all';
	let brands = 'all';
	let customers = 'all';

	const args = argv.slice(2);
	const positional: string[] = [];

	for (let i = 0; i < args.length; i++) {
		const arg = args[i];
		if (arg === '--doc' || arg === '--docs') docs = args[++i] ?? docs;
		else if (arg === '--brand' || arg === '--brands') brands = args[++i] ?? brands;
		else if (arg === '--customer' || arg === '--customers') customers = args[++i] ?? customers;
		else positional.push(arg);
	}

	if (positional[0]) docs = positional[0];

	return { docs, brands, customers };
}

export function selectPdfDocuments(filter: string): PdfDocumentSpec[] {
	if (filter === 'all') return [...PDF_DOCUMENTS];

	const ids = filter.split(',').map((s) => s.trim());
	const selected = PDF_DOCUMENTS.filter((doc) => ids.includes(doc.id));

	if (selected.length === 0) {
		throw new Error(
			`No matching docs for "${filter}". Available: all, ${PDF_DOCUMENTS.map((doc) => doc.id).join(', ')}`
		);
	}

	return selected;
}

export function selectPdfIds(filter: string, all: readonly string[], label: string): string[] {
	if (filter === 'all') return [...all];

	const ids = filter.split(',').map((s) => s.trim());
	const unknown = ids.filter((id) => !all.includes(id));

	if (unknown.length > 0) {
		throw new Error(
			`Unknown ${label} id(s): ${unknown.join(', ')}. Available: all, ${all.join(', ')}`
		);
	}

	return ids;
}

export function buildPdfJobs({
	docs,
	brandIds,
	customerIds,
	baseUrl,
	outputDir
}: {
	docs: PdfDocumentSpec[];
	brandIds: string[];
	customerIds: string[];
	baseUrl: string;
	outputDir: string;
}): PdfJob[] {
	const jobs: PdfJob[] = [];

	for (const brandId of brandIds) {
		for (const doc of docs) {
			if (doc.usesCustomer) {
				for (const customerId of customerIds) {
					const params = new URLSearchParams({ brand: brandId, customer: customerId });
					jobs.push({
						doc,
						brandId,
						customerId,
						url: `${baseUrl}${doc.path}?${params.toString()}`,
						outPath: resolve(outputDir, brandId, customerId, `${doc.id}.pdf`)
					});
				}
			} else {
				const params = new URLSearchParams({ brand: brandId });
				jobs.push({
					doc,
					brandId,
					customerId: null,
					url: `${baseUrl}${doc.path}?${params.toString()}`,
					outPath: resolve(outputDir, brandId, '_supplier', `${doc.id}.pdf`)
				});
			}
		}
	}

	return jobs;
}

export function createPdfJobsFromOptions({
	options,
	baseUrl,
	outputDir
}: {
	options: PdfCliOptions;
	baseUrl: string;
	outputDir: string;
}): PdfJob[] {
	return buildPdfJobs({
		docs: selectPdfDocuments(options.docs),
		brandIds: selectPdfIds(options.brands, PDF_BRAND_IDS, 'brand'),
		customerIds: selectPdfIds(options.customers, PDF_CUSTOMER_IDS, 'customer'),
		baseUrl,
		outputDir
	});
}
