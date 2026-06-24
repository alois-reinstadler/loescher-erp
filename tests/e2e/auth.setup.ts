import { test as setup, expect } from '@playwright/test';

/**
 * Auth storage-state setup (currently a no-op stub).
 *
 * The login/register forms are not yet wired to better-auth, so there is no
 * UI flow to obtain a session. Once `login-form.svelte` / `register-form.svelte`
 * call `authClient.signIn` / `signUp`, replace this file with a setup that:
 *
 *   1. POSTs to `/api/auth/sign-up/email` to create a deterministic test user
 *      (against the e2e.db), then
 *   2. POSTs to `/api/auth/sign-in/email` and saves the response cookies to
 *      `tests/e2e/.auth/user.json` via `storageState`.
 *
 * Then add a `setup` project in playwright.config.ts and a `chromium-authed`
 * project with `use: { storageState: 'tests/e2e/.auth/user.json' }` that
 * depends on the setup project. Move the dashboard visual test onto that
 * project and remove the "unguarded" note.
 */

setup('no authenticated session available yet', async () => {
	// Intentionally empty. Kept so the file is picked up and the TODO is visible
	// in test reports until real auth is implemented.
	expect(true).toBe(true);
});
