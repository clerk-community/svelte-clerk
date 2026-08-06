import { getRequestEvent, query } from '$app/server';
import { makeAuthObjectSerializable, stripPrivateDataFromObject } from '@clerk/backend/internal';
import type { InitialState } from '@clerk/shared/types';

/**
 * Serializes the auth state of the current request so `ClerkProvider` can hydrate
 * the initial auth state during SSR, before clerk-js loads in the browser.
 * Called automatically by `ClerkProvider` — you don't need to use this directly.
 */
export const getClerkInitialState = query(() => {
	const { locals } = getRequestEvent();
	if (!locals.auth) {
		return undefined;
	}
	const initialState = makeAuthObjectSerializable(stripPrivateDataFromObject(locals.auth()));
	return JSON.parse(JSON.stringify(initialState)) as InitialState;
});
