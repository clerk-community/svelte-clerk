<script lang="ts">
	import type {
		GetToken,
		JwtPayload,
		PendingSessionOptions,
		ShowWhenCondition,
		SignOut
	} from '@clerk/shared/types';
	import type { Snippet } from 'svelte';
	import { createCheckAuthorization, resolveAuthState } from '@clerk/shared/authorization';
	import { useClerkContext } from '$lib/context.js';
	import { errorThrower } from '$lib/errors/errorThrower.js';
	import { invalidStateError } from '$lib/errors/messages.js';

	const {
		when,
		children,
		fallback,
		treatPendingAsSignedOut
	}: {
		when: ShowWhenCondition;
		children: Snippet;
		fallback?: Snippet;
	} & PendingSessionOptions = $props();

	const ctx = useClerkContext();

	// `resolveAuthState` requires these, but <Show> never exposes them.
	const getToken: GetToken = () => Promise.resolve(null);
	const signOut: SignOut = () => Promise.resolve();

	const authorized = $derived.by(() => {
		const has = createCheckAuthorization({
			userId: ctx.auth.userId,
			orgId: ctx.auth.orgId,
			orgRole: ctx.auth.orgRole,
			orgPermissions: ctx.auth.orgPermissions,
			factorVerificationAge: ctx.auth.factorVerificationAge,
			features: ((ctx.auth.sessionClaims as JwtPayload | undefined)?.fea as string) || '',
			plans: ((ctx.auth.sessionClaims as JwtPayload | undefined)?.pla as string) || ''
		});

		// Derived from the auth state rather than `ctx.isLoaded` so that SSR `initialState`
		// (via `buildClerkProps`) renders the correct branch before clerk-js has loaded.
		const auth = resolveAuthState({
			authObject: { ...ctx.auth, has, getToken, signOut },
			options: { treatPendingAsSignedOut }
		});

		if (!auth) {
			return errorThrower.throw(invalidStateError);
		}

		if (!auth.isLoaded) return null;

		const { userId } = auth;

		if (when === 'signed-out') {
			return !userId;
		}

		if (!userId) return false;

		if (when === 'signed-in') {
			return true;
		}

		if (typeof when === 'function') {
			return when(auth.has);
		}

		return auth.has(when);
	});
</script>

{#if authorized === null}
	<!-- loading -->
{:else if authorized}
	{@render children()}
{:else}
	{@render fallback?.()}
{/if}
