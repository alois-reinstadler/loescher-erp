import { defineEnvVars } from '@sveltejs/kit/hooks';

const optionalString = {
	'~standard': {
		version: 1,
		vendor: 'loescher-erp',
		validate(value: unknown) {
			return { value: value === undefined ? undefined : String(value) };
		}
	}
} as const;

export const variables = defineEnvVars({
	DATABASE_URL: { description: 'The database connection string.' },
	ORIGIN: {
		description: 'The app origin (base URL), e.g. `http://localhost:5173`.'
	},
	BETTER_AUTH_SECRET: {
		description:
			'Secret used to sign tokens. For production use 32 characters generated with high entropy. See [Better Auth installation](https://www.better-auth.com/docs/installation).'
	},
	SEED_ADMIN_EMAIL: {
		schema: optionalString,
		description: 'Admin email used by pnpm db:seed.'
	},
	SEED_ADMIN_PASSWORD: {
		schema: optionalString,
		description: 'Admin password used by pnpm db:seed.'
	},
	OPENAI_API_KEY: {
		schema: optionalString,
		description: 'OpenAI API key used for AI image generation (DALL-E).'
	}
});
