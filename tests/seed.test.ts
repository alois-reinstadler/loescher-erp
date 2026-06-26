import { afterEach, describe, expect, it } from 'vitest';
import { count, eq } from 'drizzle-orm';
import type { SQLiteTable } from 'drizzle-orm/sqlite-core';
import {
	account,
	companies,
	tenantMemberships,
	tenants,
	user
} from '../src/lib/server/db/schema.ts';
import { seedDatabase } from '../scripts/seed.ts';
import { createTestDb, disposeTestDb, type TestDb } from './db/in-memory.js';

let db: TestDb;

afterEach(async () => {
	if (db) await disposeTestDb(db);
});

async function rowCount(table: SQLiteTable) {
	const [result] = await db.select({ value: count() }).from(table);
	return result.value;
}

describe('seedDatabase', () => {
	it('is idempotent', async () => {
		db = await createTestDb();

		await seedDatabase(db);
		await seedDatabase(db);

		expect(await rowCount(tenants)).toBe(1);
		expect(await rowCount(companies)).toBe(3);
		expect(await rowCount(user)).toBe(1);
		expect(await rowCount(account)).toBe(1);
		expect(await rowCount(tenantMemberships)).toBe(1);

		const [tenant] = await db.select().from(tenants).where(eq(tenants.slug, 'loescher-group'));
		const seededCompanies = await db
			.select()
			.from(companies)
			.where(eq(companies.tenantId, tenant.id));

		expect(seededCompanies.map((company) => company.slug).sort()).toEqual([
			'aziza',
			'loescher',
			'rideau'
		]);
	});
});
