import { constants } from '@clerk/backend/internal';
import {
	getEnvVariable,
	getDynamicPublicEnvVariables
} from '$lib/utils/getDynamicPublicEnvVariables';
import { getDynamicPrivateEnvVariables } from '$lib/utils/getDynamicPrivateEnvVariables';
import { apiUrlFromPublishableKey } from '@clerk/shared/apiUrlFromPublishableKey';

// The Backend API settings are read from private variables first. The public names are
// still honored so existing setups keep working.
export const API_VERSION =
	getDynamicPrivateEnvVariables().apiVersion ?? getEnvVariable('PUBLIC_CLERK_API_VERSION', 'v1');
export const PUBLISHABLE_KEY = getDynamicPublicEnvVariables().publishableKey!;
export const API_URL =
	getDynamicPrivateEnvVariables().apiUrl ??
	getEnvVariable('PUBLIC_CLERK_API_URL', apiUrlFromPublishableKey(PUBLISHABLE_KEY));
export const TELEMETRY_DISABLED = getDynamicPublicEnvVariables().telemetryDisabled;
export const TELEMETRY_DEBUG = getDynamicPublicEnvVariables().telemetryDebug;
// Private env variables
export const SECRET_KEY = getDynamicPrivateEnvVariables().secretKey;
export const JWT_KEY = getDynamicPrivateEnvVariables().jwtKey;

export const { Cookies, Headers } = constants;
