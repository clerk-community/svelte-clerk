import type { SessionAuthObject } from '@clerk/backend';
import type { PendingSessionOptions } from '@clerk/shared/types';

declare global {
	namespace App {
		interface Locals {
			auth: (options?: PendingSessionOptions) => SessionAuthObject;
		}
	}
}

// A hand-rolled Standard Schema (https://standardschema.dev) so this module has no
// dependencies and can be loaded by SvelteKit while it evaluates `src/env.ts`.
type OptionalString = {
	readonly '~standard': {
		readonly version: 1;
		readonly vendor: string;
		readonly validate: (value: unknown) => { readonly value: string | undefined };
		readonly types?: {
			readonly input: string | undefined;
			readonly output: string | undefined;
		};
	};
};

const optionalString: OptionalString = {
	'~standard': {
		version: 1,
		vendor: 'svelte-clerk',
		validate: (value) => ({ value: value as string | undefined })
	}
};

const privateVar = (description: string) => ({ schema: optionalString, description });
const publicVar = (description: string) => ({
	public: true as const,
	schema: optionalString,
	description
});

/**
 * Returns a definition for every environment variable svelte-clerk reads.
 *
 * SvelteKit 3 only exposes environment variables that are declared in `src/env.ts`,
 * so spread the result into `defineEnvVars` to make the Clerk variables available:
 *
 * @example
 * // src/env.ts
 * import { defineEnvVars } from '@sveltejs/kit/env';
 * import { clerkEnvVars } from 'svelte-clerk/env';
 *
 * export const variables = defineEnvVars({
 * 	...clerkEnvVars()
 * });
 *
 * Every variable is declared as optional, so only the ones you set are used.
 * This is not needed on SvelteKit 2.
 */
export function clerkEnvVars() {
	return {
		CLERK_SECRET_KEY: privateVar('Clerk secret key.'),
		CLERK_JWT_KEY: privateVar('PEM public key used for networkless session token verification.'),
		CLERK_API_VERSION: privateVar('Clerk Backend API version.'),
		CLERK_WEBHOOK_SIGNING_SECRET: privateVar('Signing secret used by `verifyWebhook()`.'),
		PUBLIC_CLERK_PUBLISHABLE_KEY: publicVar('Clerk publishable key.'),
		PUBLIC_CLERK_DOMAIN: publicVar('Domain of a satellite application.'),
		PUBLIC_CLERK_IS_SATELLITE: publicVar('Whether this is a satellite application.'),
		PUBLIC_CLERK_PROXY_URL: publicVar('URL of the Clerk Frontend API proxy.'),
		PUBLIC_CLERK_SIGN_IN_URL: publicVar('Full URL or path of the sign-in page.'),
		PUBLIC_CLERK_SIGN_UP_URL: publicVar('Full URL or path of the sign-up page.'),
		PUBLIC_CLERK_SIGN_IN_FORCE_REDIRECT_URL: publicVar('Always redirect here after sign-in.'),
		PUBLIC_CLERK_SIGN_UP_FORCE_REDIRECT_URL: publicVar('Always redirect here after sign-up.'),
		PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL: publicVar(
			'Redirect here after sign-in when there is no `redirect_url`.'
		),
		PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL: publicVar(
			'Redirect here after sign-up when there is no `redirect_url`.'
		),
		PUBLIC_CLERK_JS_URL: publicVar('URL to load clerk-js from.'),
		PUBLIC_CLERK_JS_VERSION: publicVar('Version of clerk-js to load.'),
		PUBLIC_CLERK_API_URL: publicVar('Clerk Backend API URL.'),
		PUBLIC_CLERK_API_VERSION: publicVar('Clerk Backend API version.'),
		PUBLIC_CLERK_TELEMETRY_DISABLED: publicVar('Set to `1` to disable Clerk telemetry.'),
		PUBLIC_CLERK_TELEMETRY_DEBUG: publicVar('Set to `1` to log telemetry events to the console.')
	};
}
