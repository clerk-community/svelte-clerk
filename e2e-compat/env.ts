// Placeholder values, so the suite runs without a Clerk account. The publishable key only
// has to be well-formed: clerk-js is stubbed in the browser and no request reaches Clerk.
export const PUBLISHABLE_KEY = `pk_test_${Buffer.from('compat-test.clerk.accounts.dev$').toString('base64')}`;
export const SECRET_KEY = 'sk_test_compat';
export const WEBHOOK_SIGNING_SECRET = `whsec_${Buffer.from('svelte-clerk-compat-signing-secret').toString('base64')}`;
export const SIGN_IN_URL = '/sign-in';

export const env = {
	PUBLIC_CLERK_PUBLISHABLE_KEY: PUBLISHABLE_KEY,
	PUBLIC_CLERK_SIGN_IN_URL: SIGN_IN_URL,
	PUBLIC_CLERK_TELEMETRY_DISABLED: '1',
	CLERK_SECRET_KEY: SECRET_KEY,
	CLERK_WEBHOOK_SIGNING_SECRET: WEBHOOK_SIGNING_SECRET
};
