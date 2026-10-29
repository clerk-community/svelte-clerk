import { env } from '$env/dynamic/private';

function getEnvVariable(name: string, defaultValue?: string): string | undefined {
	// On SvelteKit 3 a variable declared in `src/env.ts` but left unset is present with an
	// `undefined` value, so checking for the key alone would skip the default.
	return (env as Record<string, string | undefined>)[name] ?? defaultValue;
}

export function getDynamicPrivateEnvVariables() {
	return {
		apiUrl: getEnvVariable('CLERK_API_URL'),
		apiVersion: getEnvVariable('CLERK_API_VERSION'),
		secretKey: getEnvVariable('CLERK_SECRET_KEY'),
		jwtKey: getEnvVariable('CLERK_JWT_KEY')
	};
}
