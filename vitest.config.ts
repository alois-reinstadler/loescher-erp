import { fileURLToPath, resolve } from 'node:url';
import { defineConfig } from 'vitest/config';
import { svelte } from '@sveltejs/vite-plugin-svelte';

const root = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig({
	plugins: [
		svelte({
			compilerOptions: {
				// Match vite.config.ts: force runes only for first-party source, not
				// for libraries that still ship legacy Svelte components.
				runes: ({ filename }) =>
					filename.split(/[/\\]/).includes('node_modules') ? undefined : true,
				experimental: { async: true }
			}
		})
	],
	resolve: {
		alias: {
			// $lib is a real directory, so we can alias it directly. $app/* virtual
			// modules are SvelteKit-internal; tests stub the ones they touch.
			$lib: resolve(root, 'src/lib'),
			'$app/env/private': resolve(root, 'tests/stubs/app-env-private.ts'),
			'$app/env': resolve(root, 'tests/stubs/app-env.ts')
		}
	},
	test: {
		// Default environment for logic/server tests. Component tests opt into
		// jsdom with a `// @vitest-environment jsdom` pragma at the top of the
		// file (see tests/component-setup.ts).
		environment: 'node',
		globals: false,
		// Only collect *.test.ts — never the Playwright *.spec.ts suites.
		include: ['src/**/*.test.ts', 'tests/**/*.test.ts'],
		exclude: ['tests/e2e/**', 'node_modules/**', 'build/**'],
		coverage: {
			provider: 'v8',
			reporter: ['text', 'html', 'lcov'],
			reportsDir: 'coverage',
			include: ['src/lib/**/*.{ts,svelte}'],
			exclude: ['src/lib/components/ui/**', 'src/lib/paraglide/**', 'src/lib/**/*.test.ts']
		},
		pool: 'forks'
	}
});
