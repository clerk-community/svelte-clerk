---
'svelte-clerk': minor
---

Add SvelteKit 3 support. SvelteKit 2 is still supported.

- `@sveltejs/kit` `^3.0.0` is now an accepted peer dependency.
- SvelteKit 3 only exposes environment variables declared in `src/env.ts`. The new `clerkEnvVars()` export from `svelte-clerk/env` returns a definition for every variable Svelte Clerk reads, to spread into `defineEnvVars`:

  ```ts
  // src/env.ts
  import { defineEnvVars } from '@sveltejs/kit/env';
  import { clerkEnvVars } from 'svelte-clerk/env';

  export const variables = defineEnvVars({ ...clerkEnvVars() });
  ```

  On SvelteKit 3, `withClerkHandler()` now throws an error pointing here when the keys are missing.

- On SvelteKit 3, `<ClerkProvider>` navigates with `goto(url, { shallow: true })` and the `replace` option. The `pushState()` and `replaceState()` functions and the `replaceState` option it used before are deprecated there.
- When Clerk navigates to a same-origin URL that is not a route in your app, `<ClerkProvider>` now falls back to a full page load. SvelteKit 3 rejects those navigations instead of doing this itself.
- On SvelteKit 3, components that use path-based routing need a rest route, such as `src/routes/sign-in/[...rest]`. SvelteKit 2 updated the URL for an internal step like `/sign-in/factor-one` without one. SvelteKit 3 loads a 404 page.
- `withClerkHandler()` no longer depends on the `Handle` type from `@sveltejs/kit`, which moved to `@sveltejs/kit/hooks` in SvelteKit 3. Its return type is assignable to both.
- An environment variable that is declared but unset now falls back to its default instead of `undefined`.
