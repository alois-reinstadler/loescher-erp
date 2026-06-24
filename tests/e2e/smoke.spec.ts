import { test, expect } from '@playwright/test';

test.describe('public routes', () => {
	test('login page renders the sign-in form', async ({ page }) => {
		await page.goto('/login');
		await expect(page).toHaveTitle(/Sign in/);
		await expect(page.getByText('Loescher ERP').first()).toBeVisible();
	});

	test('register page renders the create-account form', async ({ page }) => {
		await page.goto('/register');
		await expect(page).toHaveTitle(/Create account/);
	});

	test('root redirects to a known entry route', async ({ page }) => {
		const resp = await page.goto('/');
		const status = resp?.status() ?? 0;
		// Either a redirect (3xx) or a successful render is acceptable.
		expect(status === 200 || (status >= 300 && status < 400)).toBeTruthy();
		await expect(page.locator('body')).not.toContainText('Internal Error');
	});
});

test.describe('pdf preview routes', () => {
	// Mirrors the readiness contract used by scripts/generate-pdf.ts.
	async function waitForPdfReady(page: import('@playwright/test').Page) {
		await page.waitForFunction(
			() =>
				(window as Window & { __PDF_READY__?: boolean }).__PDF_READY__ === true &&
				!document.querySelector('[data-pdf-pending="true"]'),
			{ timeout: 10_000 }
		);
	}

	test('invoice preview renders without errors', async ({ page }) => {
		const resp = await page.goto('/pdf/invoice?brand=alrein&customer=mahler');
		expect(resp?.ok()).toBeTruthy();
		await waitForPdfReady(page);
		await expect(page.locator('body')).not.toContainText('Internal Error');
	});

	test('purchase-order preview renders without errors', async ({ page }) => {
		const resp = await page.goto('/pdf/purchase-order?brand=alrein');
		expect(resp?.ok()).toBeTruthy();
		await waitForPdfReady(page);
	});
});
