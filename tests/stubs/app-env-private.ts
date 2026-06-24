// Test stub for SvelteKit's $app/env/private virtual module.
// Values are fixed so tests are deterministic and never leak real secrets.
export const DATABASE_URL = ':memory:';
export const ORIGIN = 'http://localhost:4173';
export const BETTER_AUTH_SECRET = 'test-secret-32chars-fixed-for-tests-only';
