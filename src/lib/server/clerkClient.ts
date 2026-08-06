import { createClerkClient as createBackendClerkClient } from '@clerk/backend';
import {
	CLERK_API_URL,
	CLERK_API_VERSION,
	CLERK_JWT_KEY,
	CLERK_MACHINE_SECRET_KEY,
	CLERK_SECRET_KEY
} from '$app/env/private';
import {
	CLERK_DOMAIN,
	CLERK_IS_SATELLITE,
	CLERK_PROXY_URL,
	CLERK_PUBLISHABLE_KEY,
	CLERK_TELEMETRY_DEBUG,
	CLERK_TELEMETRY_DISABLED
} from '$app/env/public';
import { apiUrlFromPublishableKey } from '@clerk/shared/apiUrlFromPublishableKey';
import { PACKAGE_NAME, PACKAGE_VERSION } from '$lib/version.js';

type ClerkClientOptions = NonNullable<Parameters<typeof createBackendClerkClient>[0]>;

function defaultOptions(): ClerkClientOptions {
	return {
		secretKey: CLERK_SECRET_KEY,
		jwtKey: CLERK_JWT_KEY,
		machineSecretKey: CLERK_MACHINE_SECRET_KEY,
		publishableKey: CLERK_PUBLISHABLE_KEY,
		apiUrl:
			CLERK_API_URL ??
			(CLERK_PUBLISHABLE_KEY ? apiUrlFromPublishableKey(CLERK_PUBLISHABLE_KEY) : undefined),
		apiVersion: CLERK_API_VERSION,
		proxyUrl: CLERK_PROXY_URL,
		domain: CLERK_DOMAIN,
		isSatellite: CLERK_IS_SATELLITE,
		userAgent: `${PACKAGE_NAME}@${PACKAGE_VERSION}`,
		sdkMetadata: {
			name: PACKAGE_NAME,
			version: PACKAGE_VERSION
		},
		telemetry: {
			disabled: CLERK_TELEMETRY_DISABLED,
			debug: CLERK_TELEMETRY_DEBUG
		}
	};
}

/**
 * Creates a Clerk Backend API client with the environment-derived defaults,
 * letting you override any of them.
 *
 * @example
 * import { createClerkClient } from 'svelte-clerk/server';
 *
 * const client = createClerkClient({ secretKey: 'sk_...' });
 */
export function createClerkClient(options?: ClerkClientOptions) {
	return createBackendClerkClient({ ...defaultOptions(), ...options });
}

/**
 * Returns a Clerk Backend API client configured from your environment variables.
 * A fresh client is created on every call, so the current environment is always used.
 *
 * @example
 * import { clerkClient } from 'svelte-clerk/server';
 *
 * const user = await clerkClient().users.getUser(userId);
 */
export function clerkClient() {
	return createClerkClient();
}
