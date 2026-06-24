import { describe, expect, it } from 'vitest';
import { brandList } from './brands.js';
import { createPdfPreviewHref, PDF_BRAND_IDS, PDF_CUSTOMER_IDS, PDF_DOCUMENTS } from './catalog.js';
import { customerList } from './customers.js';

describe('PDF catalog', () => {
	it('keeps generator brand ids in sync with the preview brand registry', () => {
		expect(PDF_BRAND_IDS).toEqual(brandList.map((brand) => brand.id));
	});

	it('keeps generator customer ids in sync with the preview customer registry', () => {
		expect(PDF_CUSTOMER_IDS).toEqual(customerList.map((customer) => customer.id));
	});

	it('has unique document ids and paths', () => {
		expect(new Set(PDF_DOCUMENTS.map((doc) => doc.id)).size).toBe(PDF_DOCUMENTS.length);
		expect(new Set(PDF_DOCUMENTS.map((doc) => doc.path)).size).toBe(PDF_DOCUMENTS.length);
	});

	it('builds customer-aware preview links only for customer documents', () => {
		const invoice = PDF_DOCUMENTS.find((doc) => doc.id === 'invoice');
		const purchaseOrder = PDF_DOCUMENTS.find((doc) => doc.id === 'purchase-order');

		expect(invoice).toBeDefined();
		expect(purchaseOrder).toBeDefined();
		expect(createPdfPreviewHref(invoice!, 'alrein', 'mahler')).toBe(
			'/pdf/invoice?brand=alrein&customer=mahler'
		);
		expect(createPdfPreviewHref(purchaseOrder!, 'alrein', 'mahler')).toBe(
			'/pdf/purchase-order?brand=alrein'
		);
	});
});
