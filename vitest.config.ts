import { defineConfig } from 'vitest/config';
import path from 'node:path';

// Unit tests run outside SvelteKit, so the $app/* virtual modules are aliased
// to plain mock modules (overridable per test with vi.mock).
export default defineConfig({
	resolve: {
		alias: {
			'$app/env/private': path.resolve(import.meta.dirname, 'tests/mocks/app-env-private.ts'),
			'$app/env/public': path.resolve(import.meta.dirname, 'tests/mocks/app-env-public.ts'),
			'$app/server': path.resolve(import.meta.dirname, 'tests/mocks/app-server.ts'),
			$lib: path.resolve(import.meta.dirname, 'src/lib')
		}
	},
	test: {
		include: ['src/**/*.test.ts'],
		environment: 'node'
	}
});
