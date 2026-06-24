import { expect, test, type Page } from '@playwright/test';
import { createPdfPreviewHref, PDF_DOCUMENTS } from '../../src/lib/pdf/catalog';

async function waitForPdfReady(page: Page) {
	await page.waitForFunction(
		() =>
			(window as Window & { __PDF_READY__?: boolean }).__PDF_READY__ === true &&
			!document.querySelector('[data-pdf-pending="true"]'),
		{ timeout: 10_000 }
	);
}

test.describe('PDF generation', () => {
	for (const doc of PDF_DOCUMENTS) {
		test(`${doc.id} preview renders`, async ({ page }) => {
			const resp = await page.goto(createPdfPreviewHref(doc, 'alrein', 'mahler'));
			expect(resp?.ok()).toBeTruthy();
			await waitForPdfReady(page);
			await expect(page.locator('body')).not.toContainText('Internal Error');
			await expect(page.locator('[data-slot="pdf-page"]').first()).toBeVisible();
		});
	}

	test('invoice preview can be serialized to a PDF buffer', async ({ page }) => {
		const invoice = PDF_DOCUMENTS.find((doc) => doc.id === 'invoice');
		expect(invoice).toBeDefined();

		await page.goto(createPdfPreviewHref(invoice!, 'alrein', 'mahler'));
		await waitForPdfReady(page);

		const pdf = await page.pdf({
			format: 'A4',
			printBackground: true,
			preferCSSPageSize: true,
			margin: { top: '0mm', right: '0mm', bottom: '0mm', left: '0mm' }
		});

		expect(pdf.subarray(0, 5).toString('utf8')).toBe('%PDF-');
		expect(pdf.length).toBeGreaterThan(10_000);
	});
});
