import { verifyWebhook } from 'svelte-clerk/webhooks';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
	try {
		const event = await verifyWebhook(request);

		return Response.json({ type: event.type });
	} catch {
		return new Response('Webhook verification failed', { status: 400 });
	}
};
