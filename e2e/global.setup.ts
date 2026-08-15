import '@dotenvx/dotenvx/config';
import { clerkSetup } from '@clerk/testing/playwright';
import { test as setup } from '@playwright/test';

setup.describe.configure({ mode: 'serial' });

setup('global setup', async ({}) => {
	await clerkSetup({
		publishableKey: process.env.CLERK_PUBLISHABLE_KEY,
		secretKey: process.env.CLERK_SECRET_KEY
	});
});
