import { getPage, getProjects } from '$src/lib/server/firebase-admin';
import { page_json } from '$src/lib/server/utils';
import type { PageServerLoad, Actions } from './$types';

export const prerender = true;

export const load = (async ({ fetch }) => {
	let route = '/'.replaceAll('/', '_-_');
	const page = await getPage(route);
	let entry = JSON.parse(page?.entry || JSON.stringify(page_json));
	entry = { ...entry, id: page?.id || '' };

	return {
		entry,
		projects: await getProjects({ cat: 'project', status: 'published', featured: true })
	};
}) satisfies PageServerLoad;

// export const actions: Actions = {
// 	setTheme: ({ url, cookies }) => {
// 		const theme = url.searchParams.get('theme');

// 		if (theme) {
// 			cookies.set('colortheme', theme, {
// 				path: '/',
// 				maxAge: 60 * 60 * 24 * 365
// 			});
// 		}
// 	}
// };

async function timeout(ms: number) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}
