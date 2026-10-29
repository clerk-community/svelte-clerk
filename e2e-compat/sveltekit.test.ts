import { createHmac } from 'node:crypto';
import { expect, test, type Page } from '@playwright/test';
import { PUBLISHABLE_KEY, SIGN_IN_URL, WEBHOOK_SIGNING_SECRET } from './env';

type RouterFn = (to: string, metadata?: Record<string, unknown>) => unknown;

declare global {
	interface Window {
		__clerkOptions?: { publishableKey: string; signInUrl: string } & Record<
			'routerPush' | 'routerReplace',
			RouterFn
		>;
		__sameDocument?: boolean;
	}
}

const internal = { __internal_metadata: { navigationType: 'internal' } };

test.beforeEach(async ({ context, page, baseURL }) => {
	// Without a dev browser cookie, a development instance answers document requests
	// with a handshake redirect to Clerk.
	await context.addCookies([{ name: '__clerk_db_jwt', value: 'compat', url: baseURL }]);

	// Stand in for clerk-js, capturing the options `<ClerkProvider>` loads it with.
	await page.addInitScript(() => {
		const noop = () => {};

		class Clerk {
			loaded = true;
			load = async (options: Window['__clerkOptions']) => {
				window.__clerkOptions = options;
			};
			addListener = (listener: (resources: Record<string, unknown>) => void) => {
				listener({ client: {}, session: null, user: null, organization: null });
				return noop;
			};
		}

		Object.assign(window, {
			__internal_ClerkUICtor: class {},
			Clerk: new Proxy(new Clerk(), {
				get: (target, key) =>
					key in target || typeof key === 'symbol' ? Reflect.get(target, key) : noop
			})
		});
	});
});

async function loadApp(page: Page, path = '/') {
	await page.goto(path);
	await page.waitForFunction(() => !!window.__clerkOptions);
	// Lost on a full page load, kept on a client-side navigation.
	await page.evaluate(() => {
		window.__sameDocument = true;
	});
}

const isSameDocument = (page: Page) => page.evaluate(() => window.__sameDocument === true);

test('authenticates the request and renders on the server', async ({ request }) => {
	const response = await request.get('/');
	expect(response.status()).toBe(200);
	expect(await response.text()).toContain('You are not signed in!');
});

test('passes public environment variables to clerk-js', async ({ page }) => {
	await loadApp(page);

	const options = await page.evaluate(() => ({
		publishableKey: window.__clerkOptions?.publishableKey,
		signInUrl: window.__clerkOptions?.signInUrl
	}));
	expect(options).toEqual({ publishableKey: PUBLISHABLE_KEY, signInUrl: SIGN_IN_URL });

	await expect(page.getByText('You are not signed in!')).toBeVisible();
});

test('routerPush navigates between routes without a page load', async ({ page, baseURL }) => {
	await loadApp(page);

	await page.evaluate(() => window.__clerkOptions?.routerPush('/sign-in'));
	await page.waitForURL(`${baseURL}/sign-in`);
	await expect(page.getByText('You are not signed in!')).toBeHidden();
	expect(await isSameDocument(page)).toBe(true);

	await page.goBack();
	await page.waitForURL(`${baseURL}/`);
	await expect(page.getByText('You are not signed in!')).toBeVisible();
});

test('routerReplace replaces the current history entry', async ({ page, baseURL }) => {
	await loadApp(page);
	const entries = await page.evaluate(() => history.length);

	await page.evaluate(() => window.__clerkOptions?.routerReplace('/sign-in'));
	await page.waitForURL(`${baseURL}/sign-in`);
	await expect(page.getByText('You are not signed in!')).toBeHidden();
	expect(await isSameDocument(page)).toBe(true);
	expect(await page.evaluate(() => history.length)).toBe(entries);
});

test('internal navigations update the URL without leaving the page', async ({ page, baseURL }) => {
	await loadApp(page, '/sign-in');
	const entries = await page.evaluate(() => history.length);

	await page.evaluate(
		(metadata) => window.__clerkOptions?.routerPush('/sign-in/factor-one', metadata),
		internal
	);
	await page.waitForURL(`${baseURL}/sign-in/factor-one`);
	expect(await isSameDocument(page)).toBe(true);
	expect(await page.evaluate(() => history.length)).toBe(entries + 1);

	await page.evaluate(
		(metadata) => window.__clerkOptions?.routerReplace('/sign-in/factor-two', metadata),
		internal
	);
	await page.waitForURL(`${baseURL}/sign-in/factor-two`);
	expect(await isSameDocument(page)).toBe(true);
	expect(await page.evaluate(() => history.length)).toBe(entries + 1);

	await page.goBack();
	await page.waitForURL(`${baseURL}/sign-in`);
	expect(await isSameDocument(page)).toBe(true);
});

test('falls back to a page load for URLs that are not app routes', async ({ page, baseURL }) => {
	await loadApp(page);

	await Promise.all([
		page.waitForEvent('load'),
		page.evaluate(() => window.__clerkOptions?.routerPush('/not-a-route'))
	]);
	expect(page.url()).toBe(`${baseURL}/not-a-route`);
	expect(await isSameDocument(page)).toBe(false);
});

test('verifyWebhook verifies a signed payload', async ({ request }) => {
	const id = 'msg_compat';
	const timestamp = Math.floor(Date.now() / 1000).toString();
	const body = JSON.stringify({ type: 'user.created', object: 'event', data: { id: 'user_1' } });
	const key = Buffer.from(WEBHOOK_SIGNING_SECRET.replace('whsec_', ''), 'base64');
	const signature = createHmac('sha256', key).update(`${id}.${timestamp}.${body}`).digest('base64');
	const headers = {
		'content-type': 'application/json',
		'svix-id': id,
		'svix-timestamp': timestamp
	};

	const verified = await request.post('/api/webhooks', {
		headers: { ...headers, 'svix-signature': `v1,${signature}` },
		data: body
	});
	expect(verified.status()).toBe(200);
	expect(await verified.json()).toEqual({ type: 'user.created' });

	const tampered = await request.post('/api/webhooks', {
		headers: { ...headers, 'svix-signature': `v1,${Buffer.from('nope').toString('base64')}` },
		data: body
	});
	expect(tampered.status()).toBe(400);
});
