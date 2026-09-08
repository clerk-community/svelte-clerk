---
'svelte-clerk': minor
---

`<Show>` now renders on the server and during hydration when `initialState` is provided (via `buildClerkProps`), instead of rendering nothing until clerk-js has loaded in the browser. This matches `@clerk/react` and `@clerk/vue` and removes the blank-content flash on full page loads.

- `<Show>` now accepts a `treatPendingAsSignedOut` prop (default `true`), matching the other Clerk SDKs. Sessions with a `pending` status are now treated as signed out unless the prop is set to `false`.
- Because `<Show>` can now render server-side, `when` predicate functions, children, and `fallback` snippets must be safe to run during SSR.
