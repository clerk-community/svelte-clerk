# Components

The following [Clerk UI components](https://clerk.com/docs/components/overview) are available in Svelte Clerk:

- `<Show>` ([clerk docs](https://clerk.com/docs/react/reference/components/control/show))
- `<SignIn>` ([clerk docs](https://clerk.com/docs/components/authentication/sign-in))
- `<SignUp>` ([clerk docs](https://clerk.com/docs/components/authentication/sign-up))
- `<UserButton>` ([clerk docs](https://clerk.com/docs/components/user/user-button))
- `<UserAvatar>` ([clerk docs](https://clerk.com/docs/reference/components/user/user-avatar))
- `<UserProfile>` ([clerk docs](https://clerk.com/docs/components/user/user-profile))
- `<OrganizationList>` ([clerk docs](https://clerk.com/docs/components/organization/organization-list))
- `<OrganizationProfile>` ([clerk docs](https://clerk.com/docs/components/organization/organization-profile))
- `<OrganizationSwitcher>` ([clerk docs](https://clerk.com/docs/components/organization/organization-switcher))
- `<CreateOrganization>` ([clerk docs](https://clerk.com/docs/components/organization/create-organization))
- `<GoogleOneTap>` ([clerk docs](https://clerk.com/docs/components/authentication/google-one-tap))
- `<Waitlist />` ([clerk docs](https://clerk.com/docs/components/waitlist))
- `<PricingTable />` ([clerk docs](https://clerk.com/docs/components/pricing-table))
- `<APIKeys />` ([clerk docs](https://clerk.com/docs/reference/components/api-keys))
- `<ClerkLoaded>` ([clerk docs](https://clerk.com/docs/components/control/clerk-loaded))
- `<ClerkLoading>` ([clerk docs](https://clerk.com/docs/components/control/clerk-loading))

The main difference is that the Svelte components use [`Snippets`](https://svelte.dev/docs/svelte/snippet) to render their content.

### `<Show>`

Here's an example of the [`<Show>`](https://clerk.com/docs/react/reference/components/control/show) component with a fallback message:

```svelte
<script lang="ts">
	import { Show } from 'svelte-clerk/client';
</script>

<template>
	<Show when={{ permission: 'org:invoices:create' }}>
		{#snippet fallback()}
			<p>You do not have the permissions to create an invoice.</p>
		{/snippet}
	</Show>
</template>
```

`<Show>` supports the same `when` conditions as the other Clerk SDKs (`"signed-in"`, `"signed-out"`, an authorization object such as `{ role: 'org:admin' }`, or a `(has) => boolean` predicate), plus an optional `treatPendingAsSignedOut` prop (default `true`) that controls whether sessions with a `pending` status are treated as signed out.

When `initialState` is provided to `<ClerkProvider>` (SvelteKit apps get this from [`buildClerkProps()`](/kit/helpers#buildclerkprops)), `<Show>` renders the correct branch on the server and during hydration, before clerk-js has loaded. Without `initialState`, it renders nothing until clerk-js has loaded. Because of this, `when` predicate functions, children, and `fallback` snippets must be safe to run during SSR.

`<Show>` only controls what is rendered. It is not a security boundary; protect sensitive data in server `load` functions or API routes using [`locals.auth()`](/kit/quickstart#_6-protect-your-pages).

To see list of available props for each components, visit the [Clerk UI components documentation](https://clerk.com/docs/components/overview).
