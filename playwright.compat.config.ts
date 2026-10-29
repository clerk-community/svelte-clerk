import { defineConfig, devices } from '@playwright/test';
import { env } from './e2e-compat/env';

// Runs the same suite against a SvelteKit 2 app (the repository root) and a SvelteKit 3 app
// (test-apps/sveltekit-3). Run it with `pnpm test:compat`, which installs the test app first.
const apps = [
	{ name: 'sveltekit-2', port: 4273, cwd: '.' },
	{ name: 'sveltekit-3', port: 4274, cwd: './test-apps/sveltekit-3' }
];

export default defineConfig({
	testDir: 'e2e-compat',
	use: {
		headless: true
	},
	webServer: apps.map(({ port, cwd }) => ({
		command: `pnpm exec vite build && pnpm exec vite preview --port ${port} --strictPort`,
		cwd,
		port,
		env,
		reuseExistingServer: false
	})),
	projects: apps.map(({ name, port }) => ({
		name,
		use: { ...devices['Desktop Chrome'], baseURL: `http://localhost:${port}` }
	}))
});
