# svelte-clerk

## 1.1.12

### Patch Changes

- 1687293: Bump @clerk/backend from 3.11.3 to 3.11.7
- 1687293: Bump @clerk/shared from 4.25.2 to 4.25.5

## 1.1.11

### Patch Changes

- 2a1a8a2: Bump @clerk/backend from 3.8.3 to 3.11.3
- 2a1a8a2: Bump @clerk/shared from 4.21.0 to 4.25.2

## 1.1.10

### Patch Changes

- 63b59ca: Improve compatibility with newer Svelte/Vite toolchains
- 3da7325: Bump `@clerk/backend` to `3.8.3` and `@clerk/shared` to `4.21.0`

## 1.1.9

### Patch Changes

- caf17f5: Bump @clerk/backend from 3.4.7 to 3.4.8
- caf17f5: Bump @clerk/shared from 4.10.2 to 4.11.0

## 1.1.8

### Patch Changes

- 7acac87: Bump @clerk/backend from 3.4.5 to 3.4.7
- 7acac87: Bump @clerk/shared from 4.10.0 to 4.10.2

## 1.1.7

### Patch Changes

- 20a10fa: Bump @clerk/backend from 3.4.1 to 3.4.5
- 20a10fa: Bump @clerk/shared from 4.8.5 to 4.10.0

## 1.1.6

### Patch Changes

- ca5ed99: Bump @clerk/backend from 3.3.0 to 3.4.1
- ca5ed99: Bump @clerk/shared from 4.8.3 to 4.8.5

## 1.1.5

### Patch Changes

- b1adfba: Bump @clerk/backend from 3.2.13 to 3.3.0
- b1adfba: Bump @clerk/shared from 4.8.2 to 4.8.3

## 1.1.4

### Patch Changes

- c38fc4d: Bump @clerk/backend from 3.2.7 to 3.2.13
- c38fc4d: Bump @clerk/shared from 4.5.0 to 4.8.2

## 1.1.3

### Patch Changes

- d9c0da6: Bump @clerk/backend from 3.2.3 to 3.2.7
- d9c0da6: Bump @clerk/shared from 4.3.1 to 4.5.0

## 1.1.2

### Patch Changes

- b580cfc: Bump @clerk/backend from 3.2.1 to 3.2.3

## 1.1.1

### Patch Changes

- 6767f05: Bump @clerk/backend from 3.2.0 to 3.2.1
- 6767f05: Bump @clerk/shared from 4.3.0 to 4.3.1

## 1.1.0

### Minor Changes

- 39d84b5: Added `useSignIn()` and `useSignUp()` hooks for building custom authentication flows.

  ```svelte
  <script lang="ts">
  	import { useSignIn } from 'svelte-clerk/client';

  	const signInState = useSignIn();
  	// signInState.signIn, signInState.errors, signInState.fetchStatus
  </script>
  ```

  ```svelte
  <script lang="ts">
  	import { useSignUp } from 'svelte-clerk/client';

  	const signUpState = useSignUp();
  	// signUpState.signUp, signUpState.errors, signUpState.fetchStatus
  </script>
  ```

## 1.0.3

### Patch Changes

- da163c8: Bump @clerk/backend from 3.0.2 to 3.2.0
- da163c8: Bump @clerk/shared from 4.1.0 to 4.3.0

## 1.0.2

### Patch Changes

- c2b3388: Bump @clerk/backend from 3.0.0 to 3.0.2
- c2b3388: Bump @clerk/shared from 4.0.0 to 4.1.0

## 1.0.1

### Patch Changes

- 584bf27: Fixed multi-domain support

## 1.0.0

### Major Changes

