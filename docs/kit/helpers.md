# Server-side Helpers

## `withClerkHandler()`

The `withClerkHandler()` helper integrates Clerk authentication and authorization into your SvelteKit application through hooks.

It accepts an optional [options object](https://clerk.com/docs/references/backend/authenticate-request#authenticate-request-options), though it is recommended to pass these options as [environment variables](https://clerk.com/docs/deployments/clerk-environment-variables#api-and-sdk-configuration).

```ts
import { withClerkHandler } from 'svelte-clerk/server';

export const handle = withClerkHandler();
```

## `clerkClient`

The `clerkClient` helper returns an instance of the [JavaScript Backend SDK](https://clerk.com/docs/references/backend/overview).

The following example demonstrates how you can use the `auth()` local to get the user's ID, and then use the Backend SDK's [`getUser()`](https://clerk.com/docs/references/backend/user/get-user) method to get the [Backend User object](https://clerk.com/docs/references/backend/types/backend-user).

```ts
import { redirect } from '@sveltejs/kit';
import { clerkClient } from 'svelte-clerk/server';

export const load = async ({ locals }) => {
	// Use `auth()` local to get the user's ID
	const { userId } = locals.auth();

	// Protect the route by checking if the user is signed in
	if (!userId) {
		return redirect(307, '/sign-in');
	}

	// Use the Backend SDK's `getUser()` method to get the Backend User object
	const user = await clerkClient.users.getUser(userId);

	// Return the Backend User object
	return {
		user: JSON.parse(JSON.stringify(user))
	};
};
```

## `buildClerkProps()`

The `buildClerkProps()` helper is used to inform the client-side helpers of the authentication state of the user. This function is used for SSR in the root server load function of your SvelteKit application.

```ts
import { buildClerkProps } from 'svelte-clerk/server';

export const load = async ({ locals }) => {
	return {
		...buildClerkProps(locals.auth())
	};
};
```

Passing `initialState` to `<ClerkProvider>` (which the SvelteKit `ClerkProvider` does automatically from `page.data.initialState`) lets control components like [`<Show>`](/svelte/components#show) render the correct branch on the server and during hydration, before clerk-js has loaded in the browser.

By default, `locals.auth()` treats sessions with a `pending` status as signed out. If you render `<Show treatPendingAsSignedOut={false}>` and want that to hold during SSR as well, pass the same option to `locals.auth()`:

```ts
export const load = async ({ locals }) => {
	return {
		...buildClerkProps(locals.auth({ treatPendingAsSignedOut: false }))
	};
};
```

## `clerkEnvVars()`

SvelteKit 3 only exposes environment variables that are [declared in `src/env.ts`](https://svelte.dev/docs/kit/environment-variables). `clerkEnvVars()` returns a definition for every variable Svelte Clerk reads, ready to spread into `defineEnvVars`. It is not needed on SvelteKit 2.

```ts
// src/env.ts
import { defineEnvVars } from '@sveltejs/kit/env';
import { clerkEnvVars } from 'svelte-clerk/env';

export const variables = defineEnvVars({
	...clerkEnvVars()
});
```

It covers `CLERK_SECRET_KEY`, `CLERK_JWT_KEY`, `CLERK_API_URL`, `CLERK_API_VERSION`, `CLERK_WEBHOOK_SIGNING_SECRET`, and the `PUBLIC_CLERK_*` variables such as `PUBLIC_CLERK_PUBLISHABLE_KEY`, `PUBLIC_CLERK_SIGN_IN_URL` and `PUBLIC_CLERK_PROXY_URL`.

Every variable is declared as optional, so only the ones you set are used. To have SvelteKit fail at startup when a key is missing, redeclare it without a schema:

```ts
export const variables = defineEnvVars({
	...clerkEnvVars(),
	CLERK_SECRET_KEY: {},
	PUBLIC_CLERK_PUBLISHABLE_KEY: { public: true }
});
```

If you would rather not use environment variables, pass the keys yourself: `withClerkHandler({ secretKey, publishableKey })` on the server and `<ClerkProvider publishableKey={...}>` in your layout.

::: info
In development, SvelteKit 3 logs an `env_module_deprecated` warning for `$env/dynamic/public` and `$env/dynamic/private`. Svelte Clerk still reads from those modules because their replacement does not exist in SvelteKit 2. The warning is harmless.
:::

::: tip
SvelteKit 3 requires an explicit opt-in to redirect to another origin. If your sign-in page is hosted elsewhere, such as the Account Portal, use `redirect(307, signInUrl, { external: true })`.
:::
