import { afterEach, describe, expect, it } from 'vitest';
import type { RequestEvent } from '@sveltejs/kit';
import { companies, tenants } from '$lib/server/db/schema';
import { resolveActiveCompany } from '$lib/server/company-context';
import { createTestDb, disposeTestDb, type TestDb } from './db/in-memory.js';

let db: TestDb;

afterEach(async () => {
	if (db) await disposeTestDb(db);
});

function cookies(value?: string) {
	return {
		get: () => value
	} as unknown as Pick<RequestEvent, 'cookies'>['cookies'];
}

async function createCompanies() {
	const [tenant] = await db
		.insert(tenants)
		.values({ name: 'Löscher Group', slug: 'loescher-group' })
		.returning();

	const insertedCompanies = await db
		.insert(companies)
		.values([
			{
				tenantId: tenant.id,
				name: 'Löscher',
				slug: 'loescher',
				legalName: 'Löscher GmbH',
				addressLines: ['One'],
				countryCode: 'AT'
			},
			{
				tenantId: tenant.id,
				name: 'Rideau',
				slug: 'rideau',
				legalName: 'Rideau GmbH',
				addressLines: ['Two'],
				countryCode: 'AT'
			},
			{
				tenantId: tenant.id,
				name: 'Aziza',
				slug: 'aziza',
				legalName: 'Aziza GmbH',
				addressLines: ['Three'],
				countryCode: 'AT'
			}
		])
		.returning();

	return insertedCompanies;
}

describe('resolveActiveCompany', () => {
	it('uses a valid active company cookie', async () => {
		db = await createTestDb();
		const [, rideau] = await createCompanies();

		const result = await resolveActiveCompany({ cookies: cookies(rideau.id) }, db);

		expect(result.activeCompany?.id).toBe(rideau.id);
		expect(result.companies.map((company) => company.slug)).toEqual([
			'loescher',
			'rideau',
			'aziza'
		]);
	});

	it('falls back to the first company for an invalid cookie', async () => {
		db = await createTestDb();
		await createCompanies();

		const result = await resolveActiveCompany({ cookies: cookies('missing-company') }, db);

		expect(result.activeCompany?.slug).toBe('loescher');
	});

	it('falls back to the first company when the cookie is missing', async () => {
		db = await createTestDb();
		await createCompanies();

		const result = await resolveActiveCompany({ cookies: cookies() }, db);

		expect(result.activeCompany?.slug).toBe('loescher');
	});
});
