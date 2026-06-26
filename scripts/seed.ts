import { createClient } from '@libsql/client';
import { and, eq } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/libsql';
import { betterAuth } from 'better-auth/minimal';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { pathToFileURL } from 'node:url';
import * as schema from '../src/lib/server/db/schema.ts';

export const DEFAULT_SEED_ADMIN_EMAIL = 'admin@loescher.local';
export const DEFAULT_SEED_ADMIN_PASSWORD = 'loescher-dev-admin-2026!ChangeMe';

const tenantSeed = {
	name: 'Löscher Group',
	slug: 'loescher-group',
	defaultCurrency: 'EUR'
};

const companySeeds = [
	{
		name: 'Löscher',
		slug: 'loescher',
		legalName: 'Löscher GmbH',
		addressLines: ['Löscherstraße 1', '1010 Wien'],
		countryCode: 'AT',
		vatId: 'ATU00000001',
		iban: 'AT000000000000000001',
		bic: 'LOESATWW',
		email: 'office@loescher.local',
		phone: '+43 1 0000001',
		branding: { brand: 'loescher' }
	},
	{
		name: 'Rideau',
		slug: 'rideau',
		legalName: 'Rideau GmbH',
		addressLines: ['Rideauweg 2', '1010 Wien'],
		countryCode: 'AT',
		vatId: 'ATU00000002',
		iban: 'AT000000000000000002',
		bic: 'RIDEATWW',
		email: 'office@rideau.local',
		phone: '+43 1 0000002',
		branding: { brand: 'rideau' }
	},
	{
		name: 'Aziza',
		slug: 'aziza',
		legalName: 'Aziza GmbH',
		addressLines: ['Azizagasse 3', '1010 Wien'],
		countryCode: 'AT',
		vatId: 'ATU00000003',
		iban: 'AT000000000000000003',
		bic: 'AZIZATWW',
		email: 'office@aziza.local',
		phone: '+43 1 0000003',
		branding: { brand: 'aziza' }
	}
];

export type SeedDb = ReturnType<typeof drizzle<typeof schema>>;

export function createSeedAuth(database: SeedDb) {
	return betterAuth({
		baseURL: process.env.ORIGIN ?? 'http://localhost:5173',
		secret: process.env.BETTER_AUTH_SECRET ?? 'dev-only-better-auth-secret-32-chars',
		database: drizzleAdapter(database, { provider: 'sqlite' }),
		emailAndPassword: { enabled: true }
	});
}

export async function seedDatabase(database: SeedDb, auth = createSeedAuth(database)) {
	const now = new Date().toISOString();
	const adminEmail = process.env.SEED_ADMIN_EMAIL ?? DEFAULT_SEED_ADMIN_EMAIL;
	const adminPassword = process.env.SEED_ADMIN_PASSWORD ?? DEFAULT_SEED_ADMIN_PASSWORD;

	let [tenant] = await database
		.select()
		.from(schema.tenants)
		.where(eq(schema.tenants.slug, tenantSeed.slug))
		.limit(1);

	if (!tenant) {
		[tenant] = await database
			.insert(schema.tenants)
			.values({ ...tenantSeed, createdAt: now, updatedAt: now })
			.returning();
	} else {
		await database
			.update(schema.tenants)
			.set({ name: tenantSeed.name, defaultCurrency: tenantSeed.defaultCurrency, updatedAt: now })
			.where(eq(schema.tenants.id, tenant.id));
	}

	for (const company of companySeeds) {
		const [existingCompany] = await database
			.select()
			.from(schema.companies)
			.where(and(eq(schema.companies.tenantId, tenant.id), eq(schema.companies.slug, company.slug)))
			.limit(1);

		if (!existingCompany) {
			await database.insert(schema.companies).values({
				...company,
				tenantId: tenant.id,
				active: true,
				createdAt: now,
				updatedAt: now
			});
		} else {
			await database
				.update(schema.companies)
				.set({ ...company, active: true, updatedAt: now })
				.where(eq(schema.companies.id, existingCompany.id));
		}
	}

	let [adminUser] = await database
		.select()
		.from(schema.user)
		.where(eq(schema.user.email, adminEmail))
		.limit(1);

	if (!adminUser) {
		await auth.api.signUpEmail({
			body: {
				name: 'Admin',
				email: adminEmail,
				password: adminPassword
			}
		});

		const [createdUser] = await database
			.select()
			.from(schema.user)
			.where(eq(schema.user.email, adminEmail))
			.limit(1);

		if (!createdUser) {
			throw new Error(`Seed admin user ${adminEmail} was not created`);
		}

		adminUser = createdUser;
	}

	const [membership] = await database
		.select()
		.from(schema.tenantMemberships)
		.where(
			and(
				eq(schema.tenantMemberships.tenantId, tenant.id),
				eq(schema.tenantMemberships.userId, adminUser.id)
			)
		)
		.limit(1);

	if (!membership) {
		await database.insert(schema.tenantMemberships).values({
			tenantId: tenant.id,
			userId: adminUser.id,
			role: 'owner',
			status: 'active',
			createdAt: now,
			updatedAt: now
		});
	}

	return {
		tenantId: tenant.id,
		adminUserId: adminUser.id,
		adminEmail
	};
}

export async function main() {
	const databaseUrl = process.env.DATABASE_URL;

	if (!databaseUrl) {
		throw new Error('DATABASE_URL is not set');
	}

	const client = createClient({ url: databaseUrl });
	const database = drizzle(client, { schema });

	try {
		const result = await seedDatabase(database);
		console.log(`Seeded ${tenantSeed.name} with admin ${result.adminEmail}.`);
	} finally {
		client.close();
	}
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
	await main();
}
