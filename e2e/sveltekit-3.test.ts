import '@dotenvx/dotenvx/config';
import { expect, test } from '@playwright/test';
import { createPageObjects } from '@clerk/testing/playwright/unstable';

// Runs against the SvelteKit 3 app in test-apps/sveltekit-3 with a real Clerk instance.
const USER_EMAIL = process.env.E2E_CLERK_USER_USERNAME;
const USER_PASSWORD = process.env.E2E_CLERK_USER_PASSWORD;

const SIGNED_IN_TEXT = 'You are signed in!';
const SIGNED_OUT_TEXT = 'You are not signed in!';

test.describe.configure({ mode: 'parallel' });

test('Clerk client loads and renders the signed-out state', async ({ page, baseURL }) => {
	const po = createPageObjects({ page, baseURL });
	await po.page.goToAppHome();
	await po.page.waitForClerkJsLoaded();
	await po.expect.toBeSignedOut();
	await expect(page.getByText(SIGNED_OUT_TEXT)).toBeVisible();
});

test('redirects to sign-in when unauthenticated', async ({ page, baseURL }) => {
	const po = createPageObjects({ page, baseURL });
	await po.page.goToRelative('/profile');
	await po.page.waitForURL(`${baseURL}/sign-in`);
	await po.signIn.waitForMounted();
});

test.describe('signed in', () => {
	test.skip(!USER_EMAIL || !USER_PASSWORD, 'E2E_CLERK_USER_USERNAME and _PASSWORD are not set');

	test.beforeEach(async ({ page, baseURL }) => {
		const po = createPageObjects({ page, baseURL });
		await po.page.goToRelative('/sign-in');
		await po.signIn.waitForMounted();
		await po.signIn.signInWithEmailAndInstantPassword({
			email: USER_EMAIL!,
			password: USER_PASSWORD!
		});
		await po.expect.toBeSignedIn();
		await po.page.waitForAppUrl('/profile');
	});

	test('renders the user profile and current user data', async ({ page, baseURL }) => {
		const po = createPageObjects({ page, baseURL });
		await po.userProfile.waitForMounted();
		await expect(page.getByText(`User ID: ${USER_EMAIL}`)).toBeVisible();
	});

	test('renders signed-in content in the server HTML', async ({ page }) => {
		const response = await page.request.get('/');
		expect(response.ok()).toBe(true);

		const html = await response.text();
		expect(html).toContain(SIGNED_IN_TEXT);
		expect(html).not.toContain(SIGNED_OUT_TEXT);
	});

	test('stays signed in across a full page load', async ({ page, baseURL }) => {
		const po = createPageObjects({ page, baseURL });
		await page.reload();
		await po.page.waitForClerkJsLoaded();
		await po.expect.toBeSignedIn();
		await po.page.waitForAppUrl('/profile');
	});
});
