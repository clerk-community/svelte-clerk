import { defineEnvVars } from '@sveltejs/kit/env';
import { clerkEnvVars } from '$lib/env/index.js';

export const variables = defineEnvVars({
	...clerkEnvVars()
});
