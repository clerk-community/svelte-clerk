import type { RequestEvent } from '@sveltejs/kit';
import { clerkClient } from './clerkClient.js';
import * as constants from './constants.js';
import {
	AuthStatus,
	createClerkRequest,
	TokenType,
	type AuthenticateRequestOptions
} from '@clerk/backend/internal';
import { parse, splitCookiesString } from 'set-cookie-parser';
import type { ClerkRequest } from '@clerk/backend/internal';
import { handleNetlifyCacheInDevInstance } from '@clerk/shared/netlifyCacheHandler';
import type { PendingSessionOptions } from '@clerk/shared/types';
import { handleValueOrFn } from '@clerk/shared/utils';
import { isHttpOrHttps } from '@clerk/shared/proxy';
import { isDevelopmentFromSecretKey } from '@clerk/shared/keys';
import { getDynamicPublicEnvVariables } from '$lib/utils/getDynamicPublicEnvVariables.js';
import { isTruthy } from '@clerk/shared/underscore';
import type { SessionAuthObject } from '@clerk/backend';
import { patchRequest } from './patchRequest.js';
import { isSvelteKit3OrLater } from '$lib/utils/kitVersion.js';

export type ClerkSvelteKitMiddlewareOptions = AuthenticateRequestOptions & { debug?: boolean };

// SvelteKit exports `Handle` from `@sveltejs/kit` in v2 and from `@sveltejs/kit/hooks` in v3,
// so we describe the hook structurally to stay assignable to both.
type Handle = (input: {
	event: RequestEvent;
	resolve: (event: RequestEvent) => Response | Promise<Response>;
}) => Promise<Response>;

export function withClerkHandler(middlewareOptions?: ClerkSvelteKitMiddlewareOptions): Handle {
	return async ({ event, resolve }) => {
		const { debug = false, ...options } = middlewareOptions ?? {};

		const clerkWebRequest = createClerkRequest(patchRequest(event.request));
		if (debug) {
			console.log('[svelte-clerk] ' + JSON.stringify(clerkWebRequest.toJSON()));
		}

		const secretKey = options?.secretKey ?? constants.SECRET_KEY;
		const publishableKey = options?.publishableKey ?? constants.PUBLISHABLE_KEY;

		if (isSvelteKit3OrLater && (!secretKey || !publishableKey)) {
			throw new Error(missingKeysOnSvelteKit3);
		}

		const requestState = await clerkClient.authenticateRequest(clerkWebRequest, {
			...options,
			secretKey,
			publishableKey,
			...handleMultiDomainAndProxy(clerkWebRequest, options),
			acceptsToken: TokenType.SessionToken
		});

		const locationHeader = requestState.headers.get(constants.Headers.Location);
		if (locationHeader) {
			if (debug) {
				console.log('[svelte-clerk] Handshake redirect triggered');
			}
			handleNetlifyCacheInDevInstance({
				locationHeader,
				publishableKey: requestState.publishableKey,
				requestStateHeaders: requestState.headers
			});
			return new Response(null, { status: 307, headers: requestState.headers });
		}

		if (requestState.status === AuthStatus.Handshake) {
			throw new Error('[svelte-clerk] Handshake status without redirect');
		}

		const auth = (options?: PendingSessionOptions) => requestState.toAuth(options);
		decorateLocals(event, auth);

		if (debug) {
			console.log('[svelte-clerk] ' + JSON.stringify(auth()));
		}

		decorateHeaders(event, requestState.headers);

		return resolve(event);
	};
}

function decorateHeaders(event: RequestEvent, headers: Headers) {
	type CookieSerializerOptions = Parameters<typeof event.cookies.set>[2];

	const setCookie = headers.get('set-cookie');
	// We separate cookie setting logic because SvelteKit
	// does not allow setting cookies with setHeaders.
	if (setCookie) {
		const splitCookies = splitCookiesString(setCookie);
		const parsedCookies = parse(splitCookies);
		parsedCookies.forEach((parsedCookie) => {
			const { name, value, ...options } = parsedCookie;

			// For session cookies (including prefixed ones like __session_{suffix}),
			// we need to preserve the original attributes and ensure HttpOnly is not added
			// if it wasn't in the original
			if (name === constants.Cookies.Session || name.startsWith(constants.Cookies.Session)) {
				// Convert parsed cookie options to SvelteKit format
				const cookieOptions: CookieSerializerOptions & { path: string } = {
					path: options.path || '/',
					expires: options.expires,
					maxAge: options.maxAge,
					domain: options.domain,
					secure: options.secure,
					httpOnly: options.httpOnly, // Use Clerk's original setting
					sameSite: options.sameSite as 'lax' | 'strict' | 'none' | undefined
				};

				// Explicitly override SvelteKit's default httpOnly: true
				// This allows Clerk's client-side SDK to access the session
				if (!options.httpOnly) {
					cookieOptions.httpOnly = false; // Explicitly set to false to override SvelteKit's default
				}

				event.cookies.set(name, value, cookieOptions);
			} else {
				// For other cookies, use the standard approach
				event.cookies.set(name, value, {
					...options,
					path: options.path || '/'
				} as CookieSerializerOptions & { path: string });
			}
		});
		headers.delete('set-cookie');
	}
	event.setHeaders(Object.fromEntries(headers));
}

