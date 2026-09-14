import { describe, expect, it, vi, beforeEach } from 'vitest';
import { withClerkHandler } from './withClerkHandler.js';
import type { RequestEvent } from '@sveltejs/kit';
import { CLERK_SECRET_KEY } from '$app/env/private';
import { CLERK_PUBLISHABLE_KEY, CLERK_SIGN_IN_URL } from '$app/env/public';

const { authenticateRequest } = vi.hoisted(() => ({
	authenticateRequest: vi.fn()
}));

vi.mock('@clerk/backend', () => ({
	createClerkClient: vi.fn(() => ({ authenticateRequest }))
}));

function createEvent() {
	return {
		request: new Request('http://localhost:5173/'),
		locals: {},
		cookies: { set: vi.fn() },
		setHeaders: vi.fn()
	} as unknown as RequestEvent;
}

const resolve = vi.fn(async () => new Response('ok'));

beforeEach(() => {
	authenticateRequest.mockReset();
	authenticateRequest.mockResolvedValue({
		headers: new Headers(),
		status: 'signed-in',
		publishableKey: 'pk_test_x',
		toAuth: (options?: unknown) => ({ userId: 'user_123', passedOptions: options })
	});
	resolve.mockClear();
});

describe('withClerkHandler', () => {
	it('authenticates with environment-derived options by default', async () => {
		const event = createEvent();
		await withClerkHandler()({ event, resolve } as never);

		expect(authenticateRequest).toHaveBeenCalledTimes(1);
		const options = authenticateRequest.mock.calls[0][1];
		expect(options.secretKey).toBe(CLERK_SECRET_KEY);
		expect(options.publishableKey).toBe(CLERK_PUBLISHABLE_KEY);
		expect(options.signInUrl).toBe(CLERK_SIGN_IN_URL);
	});

	it('lets handler options override the environment', async () => {
		const event = createEvent();
		await withClerkHandler({
			secretKey: 'sk_live_override',
			signInUrl: '/custom-sign-in'
		})({ event, resolve } as never);

		const options = authenticateRequest.mock.calls[0][1];
		expect(options.secretKey).toBe('sk_live_override');
		expect(options.signInUrl).toBe('/custom-sign-in');
		// non-overridden options still come from the environment
		expect(options.publishableKey).toBe(CLERK_PUBLISHABLE_KEY);
	});

	it('decorates locals with the auth function', async () => {
		const event = createEvent();
		await withClerkHandler()({ event, resolve } as never);

		expect(event.locals.auth).toBeTypeOf('function');
		expect(event.locals.auth()).toMatchObject({ userId: 'user_123' });
		expect(resolve).toHaveBeenCalledWith(event);
	});

	it('returns a 307 redirect when a handshake location header is present', async () => {
		authenticateRequest.mockResolvedValue({
			headers: new Headers({ location: 'https://clerk.example.com/handshake' }),
			status: 'handshake',
			publishableKey: 'pk_test_x',
			toAuth: () => null
		});

		const event = createEvent();
		const response = await withClerkHandler()({ event, resolve } as never);

		expect(response.status).toBe(307);
		expect(response.headers.get('location')).toBe('https://clerk.example.com/handshake');
		expect(resolve).not.toHaveBeenCalled();
	});
});
