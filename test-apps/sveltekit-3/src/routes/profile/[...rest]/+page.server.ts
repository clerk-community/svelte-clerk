import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = ({ locals }) => {
	const { userId } = locals.auth();

	if (!userId) {
		redirect(307, '/sign-in');
	}

	return { userId };
};