function decorateLocals(
	event: RequestEvent,
	auth: (options?: PendingSessionOptions) => SessionAuthObject
) {
	event.locals.auth = auth;
}

function handleMultiDomainAndProxy(clerkRequest: ClerkRequest, opts: AuthenticateRequestOptions) {
	const relativeOrAbsoluteProxyUrl = handleValueOrFn(
		opts?.proxyUrl,
		clerkRequest.clerkUrl,
		getDynamicPublicEnvVariables().proxyUrl
	);

	let proxyUrl;
	if (!!relativeOrAbsoluteProxyUrl && !isHttpOrHttps(relativeOrAbsoluteProxyUrl)) {
		proxyUrl = new URL(relativeOrAbsoluteProxyUrl, clerkRequest.clerkUrl).toString();
	} else {
		proxyUrl = relativeOrAbsoluteProxyUrl;
	}

	const isSatellite = handleValueOrFn(
		opts.isSatellite,
		new URL(clerkRequest.url),
		isTruthy(getDynamicPublicEnvVariables().isSatellite) || false
	);
	const domain = handleValueOrFn(
		opts.domain,
		new URL(clerkRequest.url),
		getDynamicPublicEnvVariables().domain
	);
	const signInUrl = opts?.signInUrl || getDynamicPublicEnvVariables().signInUrl;
	const signUpUrl = opts?.signUpUrl || getDynamicPublicEnvVariables().signUpUrl;

	if (isSatellite && !proxyUrl && !domain) {
		throw new Error(missingDomainAndProxy);
	}

	if (
		isSatellite &&
		!isHttpOrHttps(signInUrl) &&
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		isDevelopmentFromSecretKey(opts.secretKey || constants.SECRET_KEY!)
	) {
		throw new Error(missingSignInUrlInDev);
	}

	return {
		proxyUrl,
		isSatellite,
		domain,
		signInUrl,
		signUpUrl
	};
}

export const missingKeysOnSvelteKit3 = `
[svelte-clerk] Missing Clerk secret key or publishable key.

SvelteKit 3 only exposes environment variables that are declared in src/env.ts.
Declare the Clerk variables there, and make sure CLERK_SECRET_KEY and
PUBLIC_CLERK_PUBLISHABLE_KEY are set in your environment:

   import { defineEnvVars } from '@sveltejs/kit/env';
   import { clerkEnvVars } from 'svelte-clerk/env';

   export const variables = defineEnvVars({ ...clerkEnvVars() });

Alternatively, pass the keys directly
   e.g. export const handle = withClerkHandler({ secretKey, publishableKey });
   `;

export const missingDomainAndProxy = `
Missing domain and proxyUrl. A satellite application needs to specify a domain or a proxyUrl.

1) With handler
   e.g. export const handle = withClerkHandler({domain:'YOUR_DOMAIN',isSatellite:true});
2) With environment variables e.g.
   PUBLIC_CLERK_DOMAIN='YOUR_DOMAIN'
   PUBLIC_CLERK_IS_SATELLITE='true'
   `;

export const missingSignInUrlInDev = `
Invalid signInUrl. A satellite application requires a signInUrl for development instances.
Check if signInUrl is missing from your configuration or if it is not an absolute URL

1) With handler
   e.g. export const handle = withClerkHandler({signInUrl:'SOME_URL', isSatellite:true});
2) With environment variables e.g.
   PUBLIC_CLERK_SIGN_IN_URL='SOME_URL'
   PUBLIC_CLERK_IS_SATELLITE='true'`;
