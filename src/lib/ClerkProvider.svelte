<script lang="ts">
	import ClerkProvider from '$lib/client/ClerkProvider.svelte';
	import type { ClerkProviderProps } from '$lib/types.js';
	import type { InitialState } from '@clerk/shared/types';
	import { goto, pushState, replaceState } from '$app/navigation';
	import { untrack, type ComponentProps } from 'svelte';
	import {
		CLERK_DOMAIN,
		CLERK_IS_SATELLITE,
		CLERK_JS_URL,
		CLERK_JS_VERSION,
		CLERK_PROXY_URL,
		CLERK_PUBLISHABLE_KEY,
		CLERK_SIGN_IN_FALLBACK_REDIRECT_URL,
		CLERK_SIGN_IN_FORCE_REDIRECT_URL,
		CLERK_SIGN_IN_URL,
		CLERK_SIGN_UP_FALLBACK_REDIRECT_URL,
		CLERK_SIGN_UP_FORCE_REDIRECT_URL,
		CLERK_SIGN_UP_URL,
		CLERK_TELEMETRY_DEBUG,
		CLERK_TELEMETRY_DISABLED
	} from '$app/env/public';
	import { getClerkInitialState } from '$lib/initialState.remote.js';

	const {
		children,
		initialState,
		...props
	}: Omit<ClerkProviderProps, 'publishableKey'> & {
		publishableKey?: string;
		/**
		 * The auth state used during SSR and hydration, before clerk-js loads.
		 * When omitted, it is fetched automatically from the server.
		 */
		initialState?: InitialState;
	} = $props();

	// Fetched on the server during SSR and reused from the serialized payload
	// during hydration, so the initial auth state never flashes. Deliberately
	// non-reactive (untracked): it only seeds the state until clerk-js takes over.
	const resolvedInitialState = untrack(() => initialState) ?? (await getClerkInitialState());

	type RouterMetadata = {
		__internal_metadata?: { navigationType?: 'internal' | 'external' | 'window' };
	};

	const providerProps = $derived({
		...props,
		publishableKey: props.publishableKey || CLERK_PUBLISHABLE_KEY || '',
		signInUrl: props.signInUrl || CLERK_SIGN_IN_URL,
		signUpUrl: props.signUpUrl || CLERK_SIGN_UP_URL,
		signInForceRedirectUrl: props.signInForceRedirectUrl || CLERK_SIGN_IN_FORCE_REDIRECT_URL,
		signUpForceRedirectUrl: props.signUpForceRedirectUrl || CLERK_SIGN_UP_FORCE_REDIRECT_URL,
		signInFallbackRedirectUrl:
			props.signInFallbackRedirectUrl || CLERK_SIGN_IN_FALLBACK_REDIRECT_URL,
		signUpFallbackRedirectUrl:
			props.signUpFallbackRedirectUrl || CLERK_SIGN_UP_FALLBACK_REDIRECT_URL,
		proxyUrl: props.proxyUrl || CLERK_PROXY_URL,
		domain: props.domain || CLERK_DOMAIN,
		isSatellite: props.isSatellite ?? CLERK_IS_SATELLITE,
		telemetry: props.telemetry || {
			disabled: CLERK_TELEMETRY_DISABLED,
			debug: CLERK_TELEMETRY_DEBUG
		},
		__internal_clerkJSUrl: CLERK_JS_URL,
		__internal_clerkJSVersion: CLERK_JS_VERSION,
		initialState: resolvedInitialState,
		routerPush: (to: string, metadata?: RouterMetadata) => {
			// Internal navigations are tab/step changes within a Clerk component (e.g. /sign-in → /sign-in/factor-one).
			// Use SvelteKit's shallow pushState so the URL updates without unmounting the page,
			// while still keeping SvelteKit's router in sync (so hard-refresh at the new URL works).
			if (metadata?.__internal_metadata?.navigationType === 'internal') {
				pushState(to, {});
			} else {
				goto(to);
			}
		},
		routerReplace: (to: string, metadata?: RouterMetadata) => {
			if (metadata?.__internal_metadata?.navigationType === 'internal') {
				replaceState(to, {});
			} else {
				goto(to, { replaceState: true });
			}
		}
	} as ComponentProps<typeof ClerkProvider>);
</script>

<ClerkProvider {...providerProps}>
	{@render children?.()}
</ClerkProvider>
