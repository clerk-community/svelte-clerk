import adapter from '@sveltejs/adapter-auto';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
// import adapter from '@sveltejs/adapter-static';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter(),
		experimental: {
			remoteFunctions: true,
			explicitEnvironmentVariables: true
		}
	},
	// `script: true` transpiles TypeScript out of `<script>` blocks when packaging.
	// Without it, Svelte 5's default `vitePreprocess()` leaves TS in the published
	// `.svelte` files, which breaks consumers whose bundler parses dependency
	// `.svelte` scripts as plain JS during dependency optimization (e.g. Vite 8 /
	// rolldown). See https://github.com/wobsoriano/svelte-clerk/issues/438
	preprocess: vitePreprocess({ script: true }),
	compilerOptions: {
		experimental: {
			async: true
		}
	}
};

export default config;
