import '@dotenvx/dotenvx/config';
import { defineConfig, devices } from '@playwright/test';

// Run `pnpm test:setup` first to pack the library into the SvelteKit 3 app.
export default defineConfig({
	webServer: [
		{
			command: 'npm run build && npm run preview',
			port: 4173
		},
		{
			command: 'pnpm exec vite build && pnpm exec vite preview --port 4174 --strictPort',
			cwd: './test-apps/sveltekit-3',
			port: 4174
		}
	],
	testDir: 'e2e',
	use: {
		headless: true
	},
	projects: [
		{
			name: 'setup Clerk',
			testMatch: /global\.setup\.ts/
		},
		{
			name: 'chromium with Clerk',
			testMatch: /demo\.test\.ts/,
			use: { ...devices['Desktop Chrome'], baseURL: 'http://localhost:4173' },
			dependencies: ['setup Clerk']
		},
		{
			name: 'sveltekit-3 with Clerk',
			testMatch: /sveltekit-3\.test\.ts/,
			use: { ...devices['Desktop Chrome'], baseURL: 'http://localhost:4174' },
			dependencies: ['setup Clerk']
		}
	]
});
