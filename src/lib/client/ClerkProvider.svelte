<script lang="ts">
	import { untrack } from 'svelte';
	import type { ClerkOptions, ClientResource, InitialState, Resources } from '@clerk/shared/types';
	import type { LoadClerkJSScriptOptions } from '@clerk/shared/loadClerkJsScript';
	import { setClerkContext } from '$lib/context.js';
	import { deriveState } from '@clerk/shared/deriveState';
	import type { ClerkProviderProps, HeadlessBrowserClerk, BrowserClerk } from '$lib/types.js';
	import { inBrowser } from '@clerk/shared/browser';

	import {
		loadClerkJSScript,
		loadClerkUIScript,
		setClerkJSLoadingErrorPackageName
	} from '@clerk/shared/loadClerkJsScript';
	import { watch } from './utils.svelte';

	const {
		children,
		initialState,
		...props
	}: ClerkProviderProps & {
		initialState?: InitialState;
		__internal_clerkJSUrl?: string;
		__internal_clerkJSVersion?: string;
	} = $props();

	// Extract only the script-loading options for loadClerkJSScript/loadClerkUIScript
	const scriptOpts = $derived({
		publishableKey: props.publishableKey,
		__internal_clerkJSUrl: props.__internal_clerkJSUrl,
		__internal_clerkJSVersion: props.__internal_clerkJSVersion,
		proxyUrl: typeof props.proxyUrl === 'string' ? props.proxyUrl : undefined,
		domain: typeof props.domain === 'string' ? props.domain : undefined,
		nonce: props.nonce,
		sdkMetadata: props.sdkMetadata
	} as LoadClerkJSScriptOptions);

	let clerk = $state<HeadlessBrowserClerk | BrowserClerk | null>(null);
	let isLoaded = $state(false);
	let resources = $state<Resources>({
		client: undefined as unknown as ClientResource,
		session: undefined,
		user: undefined,
		organization: undefined
	});

	const auth = $derived(deriveState(isLoaded, resources, initialState));
	const client = $derived(resources.client);
	const session = $derived(auth.session);
	const user = $derived(auth.user);
	const organization = $derived(auth.organization);

	setClerkJSLoadingErrorPackageName('svelte-clerk');

	async function loadClerk() {
		const clerkPromise = loadClerkJSScript(scriptOpts);

		// Load the Clerk UI separately (unless bundled UI is provided or prefetch is disabled)
		const uiProp = props.ui;
		const clerkUICtorPromise = uiProp?.ClerkUI
			? Promise.resolve(uiProp.ClerkUI)
			: uiProp || props.prefetchUI === false
				? Promise.resolve(undefined)
				: (async () => {
						await loadClerkUIScript(scriptOpts);
						const ctor = window.__internal_ClerkUICtor;
						if (!ctor) {
							throw new Error('Failed to download latest Clerk UI. Contact support@clerk.com.');
						}
						return ctor;
					})();

		await clerkPromise;

		if (!window.Clerk) {
			throw new Error('Failed to download latest ClerkJS. Contact support@clerk.com.');
		}

		clerk = window.Clerk;
		await clerk.load({
			...props,
			ui: { ...uiProp, ClerkUI: clerkUICtorPromise }
		} as unknown as ClerkOptions);

		isLoaded = true;

		clerk.addListener((payload) => {
			resources = payload;
		});
	}

	if (inBrowser()) {
		$effect(() => {
			untrack(() => {
				loadClerk();
			});
		});
	}

	watch(
		() => [props.appearance, props.localization],
		() => {
			if (clerk) {
				// @ts-expect-error: Internal unexposed Clerk property
				clerk.__internal_updateProps({
					options: {
						localization: props.localization
					},
					appearance: props.appearance
				});
			}
		}
	);

	setClerkContext({
		get clerk() {
			return clerk;
		},
		get isLoaded() {
			return isLoaded;
		},
		get auth() {
			return auth;
		},
		get client() {
			return client;
		},
		get session() {
			return session;
		},
		get user() {
			return user;
		},
		get organization() {
			return organization;
		}
	});
</script>

{@render children?.()}
