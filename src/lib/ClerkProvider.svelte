<script lang="ts">
	import ClerkProvider from '$lib/client/ClerkProvider.svelte';
	import { mergeWithPublicEnvVariables } from '$lib/utils/mergeWithPublicEnvVariables.js';
	import type { ClerkProviderProps } from '$lib/types.js';
	import { page } from '$app/state';
	import { goto, pushState, replaceState } from '$app/navigation';
	import { isSvelteKit3OrLater } from '$lib/utils/kitVersion.js';
	import type { ComponentProps } from 'svelte';

	const {
		children,
		...props
	}: Omit<ClerkProviderProps, 'publishableKey'> & {
		publishableKey?: string;
	} = $props();

	type RouterMetadata = {
		__internal_metadata?: { navigationType?: 'internal' | 'external' | 'window' };
	};

	type GotoOptions = NonNullable<Parameters<typeof goto>[1]>;

	function navigate(to: string, replace: boolean, metadata?: RouterMetadata) {
		// Internal navigations are tab/step changes within a Clerk component (e.g. /sign-in → /sign-in/factor-one).
		// Use SvelteKit's shallow routing so the URL updates without unmounting the page,
		// while still keeping SvelteKit's router in sync (so hard-refresh at the new URL works).
		const shallow = metadata?.__internal_metadata?.navigationType === 'internal';

		// Clerk only hands us same-origin URLs, but they don't have to belong to this app
		// (e.g. a path served by a proxy or another app on the same origin). SvelteKit 3
		// rejects those instead of falling back to a full page load, so we do that ourselves.
		const fallback = () => {
			if (replace) {
				window.location.replace(to);
			} else {
				window.location.assign(to);
			}
		};

		if (isSvelteKit3OrLater) {
			// SvelteKit 3 deprecates `pushState`/`replaceState` and the `replaceState` option.
			const options = shallow ? { replace, shallow: true, state: {} } : { replace };
			goto(to, options as GotoOptions).catch(fallback);
		} else if (shallow) {
			if (replace) {
				replaceState(to, {});
			} else {
				pushState(to, {});
			}
		} else {
			goto(to, { replaceState: replace }).catch(fallback);
		}
	}

	const providerProps = $derived({
		...props,
		...mergeWithPublicEnvVariables(props),
		initialState: page?.data?.initialState,
		routerPush: (to: string, metadata?: RouterMetadata) => navigate(to, false, metadata),
		routerReplace: (to: string, metadata?: RouterMetadata) => navigate(to, true, metadata)
	} as ComponentProps<typeof ClerkProvider>);
</script>

<ClerkProvider {...providerProps}>
	{@render children?.()}
</ClerkProvider>
