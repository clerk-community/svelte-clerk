---
'svelte-clerk': minor
---

Bring environment variables and SDK metadata in line with Clerk's other framework SDKs.

- `PUBLIC_CLERK_UI_URL` and `PUBLIC_CLERK_UI_VERSION` set where the Clerk UI script loads from, like `PUBLIC_CLERK_JS_URL` and `PUBLIC_CLERK_JS_VERSION` already do for clerk-js. The matching `__internal_clerkUIUrl` and `__internal_clerkUIVersion` props on `<ClerkProvider>` now take effect too.
- `CLERK_API_URL` and `CLERK_API_VERSION` configure the Backend API. `CLERK_API_VERSION` was declared in `clerkEnvVars()` but never read. `PUBLIC_CLERK_API_URL` and `PUBLIC_CLERK_API_VERSION` still work as fallbacks.
- `<ClerkProvider>` and `clerkClient` now identify themselves to Clerk as `svelte-clerk` with the package version, through `sdkMetadata` and the backend `User-Agent`. A `sdkMetadata` prop you pass still wins.
