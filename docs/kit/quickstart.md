---
outline: deep
---

# SvelteKit Quickstart

### 1. Installation

The Svelte Clerk SDK gives you access to prebuilt components, runes, and helpers to make user authentication easier.

```sh
npm install svelte-clerk
```

### 2. Set your Clerk API keys

Add your Clerk Publishable Key to your .env file. This key can always be retrieved from the [API Keys](https://dashboard.clerk.com/last-active?path=api-keys) page in the Clerk Dashboard.

```sh
PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxxxxxx
CLERK_SECRET_KEY=sk_test_xxxxxxx
```

#### SvelteKit 3

SvelteKit 3 only exposes environment variables that are [declared in `src/env.ts`](https://svelte.dev/docs/kit/environment-variables). Declare the ones Clerk reads by spreading [`clerkEnvVars()`](/kit/helpers#clerkenvvars) into `defineEnvVars`:

```ts
// src/env.ts
import { defineEnvVars } from '@sveltejs/kit/env';
import { clerkEnvVars } from 'svelte-clerk/env';

export const variables = defineEnvVars({
	...clerkEnvVars()
});
```

Without this, requests fail with a `Missing Clerk secret key or publishable key` error. Skip this step on SvelteKit 2.

### 3. Configure server handler

This handler will authenticate requests and gives you access to the [`Auth`](https://clerk.com/docs/references/nextjs/auth-object#auth-object) object via `event.locals.auth()` inside your server loaders and actions.

```ts
// hooks.server.ts
import { withClerkHandler } from 'svelte-clerk/server';

export const handle = withClerkHandler();
```

### 4. Add locals types

Inside your `src`/ directory, update the `app.d.ts` file to ensure that the locals added by the Clerk handler are properly typed.

```ts
/// <reference types="svelte-clerk/env" />

declare global {
	namespace App {...}
}
```

### 5. Add `<ClerkProvider>` to your root layout

All Clerk runes and components must be children of the `<ClerkProvider>` component, which provides active session and user context.

```svelte
<script lang="ts">
	import type { Snippet } from 'svelte';
	import { ClerkProvider } from 'svelte-clerk';

	const { children }: { children: Snippet } = $props();
</script>

<ClerkProvider>
	{@render children()}
</ClerkProvider>
```

To enable SSR support, pass the initial auth state to the return object of the load function.

```ts
// src/routes/+layout.server.ts
import { buildClerkProps } from 'svelte-clerk/server';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = ({ locals }) => {
	return {
		...buildClerkProps(locals.auth())
	};
};
```

### 6. Protect your pages

#### Client-side

To protect your pages on the client-side, you can use Clerk's [`<Show>` control component](https://clerk.com/docs/react/reference/components/control/show) to control visibility based on the user's authentication state.

```svelte
<script lang="ts">
	import { Show, SignInButton, UserButton } from 'svelte-clerk';
</script>

<template>
	<header>
		<Show when="signed-out">
			<SignInButton />
		</Show>
		<Show when="signed-in">
			<UserButton />
		</Show>
	</header>
</template>
```

#### Server-side

To protect your routes, you can use the load function to check for the `userId` singleton. If it doesn't exist, redirect your user back to the sign-in page.

```ts
import { redirect } from '@sveltejs/kit';

export const load = async ({ locals }) => {
	const { userId } = locals.auth();

	if (!userId) {
		return redirect(307, '/sign-in');
	}

	return {
		userId
	};
};
```

### 7. Create your first user

Run your project with the following command:

```sh
npm run dev
```
