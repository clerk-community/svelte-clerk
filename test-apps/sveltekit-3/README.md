# SvelteKit 3 test app

A minimal SvelteKit 3 app that consumes the packed `svelte-clerk` tarball, the way a real
consumer would. It is used by the compatibility suite in `e2e-compat/`, which runs the same
tests against this app and the SvelteKit 2 app at the repository root.

Run it from the repository root:

```sh
pnpm test:compat
```

That builds and packs the library, installs it here, and runs the suite. No Clerk account is
needed: the tests use placeholder keys and stub clerk-js in the browser.
