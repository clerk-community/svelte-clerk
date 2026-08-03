import { createClerkClient } from '@clerk/backend';

import { API_URL, API_VERSION, TELEMETRY_DEBUG, TELEMETRY_DISABLED } from './constants.js';
import { getDynamicPrivateEnvVariables } from '$lib/utils/getDynamicPrivateEnvVariables';

let clerkClientSingleton: ReturnType<typeof createClerkClient> | undefined;

function getClerkClient() {
	if (clerkClientSingleton) {
		return clerkClientSingleton;
	}
	const { secretKey, jwtKey } = getDynamicPrivateEnvVariables();
	const client = createClerkClient({
		secretKey,
		apiUrl: API_URL,
		apiVersion: API_VERSION,
		jwtKey,
		telemetry: {
			disabled: TELEMETRY_DISABLED,
			debug: TELEMETRY_DEBUG
		}
	});
	// Don't memoize until the secret key is readable, so an access that happens
	// before dynamic env is populated doesn't permanently capture a keyless client.
	if (secretKey) {
		clerkClientSingleton = client;
	}
	return client;
}

export const clerkClient = new Proxy({} as ReturnType<typeof createClerkClient>, {
	get(_target, prop) {
		const client = getClerkClient();
		const value = Reflect.get(client, prop, client);
		return typeof value === 'function' ? value.bind(client) : value;
	}
});
