---
'svelte-clerk': patch
---

Create the server `clerkClient` lazily on first use instead of at module scope. Reading `$env/dynamic/private` at module scope captures empty values in inlined server bundles (e.g. `adapter-vercel`), where module evaluation runs before SvelteKit's `Server.init()` populates dynamic env. The client was then built with an undefined `secretKey`, so every Backend API call failed with "Missing Clerk Secret Key" — which silently breaks nonce-format handshake resolution.
