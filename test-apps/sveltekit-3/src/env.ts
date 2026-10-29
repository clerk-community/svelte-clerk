import { defineEnvVars } from '@sveltejs/kit/env';
import { clerkEnvVars } from 'svelte-clerk/env';

export const variables = defineEnvVars({
	...clerkEnvVars()
});
