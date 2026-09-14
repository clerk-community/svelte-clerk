import { getRequestEvent } from '$app/server';
import type { PendingSessionOptions } from '@clerk/shared/types';

/**
 * Returns the auth state of the current request. Callable from any server context
 * that runs during a request — `load` functions, form actions, API routes, other
 * server hooks and remote functions — without threading `event` through.
 *
 * @example
 * import { auth } from 'svelte-clerk/server';
 *
 * export const load = () => {
 *   const { userId } = auth();
 *   // ...
 * };
 */
export function auth(options?: PendingSessionOptions) {
	const event = getRequestEvent();
	if (!event.locals.auth) {
		throw new Error(
			'[svelte-clerk] auth() was called but Clerk has not processed this request. Ensure withClerkHandler() is registered in hooks.server.ts.'
		);
	}
	return event.locals.auth(options);
}
