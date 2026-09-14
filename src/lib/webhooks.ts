import { verifyWebhook as _verifyWebhook } from '@clerk/backend/webhooks';
import { CLERK_WEBHOOK_SIGNING_SECRET } from '$app/env/private';

export * from '@clerk/backend/webhooks';

export function verifyWebhook(...args: Parameters<typeof _verifyWebhook>) {
	return _verifyWebhook(args[0], {
		signingSecret: CLERK_WEBHOOK_SIGNING_SECRET,
		...args[1]
	});
}
