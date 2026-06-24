import { describe, expect, it } from 'vitest';
import { PDF_DOCUMENTS } from '../src/lib/pdf/catalog.js';
import {
	buildPdfJobs,
	createPdfJobsFromOptions,
	parsePdfCliOptions,
	selectPdfDocuments,
	selectPdfIds
} from '../scripts/pdf-options.ts';

describe('PDF generator options', () => {
	it('parses explicit flags and keeps positional doc compatibility', () => {
		expect(
			parsePdfCliOptions([
				'node',
				'scripts/generate-pdf.ts',
				'offer',
				'--brand',
				'nordlicht',
				'--customer',
				'huber'
			])
		).toEqual({
			docs: 'offer',
			brands: 'nordlicht',
			customers: 'huber'
		});
	});

	it('selects comma-separated documents and rejects unknown ids', () => {
		expect(selectPdfDocuments('invoice,offer').map((doc) => doc.id)).toEqual(['invoice', 'offer']);
		expect(() => selectPdfDocuments('missing')).toThrow(/No matching docs/);
	});

	it('selects ids and reports invalid ids with the available values', () => {
		expect(selectPdfIds('a,c', ['a', 'b', 'c'], 'thing')).toEqual(['a', 'c']);
		expect(() => selectPdfIds('x', ['a', 'b'], 'thing')).toThrow(
			'Unknown thing id(s): x. Available: all, a, b'
		);
	});

	it('builds one supplier job without a customer folder', () => {
		const doc = PDF_DOCUMENTS.find((entry) => entry.id === 'purchase-order');
		expect(doc).toBeDefined();

		const jobs = buildPdfJobs({
			docs: [doc!],
			brandIds: ['alrein'],
			customerIds: ['mahler'],
			baseUrl: 'http://localhost:5173',
			outputDir: '/tmp/generated'
		});

		expect(jobs).toHaveLength(1);
		expect(jobs[0]).toMatchObject({
			customerId: null,
			url: 'http://localhost:5173/pdf/purchase-order?brand=alrein',
			outPath: '/tmp/generated/alrein/_supplier/purchase-order.pdf'
		});
	});

	it('builds customer-specific jobs for customer documents', () => {
		const jobs = createPdfJobsFromOptions({
			options: { docs: 'invoice', brands: 'alrein', customers: 'mahler,huber' },
			baseUrl: 'http://localhost:5173',
			outputDir: '/tmp/generated'
		});

		expect(jobs.map((job) => job.url)).toEqual([
			'http://localhost:5173/pdf/invoice?brand=alrein&customer=mahler',
			'http://localhost:5173/pdf/invoice?brand=alrein&customer=huber'
		]);
	});
});
