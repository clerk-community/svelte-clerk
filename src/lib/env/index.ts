import type { EnvVarConfig } from '@sveltejs/kit';
import type { SessionAuthObject } from '@clerk/backend';
import type { PendingSessionOptions } from '@clerk/shared/types';
import { isTruthy } from '@clerk/shared/underscore';

declare global {
	// eslint-disable-next-line @typescript-eslint/no-namespace
	namespace App {
		interface Locals {
			auth: (options?: PendingSessionOptions) => SessionAuthObject;
		}
	}
}

type Validator<T> = NonNullable<EnvVarConfig<T>['schema']>;

// SvelteKit accepts any Standard Schema validator; this wraps a plain
// transform function into the smallest possible one.
function schema<T>(validate: (value: string | undefined) => T): Validator<T> {
	return {
		'~standard': {
			version: 1,
			vendor: 'svelte-clerk',
			validate: (value) => ({ value: validate(value as string | undefined) })
		}
	};
}

interface ClerkPrivateVar<T> {
	schema: Validator<T>;
	description: string;
}

interface ClerkPublicVar<T> {
	public: true;
	static: boolean;
	schema: Validator<T>;
	description: string;
}

export interface ClerkEnvVarsOptions {
	/**
	 * When `true`, the public Clerk variables are declared with `static: true`, so their
	 * build-time values are inlined into the bundle (enabling optimisations like
	 * dead-code elimination). Private variables (secrets) are always dynamic and are
	 * read from the environment at runtime, regardless of this option.
	 * @default false
	 */
	static?: boolean;
}

export interface ClerkEnvVars {
	CLERK_SECRET_KEY: ClerkPrivateVar<string | undefined>;
	CLERK_JWT_KEY: ClerkPrivateVar<string | undefined>;
	CLERK_MACHINE_SECRET_KEY: ClerkPrivateVar<string | undefined>;
	CLERK_WEBHOOK_SIGNING_SECRET: ClerkPrivateVar<string | undefined>;
	CLERK_API_URL: ClerkPrivateVar<string | undefined>;
	CLERK_API_VERSION: ClerkPrivateVar<string>;
	CLERK_PUBLISHABLE_KEY: ClerkPublicVar<string | undefined>;
	CLERK_SIGN_IN_URL: ClerkPublicVar<string | undefined>;
	CLERK_SIGN_UP_URL: ClerkPublicVar<string | undefined>;
	CLERK_SIGN_IN_FORCE_REDIRECT_URL: ClerkPublicVar<string | undefined>;
	CLERK_SIGN_UP_FORCE_REDIRECT_URL: ClerkPublicVar<string | undefined>;
	CLERK_SIGN_IN_FALLBACK_REDIRECT_URL: ClerkPublicVar<string | undefined>;
	CLERK_SIGN_UP_FALLBACK_REDIRECT_URL: ClerkPublicVar<string | undefined>;
	CLERK_DOMAIN: ClerkPublicVar<string | undefined>;
	CLERK_PROXY_URL: ClerkPublicVar<string | undefined>;
	CLERK_IS_SATELLITE: ClerkPublicVar<boolean>;
	CLERK_JS_URL: ClerkPublicVar<string | undefined>;
	CLERK_JS_VERSION: ClerkPublicVar<string | undefined>;
	CLERK_TELEMETRY_DISABLED: ClerkPublicVar<boolean>;
	CLERK_TELEMETRY_DEBUG: ClerkPublicVar<boolean>;
}

const optional = schema((value) => value);
const boolean = schema((value) => isTruthy(value));

/**
 * The environment variables Clerk reads, ready to spread into `defineEnvVars`.
 *
 * Missing values never fail the boot — the Clerk libraries themselves throw
 * descriptive errors at the point a required key is actually needed.
 *
 * @example
 * // src/env.ts
 * import { defineEnvVars } from '@sveltejs/kit/env';
 * import { clerkEnvVars } from 'svelte-clerk/env';
 *
 * export const variables = defineEnvVars({
 *   ...clerkEnvVars()
 * });
 */
export function clerkEnvVars(options: ClerkEnvVarsOptions = {}): ClerkEnvVars {
	const isStatic = options.static ?? false;

	const publicVar = (description: string): ClerkPublicVar<string | undefined> => ({
		public: true,
		static: isStatic,
		schema: optional,
		description
	});

	const publicBoolean = (description: string): ClerkPublicVar<boolean> => ({
		public: true,
		static: isStatic,
		schema: boolean,
		description
	});

	const privateVar = (description: string): ClerkPrivateVar<string | undefined> => ({
		schema: optional,
		description
	});

	return {
		CLERK_SECRET_KEY: privateVar(
			'The Clerk secret key from the API keys page in the Clerk Dashboard.'
		),
		CLERK_JWT_KEY: privateVar(
			'The PEM public key from the API keys page in the Clerk Dashboard, used for networkless session token verification.'
		),
		CLERK_MACHINE_SECRET_KEY: privateVar(
			'The Clerk machine secret key, used to authenticate machine-to-machine requests.'
		),
		CLERK_WEBHOOK_SIGNING_SECRET: privateVar(
			'The signing secret for verifying Clerk webhook payloads.'
		),
		CLERK_API_URL: privateVar(
			'The Clerk Backend API URL. Defaults to the URL derived from the publishable key.'
		),
		CLERK_API_VERSION: {
			schema: schema((value) => value ?? 'v1'),
			description: 'The Clerk Backend API version.'
		},
		CLERK_PUBLISHABLE_KEY: publicVar(
			'The Clerk publishable key from the API keys page in the Clerk Dashboard.'
		),
		CLERK_SIGN_IN_URL: publicVar(
			'The URL of the sign-in page. Required for satellite applications on development instances.'
		),
		CLERK_SIGN_UP_URL: publicVar('The URL of the sign-up page.'),
		CLERK_SIGN_IN_FORCE_REDIRECT_URL: publicVar(
			'If set, the user is always redirected to this URL after signing in.'
		),
		CLERK_SIGN_UP_FORCE_REDIRECT_URL: publicVar(
			'If set, the user is always redirected to this URL after signing up.'
		),
		CLERK_SIGN_IN_FALLBACK_REDIRECT_URL: publicVar(
			'The fallback URL to redirect to after signing in, when no redirect_url is present.'
		),
		CLERK_SIGN_UP_FALLBACK_REDIRECT_URL: publicVar(
			'The fallback URL to redirect to after signing up, when no redirect_url is present.'
		),
		CLERK_DOMAIN: publicVar('The domain of a satellite application.'),
		CLERK_PROXY_URL: publicVar('The URL of the Clerk proxy, if using a proxy configuration.'),
		CLERK_IS_SATELLITE: publicBoolean(
			'Whether the application is a satellite in a multi-domain setup.'
		),
		CLERK_JS_URL: publicVar('A custom URL to load the @clerk/clerk-js script from.'),
		CLERK_JS_VERSION: publicVar('The version of @clerk/clerk-js to load.'),
		CLERK_TELEMETRY_DISABLED: publicBoolean('Whether Clerk telemetry is disabled.'),
		CLERK_TELEMETRY_DEBUG: publicBoolean(
			'Whether Clerk telemetry events are logged to the console instead of being sent.'
		)
	};
}
