---
outline: deep
---

# Build a custom sign-in or sign-up page in SvelteKit

This guide shows you how to host Clerk's `<SignIn />` component on a custom SvelteKit route so users can sign in or switch to sign up in a single flow.

## 1. Create the sign-in route

Create `src/routes/sign-in/[...sign-in]/+page.svelte`:

```svelte
<script lang="ts">
	import { SignIn } from 'svelte-clerk';
</script>

<SignIn />
```

The rest route (`[...sign-in]`) supports Clerk's internal sub-routes, such as multi-step auth paths.

On SvelteKit 3, every Clerk component that uses path-based routing needs a rest route, including `<SignUp />`, `<UserProfile />`, and `<OrganizationProfile />`. Without one, an internal step such as `/sign-in/factor-one` loads a 404 page, because SvelteKit 3 only navigates to URLs that match a route.

## 2. Configure redirect environment variables

Add these values to your `.env` file:

```sh
PUBLIC_CLERK_SIGN_IN_URL=/sign-in
PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/
PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=/
```

`svelte-clerk` reads these public variables automatically when initializing `ClerkProvider`.

## 3. Visit your new page

Run your app:

```sh
npm run dev
```

Then open `/sign-in` to test sign in and sign up in one flow.