- b8f600b: This release aligns `svelte-clerk` with [Clerk Core 3](https://clerk.com/changelog/2026-03-03-core-3) and includes breaking API updates.

  ### Breaking changes
  - **Control components have been unified under `<Show>`**:
    - `<Protect>`, `<SignedIn>`, and `<SignedOut>` are removed.
    - Use `<Show when="signed-in">`, `<Show when="signed-out">`, or authorization conditions (for example `when={{ role: 'org:admin' }}`).
  - **Core dependencies were upgraded**:
    - `@clerk/backend` -> `3.0.0`
    - `@clerk/shared` -> `4.0.0`

  ### New exports and components
  - Added new interactive components:
    - `<APIKeys />`
    - `<UserAvatar />`
  - Added `getToken` export from `svelte-clerk`.

  ### Migration notes
  - Replace old control components with `<Show>`:
    - `<SignedIn>...</SignedIn>` -> `<Show when="signed-in">...</Show>`
    - `<SignedOut>...</SignedOut>` -> `<Show when="signed-out">...</Show>`
    - `<Protect role="org:admin">...</Protect>` -> `<Show when={{ role: 'org:admin' }}>...</Show>`

### Patch Changes

- a2e1856: Bump @clerk/backend from 2.31.0 to 2.33.0
- a2e1856: Bump @clerk/shared from 3.45.0 to 3.47.2

## 0.20.6

### Patch Changes

- b83eeba: Bump @clerk/backend from 2.30.0 to 2.31.0
- efb4f15: Bump @clerk/shared from 3.44.0 to 3.45.0

## 0.20.5

### Patch Changes

- 2614a8e: Bump @clerk/backend from 2.29.1 to 2.30.0 in the clerk-dependencies group
- 2614a8e: Bump @clerk/shared from 3.42.0 to 3.44.0

## 0.20.4

### Patch Changes

- 49c8b0c: Bump @clerk/backend from 2.29.0 to 2.29.1
- 49c8b0c: Bump @clerk/shared from 3.41.1 to 3.42.0

## 0.20.3

### Patch Changes

- 0c34860: Bump @clerk/backend from 2.28.0 to 2.29.0
- 0c34860: Bump @clerk/shared from 3.41.0 to 3.41.1
- f09b033: Clone Request before reading body

## 0.20.2

### Patch Changes

- 7030081: Bump @clerk/backend from 2.26.0 to 2.28.0
- 8057026: Bump @clerk/shared from 3.39.0 to 3.41.0

## 0.20.1

### Patch Changes

- 39aac30: Bump @clerk/backend from 2.25.1 to 2.26.0
- 39aac30: Bump @clerk/shared from 3.38.0 to 3.39.0

## 0.20.0

### Minor Changes

- 2124c7c: Change default routing strategy to path-based

## 0.19.0

### Minor Changes

- 7ab79e1: Initial migration to attachments from actions for interactive components

## 0.18.7

### Patch Changes

- f2b876b: Bump @clerk/backend from 2.24.0 to 2.25.0
- f2b876b: Bump @clerk/shared from 3.36.0 to 3.37.0

## 0.18.6

### Patch Changes

- 6025dd1: Switch to OIDC for npm publishing

## 0.18.5

### Patch Changes

- ee3c263: Bump @clerk/backend from 2.23.2 to 2.24.0
- ee3c263: Bump @clerk/shared from 3.35.2 to 3.36.0

## 0.18.4

### Patch Changes

- 09cc498: Bump @clerk/backend from 2.23.1 to 2.23.2
- 09cc498: Bump @clerk/shared from 3.35.1 to 3.35.2

## 0.18.3

### Patch Changes

- 050b302: Bump @clerk/backend from 2.23.0 to 2.23.1
- 050b302: Bump @clerk/shared from 3.35.0 to 3.35.1

## 0.18.2

### Patch Changes

- 92ee8a4: Bump @clerk/backend from 2.22.0 to 2.23.0
- 92ee8a4: Bump @clerk/shared from 3.34.0 to 3.35.0

## 0.18.1

### Patch Changes

- d946340: Refactor `@clerk/types` import to `@clerk/shared/types`

## 0.18.0

### Minor Changes

- 95738cc: Mark @sveltejs/kit module as optional

## 0.17.10

### Patch Changes

- 5013146: Bump @clerk/backend from 2.21.0 to 2.22.0
- 5013146: Bump @clerk/shared from 3.33.0 to 3.34.0
- 5013146: Bump @clerk/types from 4.99.0 to 4.100.0

## 0.17.9

### Patch Changes

- 5033c40: Bump @clerk/backend from 2.20.0 to 2.21.0
- 5033c40: Bump @clerk/shared from 3.31.1 to 3.33.0
- 5033c40: Bump @clerk/types from 4.97.2 to 4.99.0

## 0.17.8

### Patch Changes

- 65d56c7: Bump @clerk/backend from 2.19.1 to 2.20.0
- 65d56c7: Bump @clerk/shared from 3.29.0 to 3.31.1
- 65d56c7: Bump @clerk/types from 4.96.0 to 4.97.2

## 0.17.7

### Patch Changes

- 1f6b6ad: Bump @clerk/backend from 2.18.3 to 2.19.1
- 1f6b6ad: Bump @clerk/shared from 3.28.2 to 3.29.0
- 1f6b6ad: Bump @clerk/types from 4.95.0 to 4.96.0

## 0.17.6

### Patch Changes

- 65a58a8: Bump @clerk/backend from 2.18.1 to 2.18.3
- 65a58a8: Bump @clerk/shared from 3.28.0 to 3.28.2
- 7702ad3: Bump @clerk/types from 4.94.0 to 4.95.0

## 0.17.5

### Patch Changes

- 7716fe1: Bump @clerk/backend from 2.16.0 to 2.18.1
- 7716fe1: Bump @clerk/shared from 3.27.0 to 3.28.0
- 7716fe1: Bump @clerk/types from 4.89.0 to 4.94.0

## 0.17.4

### Patch Changes

- c39bd7d: Bump @clerk/backend from 2.15.0 to 2.16.0
- c39bd7d: Bump @clerk/shared from 3.26.1 to 3.27.0
- c39bd7d: Bump @clerk/types from 4.88.0 to 4.89.0

## 0.17.3

### Patch Changes

- d47cadc: Bump @clerk/backend from 2.14.0 to 2.15.0
- d47cadc: Bump @clerk/shared from 3.25.0 to 3.26.1
- d47cadc: Bump @clerk/types from 4.86.0 to 4.88.0

## 0.17.2

### Patch Changes

- d6e5077: Bump @clerk/backend from 2.13.0 to 2.14.0
- d6e5077: Bump @clerk/shared from 3.24.2 to 3.25.0
- d6e5077: Bump @clerk/types from 4.85.0 to 4.86.0

## 0.17.1

### Patch Changes

- 555a00d: Bump @clerk/backend from 2.12.1 to 2.13.0
- 555a00d: Bump @clerk/shared from 3.24.1 to 3.24.2
- 555a00d: Bump @clerk/types from 4.84.1 to 4.85.0

## 0.17.0

### Minor Changes

- f8642fa: Remove SvelteKit imports in client export. Allows usage of Clerk components outside of SvelteKit.

## 0.16.13

### Patch Changes

- bb1ddc9: Bump @clerk/backend from 2.12.0 to 2.12.1
- bb1ddc9: Bump @clerk/shared from 3.24.0 to 3.24.1
- bb1ddc9: Bump @clerk/types from 4.84.0 to 4.84.1

## 0.16.12

### Patch Changes

- 091889a: Bump @clerk/backend from 2.10.1 to 2.12.0
- 091889a: Bump @clerk/shared from 3.23.0 to 3.24.0
- 091889a: Bump @clerk/types from 4.83.0 to 4.84.0

## 0.16.11

### Patch Changes

- 8357604: Bump @clerk/backend from 2.10.0 to 2.10.1
- 8357604: Bump @clerk/shared from 3.22.1 to 3.23.0
- 8357604: Bump @clerk/types from 4.82.0 to 4.83.0

## 0.16.10

### Patch Changes

- e937280: Bump @clerk/backend from 2.9.4 to 2.10.0
- e937280: Bump @clerk/shared from 3.22.0 to 3.22.1
- e937280: Bump @clerk/types from 4.81.0 to 4.82.0

## 0.16.9

### Patch Changes

- 41d5c6a: Bump @clerk/backend from 2.9.3 to 2.9.4
- 41d5c6a: Bump @clerk/shared from 3.21.2 to 3.22.0
- 41d5c6a: Bump @clerk/types from 4.80.0 to 4.81.0

## 0.16.8

### Patch Changes

- cb258d4: Bump @clerk/backend from 2.7.1 to 2.9.2
- cb258d4: Bump @clerk/shared from 3.19.0 to 3.21.1
- cb258d4: Bump @clerk/types from 4.75.0 to 4.79.0

## 0.16.7

### Patch Changes

- ac253cd: Bump @clerk/backend from 2.7.0 to 2.7.1
- ac253cd: Bump @clerk/shared from 3.18.1 to 3.19.0
- ac253cd: Bump @clerk/types from 4.74.0 to 4.75.0
- 43a6b71: Do not update Clerk options on load

## 0.16.6

### Patch Changes

- 0aad269: Bump @clerk/backend from 2.6.3 to 2.7.0
- 0aad269: Bump @clerk/shared from 3.18.0 to 3.18.1
- 0aad269: Bump @clerk/types from 4.73.0 to 4.74.0

## 0.16.5

### Patch Changes

- c783d96: Bump @clerk/backend from 2.6.2 to 2.6.3
- c783d96: Bump @clerk/shared from 3.17.0 to 3.18.0
- c783d96: Bump @clerk/types from 4.72.0 to 4.73.0

## 0.16.4

### Patch Changes

- 4446803: Bump @clerk/backend from 2.6.1 to 2.6.2
- 4446803: Bump @clerk/shared from 3.16.0 to 3.17.0
- 4446803: Bump @clerk/types from 4.71.0 to 4.72.0

## 0.16.3

### Patch Changes

- 3373e32: Bump @clerk/backend from 2.5.2 to 2.6.1
- 3373e32: Bump @clerk/shared from 3.15.0 to 3.16.0
- 3373e32: Bump @clerk/types from 4.70.0 to 4.71.0

## 0.16.2

### Patch Changes

- 75b784e: Bump @clerk/backend from 2.5.1 to 2.5.2
- 75b784e: Bump @clerk/shared from 3.14.0 to 3.15.0
- 75b784e: Bump @clerk/types from 4.69.0 to 4.70.0

## 0.16.1

### Patch Changes

- 599a679: Bump @clerk/backend from 2.4.3 to 2.5.1
- 599a679: Bump @clerk/shared from 3.12.1 to 3.14.0
- 599a679: Bump @clerk/types from 4.66.0 to 4.69.0

## 0.16.0

### Minor Changes

- 2cc9378: Handle multi-domain or proxy

## 0.15.0

### Minor Changes

- 231f4fe: Remove deprecated `currentUser()` local. Please use `clerkClient.users.getUser(id)` instead.

## 0.14.3

### Patch Changes

- 1b4c91d: Bump @clerk/backend from 2.4.2 to 2.4.3
- 1b4c91d: Bump @clerk/shared from 3.12.0 to 3.12.1
- 1b4c91d: Bump @clerk/types from 4.65.0 to 4.66.0

## 0.14.2

### Patch Changes

- fdfcbaa: Bump @clerk/backend from 2.4.1 to 2.4.2
- fdfcbaa: Bump @clerk/shared from 3.11.0 to 3.12.0
- fdfcbaa: Bump @clerk/types from 4.64.0 to 4.65.0

## 0.14.1

### Patch Changes

- f95298f: Bump @clerk/backend from 2.4.0 to 2.4.1
- f95298f: Bump @clerk/shared from 3.10.2 to 3.11.0
- f95298f: Bump @clerk/types from 4.63.0 to 4.64.0

## 0.14.0

### Minor Changes

- 6b0b5b0: Introduce `verifyWebhook()` helper

  Make sure to set the `CLERK_WEBHOOK_SIGNING_SECRET` environment variable in your SvelteKit project to use this helper.

  Usage:

  ```ts
  import { verifyWebhook } from 'svelte-clerk/webhooks';
  import type { RequestHandler } from './$types';

  export const GET: RequestHandler = async ({ request }) => {
  	try {
  		const evt = await verifyWebhook(request);
  		if (evt.type === 'user.created') {
  			// Handle user creation
  			console.log('New user created:', evt.data.id);
  		}
  	} catch (err) {
  		// Invalid webhook signature
  		return new Response('Webhook verification failed', { status: 400 });
  	}
  };
  ```

### Patch Changes

- d2421dd: Bump @clerk/backend from 2.3.1 to 2.4.0
- d2421dd: Bump @clerk/shared from 3.10.1 to 3.10.2
- d2421dd: Bump @clerk/types from 4.62.1 to 4.63.0

## 0.13.4

### Patch Changes

- 8c906e0: Use shared `ProtectProps` type

## 0.13.3

### Patch Changes

- 119f323: Bump @clerk/backend from 2.1.0 to 2.2.0
- 119f323: Bump @clerk/shared from 3.9.7 to 3.9.8
- 119f323: Bump @clerk/types from 4.60.1 to 4.61.0

## 0.13.2

### Patch Changes

- 4f062e6: Bump @clerk/backend from 2.0.0 to 2.1.0
- 4f062e6: Bump @clerk/shared from 3.9.6 to 3.9.7
- 4f062e6: Bump @clerk/types from 4.60.0 to 4.60.1

## 0.13.1

### Patch Changes

- 11b0267: Fix cookies not being properly set

## 0.13.0

### Minor Changes

- 0cf3b59: Introduce Clerk Backend v2 and prepare for machine auth feature

### Patch Changes

- e760bd2: Bump @clerk/backend from 1.34.0 to 2.0.0
- e760bd2: Bump @clerk/shared from 3.9.5 to 3.9.6
- e760bd2: Bump @clerk/types from 4.59.3 to 4.60.0

## 0.12.5

### Patch Changes

- ce667fc: Bump @clerk/backend from 1.33.1 to 1.34.0
- ce667fc: Bump @clerk/shared from 3.9.4 to 3.9.5
- ce667fc: Bump @clerk/types from 4.59.2 to 4.59.3

## 0.12.4

### Patch Changes

- e4200d5: Bump @clerk/backend from 1.32.2 to 1.33.1
- e4200d5: Bump @clerk/shared from 3.9.1 to 3.9.4
- e4200d5: Bump @clerk/types from 4.59.0 to 4.59.2

## 0.12.3

### Patch Changes

- ec8798a: Bump @clerk/backend from 1.32.0 to 1.32.2
- ec8798a: Bump @clerk/shared from 3.8.2 to 3.9.1
- ec8798a: Bump @clerk/types from 4.58.0 to 4.59.0

## 0.12.2

### Patch Changes

- d9b47ac: Add `feature` and `plan` prop to `<Protect>` component.

  Usage:

  Plan

  ```svelte
  <Protect plan="my-plan" />
  ```

  Feature

  ```svelte
  <Protect feature="my-feature" />
  ```

  Scoped per user or per org

  ```svelte
  <Protect feature="org:my-feature" />
  <Protect feature="user:my-feature" />
  <Protect plan="org:my-plan" />
  <Protect plan="user:my-plan" />
  ```

## 0.12.1

### Patch Changes

- bf6e4d5: Bump @clerk/backend from 1.31.4 to 1.32.0
- bf6e4d5: Bump @clerk/shared from 3.8.1 to 3.8.2
- bf6e4d5: Bump @clerk/types from 4.57.1 to 4.58.0
- 4f90a54: Allow custom buttons for unstyled components using the `asChild` prop.

  Example:

  ```html
  <script>
  	import { SignInButton } from 'svelte-clerk';
  </script>

  <SignInButton asChild>
  	{#snippet children({ signIn })}
  	<button onclick="{signIn}">Custom sign in button</button>
  	{/snippet}
  </SignInButton>
  ```

## 0.12.0

### Minor Changes

- 6362a1c: Introduce `<PricingTable />` component. Read more about Clerk Billing [here](https://clerk.com/billing).

## 0.11.6

### Patch Changes

- d3e16a6: Bump @clerk/backend from 1.30.0 to 1.31.2
- d3e16a6: Bump @clerk/shared from 3.7.4 to 3.7.8
- d3e16a6: Bump @clerk/types from 4.55.1 to 4.56.3
- 1d0a8dd: Use built-in Netlify cache handling function

## 0.11.5

### Patch Changes

- 16ca21c: Bump @clerk/backend from 1.29.2 to 1.30.0
- 16ca21c: Bump @clerk/shared from 3.7.3 to 3.7.4
- 16ca21c: Bump @clerk/types from 4.55.0 to 4.55.1

## 0.11.4

### Patch Changes

- a79e175: Bump @clerk/backend from 1.29.1 to 1.29.2
- a79e175: Bump @clerk/shared from 3.7.2 to 3.7.3
- a79e175: Bump @clerk/types from 4.54.2 to 4.55.0

## 0.11.3

### Patch Changes

- 30f344a: Bump @clerk/backend from 1.29.0 to 1.29.1
- 30f344a: Bump @clerk/shared from 3.7.1 to 3.7.2
- 30f344a: Bump @clerk/types from 4.54.1 to 4.54.2
- 6da4e7e: Fix missing provider props

## 0.11.2

### Patch Changes

- 6f5aa3a: Bump @clerk/backend from 1.27.3 to 1.29.0
- 6f5aa3a: Bump @clerk/shared from 3.6.0 to 3.7.1
- 6f5aa3a: Bump @clerk/types from 4.53.0 to 4.54.1

## 0.11.1

### Patch Changes

- 7da9ee5: Bump @clerk/backend from 1.27.1 to 1.27.3
- 7da9ee5: Bump @clerk/shared from 3.4.1 to 3.6.0
- 7da9ee5: Bump @clerk/types from 4.51.1 to 4.53.0

## 0.11.0

### Minor Changes

- 9b704c6: Set `svelte` peer dependency to `^5.11.0` and optional `@sveltejs/kit` peer dependency to `^2.20.0`

### Patch Changes

- cba4d77: Bump @clerk/backend from 1.27.0 to 1.27.1
- cba4d77: Bump @clerk/shared from 3.4.0 to 3.4.1
- cba4d77: Bump @clerk/types from 4.51.0 to 4.51.1
- 6b79910: Fix Netlify and Clerk dev instance redirect loop

## 0.10.10

### Patch Changes

- 7f60b3c: Bump @clerk/backend from 1.26.0 to 1.27.0
- 7f60b3c: Bump @clerk/shared from 3.3.0 to 3.4.0
- 7f60b3c: Bump @clerk/types from 4.50.2 to 4.51.0

## 0.10.9

### Patch Changes

- 2c32581: Bump @clerk/backend from 1.25.8 to 1.26.0
- 2c32581: Bump @clerk/shared from 3.2.3 to 3.3.0
- 2c32581: Bump @clerk/types from 4.50.1 to 4.50.2

## 0.10.8

### Patch Changes

- 0b6bab1: Deprecate `event.locals.auth` in favor of `event.locals.auth()` as function

## 0.10.7

### Patch Changes

- 67e8bb1: Bump @clerk/backend from 1.25.7 to 1.25.8
- 67e8bb1: Bump @clerk/shared from 3.2.2 to 3.2.3
- 67e8bb1: Bump @clerk/types from 4.50.0 to 4.50.1

## 0.10.6

### Patch Changes

- ec04bd7: Bump @clerk/backend from 1.25.6 to 1.25.7
- ec04bd7: Bump @clerk/shared from 3.2.1 to 3.2.2
- ec04bd7: Bump @clerk/types from 4.49.2 to 4.50.0

## 0.10.5

### Patch Changes

- f270b83: Bump @clerk/backend from 1.25.5 to 1.25.6
- f270b83: Bump @clerk/shared from 3.2.0 to 3.2.1
- f270b83: Bump @clerk/types from 4.49.1 to 4.49.2

## 0.10.4

### Patch Changes

- 4564d76: Bump @clerk/backend from 1.25.2 to 1.25.5
- 4564d76: Bump @clerk/shared from 3.0.1 to 3.2.0
- 4564d76: Bump @clerk/types from 4.48.0 to 4.49.1

## 0.10.3

### Patch Changes

- 07a890c: Use `SignedInSessionResource` type for the session resource.

## 0.10.2

### Patch Changes

- 3a0c70c: Fix incorrect property name when updating Clerk UI props

## 0.10.1

### Patch Changes

- 9b4f02f: Bump @clerk/backend from 1.25.1 to 1.25.2
- 9b4f02f: Bump @clerk/shared from 3.0.0 to 3.0.1
- 9b4f02f: Bump @clerk/types from 4.47.0 to 4.48.0

## 0.10.0

### Minor Changes

- 5375f09: Add support for SvelteKit static adapter.

  Usage:

  ```svelte
  <script lang="ts">
  	import type { Snippet } from '@svelte';
  	import {
  		ClerkProvider,
  		SignedIn,
  		SignedOut,
  		UserButton,
  		SignInButton
  	} from 'svelte-clerk/client'; // import from /client
  </script>

  <ClerkProvider>
  	<SignedIn>
  		<UserButton />
  		<p>Welcome back!</p>
  	</SignedIn>
  	<SignedOut>
  		<SignInButton mode="modal" />
  	</SignedOut>
  </ClerkProvider>
  ```

## 0.9.0

### Minor Changes

- 6d990ca: Use dynamic env vars for proper runtime support

### Patch Changes

- f7d73d2: Bump @clerk/backend from 1.25.0 to 1.25.1 in the clerk-dependencies group

## 0.8.7

### Patch Changes

- 9c54ccd: Bump @clerk/backend from 1.24.3 to 1.25.0 in the clerk-dependencies group

## 0.8.6

### Patch Changes

- e34bc8b: Bump @clerk/backend from 1.24.2 to 1.24.3
- e34bc8b: Bump @clerk/shared from 2.22.0 to 3.0.0
- e34bc8b: Bump @clerk/types from 4.46.1 to 4.47.0

## 0.8.5

### Patch Changes

- 36d96c7: Export the `ClerkContext` interface and `setClerkContext` function. This allows usage without the `ClerkProvider` component in advanced use cases and in tests.

## 0.8.4

### Patch Changes

- d479e0e: Bump @clerk/backend from 1.24.1 to 1.24.2
- d479e0e: Bump @clerk/shared from 2.21.1 to 2.22.0
- d479e0e: Bump @clerk/types from 4.46.0 to 4.46.1

## 0.8.3

### Patch Changes

- f1d3cec: Replace deprecated `page` store from `$app/stores` with `page` state from `$app/state`.
- 32c7921: Allow overriding of `routerPush` and `routerReplace` options in the `<ClerkProvider>` component.

## 0.8.2

### Patch Changes

- ad4226f: Add [`OrganizationList`](https://clerk.com/docs/components/organization/organization-list) component.

  Usage:

  ```svelte
  <script>
  	import { OrganizationList } from 'svelte-clerk';
  </script>

  <OrganizationList />
  ```

- dc8b894: Use shared unstyled button component type props
- e928ae7: Bump Clerk dependencies to latest versions:
  - `@clerk/backend` from ^1.24.0 to ^1.29.1
  - `@clerk/shared` from ^2.21.0 to ^2.28.1
  - `@clerk/types` from ^4.45.1 to ^4.53.3

## 0.8.1

### Patch Changes

- 2ebef19: Bump @clerk/backend from 1.23.11 to 1.24.0
- 2ebef19: Bump @clerk/shared from 2.20.18 to 2.21.0
- 2ebef19: Bump @clerk/types from 4.45.0 to 4.45.1

## 0.8.0

### Minor Changes

- d6ec8cf: Add [
  `<RedirectToSignIn />`](https://clerk.com/docs/components/control/redirect-to-signin) and
  [`<RedirectToSignUp />`](https://clerk.com/docs/components/control/redirect-to-signup)
  control components.

  Usage:

  ```svelte
  <script>
  	import { RedirectToSignIn, SignedIn, SignedOut } from 'svelte-clerk';
  </script>

  <SignedIn>
  	<div>Signed in</div>
  </SignedIn>
  <SignedOut>
  	<RedirectToSignIn />
  </SignedOut>
  ```

## 0.7.5

### Patch Changes

- 25646fb: Bump @clerk/backend from 1.23.9 to 1.23.11
- 25646fb: Bump @clerk/shared from 2.20.16 to 2.20.18
- 25646fb: Bump @clerk/types from 4.44.2 to 4.45.0

## 0.7.4

### Patch Changes

- 6d8bf53: Bump @clerk/backend from 1.23.8 to 1.23.9
- 6d8bf53: Bump @clerk/shared from 2.20.15 to 2.20.16
- 6d8bf53: Bump @clerk/types from 4.44.1 to 4.44.2

## 0.7.3

### Patch Changes

- 0a6b40a: Make publishable key prop optional and use env var

## 0.7.2

### Patch Changes

- c520d77: Bump @clerk/backend from 1.23.7 to 1.23.8
- c520d77: Bump @clerk/shared from 2.20.14 to 2.20.15
- c520d77: Bump @clerk/types from 4.44.0 to 4.44.1

## 0.7.1

### Patch Changes

- 0d84650: Bump @clerk/backend from 1.23.1 to 1.23.7
- 0d84650: Bump @clerk/shared from 2.20.8 to 2.20.14
- 0d84650: Bump @clerk/types from 4.41.0 to 4.44.0

## 0.7.0

### Minor Changes

- 2fdb203: Add sign-in-or-up feature props

### Patch Changes

- 269121d: Bump @clerk/backend from 1.21.6 to 1.23.1
- 19daf49: Bump @clerk/shared from 2.20.6 to 2.20.8
- 19daf49: Bump @clerk/types from 4.40.2 to 4.41.0

## 0.6.0

### Minor Changes

- e8c59ec: Automatically use env vars for `<ClerkProvider>` props and server utils

## 0.5.4

### Patch Changes

- 84e0825: Bump @clerk/backend from 1.21.4 to 1.21.6
- 84e0825: Bump @clerk/shared from 2.20.4 to 2.20.6
- 84e0825: Bump @clerk/types from 4.40.0 to 4.40.2

## 0.5.3

### Patch Changes

- e9a43fb: Bump @clerk/backend from 1.21.2 to 1.21.4
- e9a43fb: Bump @clerk/shared from 2.20.2 to 2.20.4
- e9a43fb: Bump @clerk/types from 4.39.4 to 4.40.0

## 0.5.2

### Patch Changes

- d8da67b: Bump @clerk/backend from 1.21.1 to 1.21.2
- d8da67b: Bump @clerk/shared from 2.20.1 to 2.20.2
- d8da67b: Bump @clerk/types from 4.39.3 to 4.39.4

## 0.5.1

### Patch Changes

- cafdcfe: Bump @clerk/backend from 1.21.0 to 1.21.1
- cafdcfe: Bump @clerk/shared from 2.20.0 to 2.20.1
- cafdcfe: Bump @clerk/types from 4.39.2 to 4.39.3

## 0.5.0

### Minor Changes

- 8a0b719: Add `currentUser` helper function.

  Usage:

  ```ts
  // src/routes/user/+page.server.ts
  export const load = async ({ locals }) => {
  	const user = await locals.currentUser();

  	return {
  		user
  	};
  };
  ```

## 0.4.15

### Patch Changes

- fa9038f: Bump @clerk/backend from 1.20.0 to 1.21.0
- fa9038f: Bump @clerk/shared from 2.19.1 to 2.20.0
- fa9038f: Bump @clerk/types from 4.39.0 to 4.39.2

## 0.4.14

### Patch Changes

- 676676e: Bump @clerk/backend from 1.19.2 to 1.20.0
- 676676e: Bump @clerk/shared from 2.19.0 to 2.19.1
- 676676e: Bump @clerk/types from 4.38.0 to 4.39.0

## 0.4.13

### Patch Changes

- bc23b5e: Bump @clerk/backend from 1.19.1 to 1.19.2
- bc23b5e: Bump @clerk/shared from 2.18.1 to 2.19.0
- bc23b5e: Bump @clerk/types from 4.37.0 to 4.38.0

## 0.4.12

### Patch Changes

- d3223b5: Bump @clerk/backend from 1.19.0 to 1.19.1
- d3223b5: Bump @clerk/shared from 2.18.0 to 2.18.1
- d3223b5: Bump @clerk/types from 4.36.0 to 4.37.0

## 0.4.11

### Patch Changes

- 2f9cc00: Bump @clerk/backend from 1.18.0 to 1.19.0
- 2f9cc00: Bump @clerk/shared from 2.17.0 to 2.18.0
- 2f9cc00: Bump @clerk/types from 4.35.0 to 4.36.0

## 0.4.10

### Patch Changes

- 1d693d2: Make sure `$page.data` is defined before accessing initial state properties.

## 0.4.9

### Patch Changes

- bd9aea0: Bump @clerk/backend from 1.17.1 to 1.18.0
- bd9aea0: Bump @clerk/shared from 2.16.0 to 2.17.0
- bd9aea0: Bump @clerk/types from 4.34.1 to 4.35.0

## 0.4.8

### Patch Changes

- 98e59a5: Fix missing internal prop updater

## 0.4.7

### Patch Changes

- 2837233: Improve internal Clerk UI action

## 0.4.6

### Patch Changes

- cb1a13b: Bump @clerk/backend from 1.16.4 to 1.17.1
- cb1a13b: Bump @clerk/shared from 2.14.0 to 2.16.0
- bf93894: Bump @clerk/types from 4.34.0 to 4.34.1

## 0.4.5

### Patch Changes

- 8774eb2: Bump @clerk/backend from 1.16.2 to 1.16.4
- 8774eb2: Bump @clerk/shared from 2.12.1 to 2.14.0
- 8774eb2: Bump @clerk/types from 4.32.0 to 4.34.0

## 0.4.4

### Patch Changes

- 41241f7: Bump @clerk/backend from 1.16.1 to 1.16.2 in the clerk-dependencies group

## 0.4.3

### Patch Changes

- ff325ba: Bump @clerk/backend from 1.16.0 to 1.16.1
- ff325ba: Bump @clerk/shared from 2.12.0 to 2.12.1
- ff325ba: Bump @clerk/types from 4.31.0 to 4.32.0
- 547ec7d: Fix API url default value

## 0.4.2

### Patch Changes

- cd4e089: Bump @clerk/backend from 1.15.6 to 1.16.0
- cd4e089: Bump @clerk/shared from 2.11.4 to 2.12.0
- 44bd3d5: Bump @clerk/types from 4.30.0 to 4.31.0

## 0.4.1

### Patch Changes

- c0e496a: Do not remount UI components on prop update

## 0.4.0

### Minor Changes

- ec86595: Add `<Waitlist />` component

### Patch Changes

- 86b4096: Bump @clerk/backend from 1.15.5 to 1.15.6
- 86b4096: Bump @clerk/shared from 2.11.3 to 2.11.4
- 86b4096: Bump @clerk/types from 4.29.0 to 4.30.0

## 0.3.8

### Patch Changes

- ce9b788: Bump @clerk/backend from 1.15.2 to 1.15.5
- ce9b788: Bump @clerk/shared from 2.11.0 to 2.11.3

## 0.3.7

### Patch Changes

- fe674c0: Bump @clerk/backend from 1.15.1 to 1.15.2
- fe674c0: Bump @clerk/shared from 2.10.1 to 2.11.0
- fe674c0: Bump @clerk/types from 4.28.0 to 4.29.0

## 0.3.6

### Patch Changes

- 0eaa484: Simplify SSR props

## 0.3.5

### Patch Changes

- 07b13b9: Fix cookie setting

## 0.3.4

### Patch Changes

- b5269ca: Fix env vars access when prerendering

## 0.3.3

### Patch Changes

- 3340fba: React to UI component prop updates
