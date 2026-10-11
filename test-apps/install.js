// Packs the built library and installs it into each test app the way a consumer would,
// so the apps exercise the published `dist` against their own version of SvelteKit.
import { execFileSync } from 'node:child_process';
import { readdirSync, renameSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const apps = ['sveltekit-3'];

for (const app of apps) {
	const dir = join(root, 'test-apps', app);
	const tarball = join(dir, 'svelte-clerk.tgz');

	rmSync(tarball, { force: true });
	execFileSync('pnpm', ['pack', '--pack-destination', dir], { cwd: root, stdio: 'inherit' });

	const packed = readdirSync(dir).find((file) => /^svelte-clerk-.*\.tgz$/.test(file));
	if (!packed) {
		throw new Error(`pnpm pack did not write a tarball to ${dir}`);
	}
	renameSync(join(dir, packed), tarball);

	// The apps are deliberately not part of the workspace: they need their own dependency tree.
	execFileSync('pnpm', ['install', '--ignore-workspace', '--no-frozen-lockfile'], {
		cwd: dir,
		stdio: 'inherit'
	});
}
