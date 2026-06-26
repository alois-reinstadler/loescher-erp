import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import { betterAuth } from 'better-auth/minimal';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';

const client = createClient({ url: process.env.DATABASE_URL ?? 'file:data/local.db' });
const db = drizzle(client);

export const auth = betterAuth({
	baseURL: process.env.ORIGIN ?? 'http://localhost:5173',
	secret: process.env.BETTER_AUTH_SECRET ?? 'dev-only-better-auth-secret-32-chars',
	database: drizzleAdapter(db, { provider: 'sqlite' }),
	emailAndPassword: { enabled: true }
});
