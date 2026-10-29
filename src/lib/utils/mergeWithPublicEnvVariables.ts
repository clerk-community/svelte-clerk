import type { IsomorphicClerkOptions } from '@clerk/shared/types';
import { isTruthy } from '@clerk/shared/underscore';
import { getDynamicPublicEnvVariables } from './getDynamicPublicEnvVariables.js';

/**
 * Merges the public environment variables with the Clerk initialization options.
 *
 * This function takes a Clerk initialization options object and returns a new object
 * with the public environment variables merged into it. If a property is already
 * defined in the Clerk initialization options, it will not be overridden.
 */
export function mergeWithPublicEnvVariables(
	clerkInitOptions: Omit<IsomorphicClerkOptions, 'publishableKey'> & {
		publishableKey?: string;
		// isSatellite/domain/proxyUrl are omitted from IsomorphicClerkOptions (they're part of
		// the MultiDomainAndOrProxy discriminated union in ClerkOptions) so we add them back flat
		isSatellite?: boolean | ((url: URL) => boolean);
		proxyUrl?: string | ((url: URL) => string);
		domain?: string | ((url: URL) => string);
	}
) {
	const {
		publishableKey,
		signInUrl,
		signUpUrl,
		signInForceRedirectUrl,
		signUpForceRedirectUrl,
		signInFallbackRedirectUrl,
		signUpFallbackRedirectUrl,
		__internal_clerkJSUrl,
		__internal_clerkJSVersion,
		__internal_clerkUIUrl,
		__internal_clerkUIVersion,
		proxyUrl,
		domain,
		isSatellite,
		telemetry
	} = clerkInitOptions;
	return {
		publishableKey: publishableKey || getDynamicPublicEnvVariables().publishableKey || '',
		signInUrl: signInUrl || getDynamicPublicEnvVariables().signInUrl,
		signUpUrl: signUpUrl || getDynamicPublicEnvVariables().signUpUrl,
		signInForceRedirectUrl:
			signInForceRedirectUrl || getDynamicPublicEnvVariables().signInForceRedirectUrl,
		signUpForceRedirectUrl:
			signUpForceRedirectUrl || getDynamicPublicEnvVariables().signUpForceRedirectUrl,
		signInFallbackRedirectUrl:
			signInFallbackRedirectUrl || getDynamicPublicEnvVariables().signInFallbackRedirectUrl,
		signUpFallbackRedirectUrl:
			signUpFallbackRedirectUrl || getDynamicPublicEnvVariables().signUpFallbackRedirectUrl,
		__internal_clerkJSUrl: __internal_clerkJSUrl || getDynamicPublicEnvVariables().clerkJSUrl,
		__internal_clerkJSVersion:
			__internal_clerkJSVersion || getDynamicPublicEnvVariables().clerkJSVersion,
		__internal_clerkUIUrl: __internal_clerkUIUrl || getDynamicPublicEnvVariables().clerkUIUrl,
		__internal_clerkUIVersion:
			__internal_clerkUIVersion || getDynamicPublicEnvVariables().clerkUIVersion,
		proxyUrl: proxyUrl || getDynamicPublicEnvVariables().proxyUrl,
		domain: domain || getDynamicPublicEnvVariables().domain,
		isSatellite: clerkInitOptions.isSatellite ?? isTruthy(getDynamicPublicEnvVariables().isSatellite),
		telemetry: telemetry || {
			debug: getDynamicPublicEnvVariables().telemetryDebug,
			disabled: getDynamicPublicEnvVariables().telemetryDisabled
		}
	};
}
