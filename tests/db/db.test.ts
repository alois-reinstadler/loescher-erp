import { describe, it, expect, afterEach } from 'vitest';
import { eq } from 'drizzle-orm';
import { tenants, tenantMemberships } from '$lib/server/db/schema';
import { createTestDb, disposeTestDb, type TestDb } from './in-memory.js';

let db: TestDb;

afterEach(async () => {
	if (db) await disposeTestDb(db);
});

describe('in-memory database', () => {
	it('applies migrations and round-trips a tenant row', async () => {
		db = await createTestDb();
		const [created] = await db
			.insert(tenants)
			.values({ name: 'Loescher Test GmbH', slug: 'loescher-test' })
			.returning();

		expect(created).toBeDefined();
		expect(created.id).toMatch(/^[0-9a-f-]{36}$/i);
		expect(created.defaultCurrency).toBe('EUR');
		expect(created.active).toBe(true);

		const [found] = await db.select().from(tenants).where(eq(tenants.slug, 'loescher-test'));
		expect(found.name).toBe('Loescher Test GmbH');
	});

	it('enforces the unique tenant slug index', async () => {
		db = await createTestDb();
		await db.insert(tenants).values({ name: 'A', slug: 'dup' });
		await expect(db.insert(tenants).values({ name: 'B', slug: 'dup' })).rejects.toThrow();
	});

	it('cascades membership deletion when a tenant is removed', async () => {
		db = await createTestDb();
		const [t] = await db.insert(tenants).values({ name: 'Cascade', slug: 'cascade' }).returning();
		await db.insert(tenantMemberships).values({
			tenantId: t.id,
			userId: 'user-1',
			role: 'owner'
		});

		const before = await db
			.select()
			.from(tenantMemberships)
			.where(eq(tenantMemberships.tenantId, t.id));
		expect(before).toHaveLength(1);

		await db.delete(tenants).where(eq(tenants.id, t.id));

		const after = await db
			.select()
			.from(tenantMemberships)
			.where(eq(tenantMemberships.tenantId, t.id));
		expect(after).toHaveLength(0);
	});
});
