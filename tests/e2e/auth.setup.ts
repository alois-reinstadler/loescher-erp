import { mkdir } from 'node:fs/promises';
import { test as setup, expect } from '@playwright/test';

const authFile = 'tests/e2e/.auth/user.json';
const email = process.env.SEED_ADMIN_EMAIL ?? 'admin@loescher.local';
const password = process.env.SEED_ADMIN_PASSWORD ?? 'loescher-dev-admin-2026!ChangeMe';

setup('authenticate seeded admin', async ({ request }) => {
	const response = await request.post('/api/auth/sign-in/email', {
		data: {
			email,
			password
		}
	});

	expect(response.ok()).toBe(true);
	await mkdir('tests/e2e/.auth', { recursive: true });
	await request.storageState({ path: authFile });
});
