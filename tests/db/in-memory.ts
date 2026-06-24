import { drizzle } from 'drizzle-orm/libsql';
import { createClient, type Client } from '@libsql/client';
import { migrate } from 'drizzle-orm/libsql/migrator';
import { resolve } from 'node:path';
import * as schema from '$lib/server/db/schema';

export type TestDb = ReturnType<typeof drizzle<typeof schema>>;

const migrationsFolder = resolve(process.cwd(), 'drizzle');

export async function createTestDb(client?: Client): Promise<TestDb> {
	const c = client ?? createClient({ url: ':memory:' });
	const db = drizzle(c, { schema });
	await migrate(db, { migrationsFolder });
	return db;
}

export async function disposeTestDb(db: TestDb): Promise<void> {
	// libsql in-memory clients auto-free on GC; close to release the connection.
	const client = (db as unknown as { $client?: Client }).$client;
	if (client && typeof client.close === 'function') {
		await client.close();
	}
}
