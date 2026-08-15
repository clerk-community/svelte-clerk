---
'svelte-clerk': major
---

svelte-clerk v3: explicit environment variables, callable `clerkClient()`, and automatic SSR auth hydration. Requires SvelteKit with explicit environment variables and remote functions enabled.

**Migration**

1. Declare Clerk's environment variables in `src/env.ts`:

```ts
import { defineEnvVars } from '@sveltejs/kit/env';
import { clerkEnvVars } from 'svelte-clerk/env';

export const variables = defineEnvVars({
	...clerkEnvVars()
});
```

2. Rename your environment variables. The `PUBLIC_` prefix is gone — visibility now comes from the declaration above:

- `PUBLIC_CLERK_PUBLISHABLE_KEY` → `CLERK_PUBLISHABLE_KEY`
- `PUBLIC_CLERK_SIGN_IN_URL` → `CLERK_SIGN_IN_URL` (same pattern for every other `PUBLIC_CLERK_*` variable)
- `PUBLIC_CLERK_JS_URL` → `CLERK_JS_URL`, `PUBLIC_CLERK_JS_VERSION` → `CLERK_JS_VERSION`
- `CLERK_SECRET_KEY`, `CLERK_JWT_KEY`, `CLERK_WEBHOOK_SIGNING_SECRET` are unchanged

3. `clerkClient` is now a function. A fresh client is created per call from the current environment:

```diff
- await clerkClient.users.getUser(userId);
+ await clerkClient().users.getUser(userId);
```

Need custom options? Use `createClerkClient(options)` from `svelte-clerk/server`, which merges your overrides over the environment defaults.

4. `buildClerkProps` is removed and your root `+layout.server.ts` boilerplate can be deleted — `<ClerkProvider>` now hydrates the initial auth state automatically via a remote function. To provide it manually, pass the `initialState` prop.

```diff
- export const load = ({ locals }) => {
- 	return {
- 		...buildClerkProps(locals.auth())
- 	};
- };
```

**New**

- `auth()` from `svelte-clerk/server`: read the request's auth state in any `load`, form action, API route or remote function without threading `event` through.
- `clerkEnvVars({ static: true })` marks the public Clerk variables as build-time constants. Secrets always stay dynamic.
- The backend client now reports `userAgent` and `sdkMetadata` like the official Clerk SDKs.
- `CLERK_API_URL` is now server-only, and `CLERK_MACHINE_SECRET_KEY` is supported.
