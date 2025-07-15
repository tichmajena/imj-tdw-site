import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
export const prerender = false;
export const load = (async ({ parent, url }) => {
	const data = await parent();
	if (!data.user.exists && url.pathname !== '/admin') {
		redirect(301, '/admin');
	}
	return { ...data };
}) satisfies LayoutServerLoad;
