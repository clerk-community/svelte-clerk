import { describe, expect, it, vi, beforeEach } from 'vitest';
import { clerkClient, createClerkClient } from './clerkClient.js';
import { createClerkClient as createBackendClerkClient } from '@clerk/backend';
import { PACKAGE_NAME, PACKAGE_VERSION } from '$lib/version.js';
import { CLERK_PUBLISHABLE_KEY } from '$app/env/public';
import { CLERK_SECRET_KEY } from '$app/env/private';
import { apiUrlFromPublishableKey } from '@clerk/shared/apiUrlFromPublishableKey';

vi.mock('@clerk/backend', () => ({
	createClerkClient: vi.fn((options) => ({ options }))
}));

const backendFactory = vi.mocked(createBackendClerkClient);

beforeEach(() => {
	backendFactory.mockClear();
});

describe('clerkClient', () => {
	it('creates a client from environment-derived defaults', () => {
		clerkClient();

		expect(backendFactory).toHaveBeenCalledTimes(1);
		const options = backendFactory.mock.calls[0][0]!;
		expect(options.secretKey).toBe(CLERK_SECRET_KEY);
		expect(options.publishableKey).toBe(CLERK_PUBLISHABLE_KEY);
		expect(options.userAgent).toBe(`${PACKAGE_NAME}@${PACKAGE_VERSION}`);
		expect(options.sdkMetadata).toEqual({ name: PACKAGE_NAME, version: PACKAGE_VERSION });
	});

	it('derives apiUrl from the publishable key when CLERK_API_URL is unset', () => {
		clerkClient();

		const options = backendFactory.mock.calls[0][0]!;
		expect(options.apiUrl).toBe(apiUrlFromPublishableKey(CLERK_PUBLISHABLE_KEY!));
	});

	it('creates a fresh client on every call', () => {
		const first = clerkClient();
		const second = clerkClient();

		expect(backendFactory).toHaveBeenCalledTimes(2);
		expect(first).not.toBe(second);
	});
});

describe('createClerkClient', () => {
	it('lets explicit options override the environment defaults', () => {
		createClerkClient({ secretKey: 'sk_live_override', apiUrl: 'https://api.example.com' });

		const options = backendFactory.mock.calls[0][0]!;
		expect(options.secretKey).toBe('sk_live_override');
		expect(options.apiUrl).toBe('https://api.example.com');
		// untouched defaults survive
		expect(options.publishableKey).toBe(CLERK_PUBLISHABLE_KEY);
	});
});
