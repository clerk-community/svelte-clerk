import { VERSION } from '@sveltejs/kit';

export const isSvelteKit3OrLater = Number.parseInt(VERSION, 10) >= 3;
