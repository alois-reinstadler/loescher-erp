import { test, expect } from '@playwright/test';

/**
 * Visual regression baselines.
 *
 * - First run / after intentional UI changes: `pnpm test:e2e:visual -- --update-snapshots`
 *   then commit the updated PNGs under tests/e2e/visual.spec.ts-snapshots/.
 * - A failing screenshot test means the rendered output changed. If the change
 *   is intentional, update the baseline. If not, the AI (or developer) just
 *   caught a regression before it shipped.
 *
 * Screenshots are full-page and pinned to light mode + de-AT locale
 * (see playwright.config.ts) so they stay deterministic.
 */

async function waitForPdfReady(page: import('@playwright/test').Page) {
	await page.waitForFunction(
		() =>
			(window as Window & { __PDF_READY__?: boolean }).__PDF_READY__ === true &&
			!document.querySelector('[data-pdf-pending="true"]'),
		{ timeout: 10_000 }
	);
}

test.describe('visual regression', () => {
	test('login page', async ({ page }) => {
		await page.goto('/login');
		await expect(page.getByText('Loescher ERP').first()).toBeVisible();
		await expect(page).toHaveScreenshot('login.png');
	});

	test('register page', async ({ page }) => {
		await page.goto('/register');
		await expect(page.getByText('Loescher ERP').first()).toBeVisible();
		await expect(page).toHaveScreenshot('register.png');
	});

	test('invoice PDF preview', async ({ page }) => {
		await page.goto('/pdf/invoice?brand=alrein&customer=mahler');
		await waitForPdfReady(page);
		await expect(page).toHaveScreenshot('pdf-invoice.png', { fullPage: true });
	});

	test('dashboard', async ({ page }) => {
		test.setTimeout(60_000);
		// The dashboard is currently served without an auth guard; once auth is
		// enforced, wire tests/e2e/auth.setup.ts and use a storageState project.
		await page.goto('/dashboard');
		await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
		// The page body is rendered inside an {#await} block; wait for the metric
		// cards to appear so we snapshot the resolved (not skeleton) state.
		// NOTE: do not use waitForLoadState('networkidle') — the Vite HMR socket
		// keeps a connection open in dev, so it never resolves.
		await expect(page.locator('[data-slot="card"]').first()).toBeVisible();
		await page.waitForTimeout(300); // let the chart settle before snapshotting
		await expect(page).toHaveScreenshot('dashboard.png', { fullPage: true });
	});
});
