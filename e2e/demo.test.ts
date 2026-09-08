import '@dotenvx/dotenvx/config';
import { expect, test } from '@playwright/test';
import { createPageObjects } from '@clerk/testing/playwright/unstable';

const USER_EMAIL = process.env.E2E_CLERK_USER_USERNAME;
const USER_PASSWORD = process.env.E2E_CLERK_USER_PASSWORD;

if (!USER_EMAIL || !USER_PASSWORD) {
	throw new Error('E2E_CLERK_USER_USERNAME and E2E_CLERK_USER_PASSWORD must be set');
}

test.describe.configure({ mode: 'parallel' });

test('Clerk client loads and sign in button renders', async ({ page, baseURL }) => {
	const po = createPageObjects({ page, baseURL });
	await po.page.goToAppHome();
	await po.page.waitForClerkJsLoaded();
	await po.expect.toBeSignedOut();
	await expect(po.page.getByRole('link', { name: /Sign in/i })).toBeVisible();
});

test('render user button component when user completes sign in flow', async ({ page, baseURL }) => {
	const po = createPageObjects({ page, baseURL });
	await po.page.goToRelative('/sign-in');
	await po.signIn.waitForMounted();
	await po.signIn.signInWithEmailAndInstantPassword({ email: USER_EMAIL, password: USER_PASSWORD });
	await po.expect.toBeSignedIn();

	await po.page.waitForAppUrl('/profile');
	await po.userButton.waitForMounted();
	await po.userButton.toggleTrigger();
	await po.userButton.waitForPopover();
});

test('render user profile and current user data', async ({ page, baseURL }) => {
	const po = createPageObjects({ page, baseURL });
	await po.page.goToRelative('/sign-in');
	await po.signIn.waitForMounted();
	await po.signIn.signInWithEmailAndInstantPassword({ email: USER_EMAIL, password: USER_PASSWORD });
	await po.expect.toBeSignedIn();

	await po.page.waitForAppUrl('/profile');
	await po.userProfile.waitForMounted();
	await expect(po.page.getByText(`User ID: ${USER_EMAIL}`)).toBeVisible();
});

test('redirects to sign-in when unauthenticated', async ({ page, baseURL }) => {
	const po = createPageObjects({ page, baseURL });
	await po.page.goToRelative('/profile');
	await po.page.waitForURL(`${baseURL}/sign-in`);
	await po.signIn.waitForMounted();
});

test('<SignInButton /> renders and respects props', async ({ page, baseURL }) => {
	const po = createPageObjects({ page, baseURL });
	await po.page.goToRelative('/unstyled');
	await po.expect.toBeSignedOut();
	await po.page.waitForClerkJsLoaded();

	await po.page.getByRole('button', { name: /Sign in/i }).click();
	await po.signIn.waitForMounted();
	await po.signIn.signInWithEmailAndInstantPassword({ email: USER_EMAIL, password: USER_PASSWORD });

	await po.page.waitForAppUrl('/');
	await po.expect.toBeSignedIn();
});

test('Update Clerk options on the fly', async ({ page, baseURL }) => {
	const po = createPageObjects({ page, baseURL });

	// Navigate and wait for sign-in component to load
	await po.page.goToRelative('/sign-in');
	await po.signIn.waitForMounted();

	// Verify initial English state
	await expect(po.page.getByText('Welcome back! Please sign in to continue')).toBeVisible();

	// Change to French and verify
	await po.page.locator('select').selectOption({ label: 'fr' });
	await expect(po.page.getByText('pour continuer vers')).toBeVisible();

	// Revert to English and verify
	await po.page.locator('select').selectOption({ label: 'en' });
	await expect(po.page.getByText('Welcome back! Please sign in to continue')).toBeVisible();
});

test.describe('<Show /> server-side rendering', () => {
	const SIGNED_IN_TEXT = 'You are signed in!';
	const SIGNED_OUT_TEXT = 'You are not signed in!';

	function collectHydrationIssues(page: Parameters<typeof createPageObjects>[0]['page']) {
		const issues: string[] = [];
		page.on('console', (msg) => {
			if (/hydrat/i.test(msg.text())) issues.push(`console: ${msg.text()}`);
		});
		page.on('pageerror', (err) => {
			if (/hydrat/i.test(err.message)) issues.push(`pageerror: ${err.message}`);
		});
		return issues;
	}

	test('renders signed-out content in the server HTML', async ({ page }) => {
		const response = await page.request.get('/');
		expect(response.ok()).toBe(true);

		const html = await response.text();
		expect(html).toContain(SIGNED_OUT_TEXT);
		expect(html).not.toContain(SIGNED_IN_TEXT);
	});

	test('renders signed-in content in the server HTML after sign in', async ({ page, baseURL }) => {
		const po = createPageObjects({ page, baseURL });
		await po.page.goToRelative('/sign-in');
		await po.signIn.waitForMounted();
		await po.signIn.signInWithEmailAndInstantPassword({
			email: USER_EMAIL,
			password: USER_PASSWORD
		});
		await po.expect.toBeSignedIn();

		const response = await page.request.get('/');
		expect(response.ok()).toBe(true);

		const html = await response.text();
		expect(html).toContain(SIGNED_IN_TEXT);
		expect(html).not.toContain(SIGNED_OUT_TEXT);
	});

	test('hydrates without warnings when signed out', async ({ page, baseURL }) => {
		const po = createPageObjects({ page, baseURL });
		const issues = collectHydrationIssues(page);

		await po.page.goToAppHome();
		await po.page.waitForClerkJsLoaded();
		await po.expect.toBeSignedOut();

		await expect(page.getByText(SIGNED_OUT_TEXT)).toBeVisible();
		expect(issues).toEqual([]);
	});

	test('hydrates without warnings when signed in', async ({ page, baseURL }) => {
		const po = createPageObjects({ page, baseURL });
		await po.page.goToRelative('/sign-in');
		await po.signIn.waitForMounted();
		await po.signIn.signInWithEmailAndInstantPassword({
			email: USER_EMAIL,
			password: USER_PASSWORD
		});
		await po.expect.toBeSignedIn();

		const issues = collectHydrationIssues(page);
		await po.page.goToAppHome();
		await po.page.waitForClerkJsLoaded();

		await expect(page.getByText(SIGNED_IN_TEXT)).toBeVisible();
		expect(issues).toEqual([]);
	});
});
