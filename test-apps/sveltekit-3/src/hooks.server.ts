import { sequence, type Handle } from '@sveltejs/kit/hooks';
import { withClerkHandler } from 'svelte-clerk/server';

export const handle: Handle = sequence(withClerkHandler());
