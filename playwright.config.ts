import { defineConfig, devices } from '@playwright/test';

const PORT = 4173;
const baseURL = `http://localhost:${PORT}`;

/**
 * E2E + visual regression config.
 *
 * The web server is the SvelteKit dev server with an isolated test env so CI
 * never depends on a local `.env`. Unauthenticated routes (login, register,
 * the PDF previews, and the currently-unguarded dashboard) do not query the
 * database, so an empty e2e.db is sufficient for these suites.
 */
export default defineConfig({
	testDir: './tests/e2e',
	outputDir: './test-results/e2e',
	timeout: 30_000,
	expect: {
		// Self-hosted fonts keep rendering stable; 1% guards antialiasing noise.
		toHaveScreenshot: { maxDiffPixelRatio: 0.01 }
	},
	fullyParallel: true,
	forbidOnly: !!process.env.CI,
	retries: process.env.CI ? 2 : 0,
	workers: process.env.CI ? 1 : undefined,
	reporter: process.env.CI ? [['github'], ['html', { open: 'never' }]] : 'list',
	use: {
		baseURL,
		trace: 'on-first-retry',
		screenshot: 'only-on-failure',
		video: 'retain-on-failure',
		// Pin light mode + neutral theme so screenshots are deterministic
		// (the PDF routes already force light mode via mode-watcher).
		colorScheme: 'light',
		locale: 'de-AT',
		timezoneId: 'Europe/Vienna'
	},
	projects: [
		{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }
		// Add firefox/webkit projects here when broader visual coverage is wanted.
	],
	webServer: {
		command: `pnpm dev --port ${PORT} --host 127.0.0.1`,
		url: baseURL,
		env: {
			DATABASE_URL: 'file:data/e2e.db',
			ORIGIN: baseURL,
			BETTER_AUTH_SECRET: 'e2e-test-secret-32chars-fixed-for-ci-only'
		},
		reuseExistingServer: !process.env.CI,
		timeout: 120_000
	}
});
