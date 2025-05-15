import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load = (async ({ fetch }) => {
	const res = await fetch('/auth', { method: 'DELETE' });
	if (res.status === 200) redirect(301, '/admin');
	return {};
}) satisfies PageServerLoad;
