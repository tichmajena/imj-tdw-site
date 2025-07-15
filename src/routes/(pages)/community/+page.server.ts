import { getPage, getProjects } from '$src/lib/server/firebase-admin';
import type { PageServerLoad } from './$types';

export const load = (async ({ fetch }) => {
	const page_json = {
		id: '',
		type: 'page',
		title: ['Svedit', []],
		subtitle: ['A  for building rich content editors with Svelte 5', [[24, 44, 'emphasis']]],
		body: []
	};

	let route = '/community'.replaceAll('/', '_-_');
	const page = await getPage(route);

	let entry = JSON.parse(page?.entry || JSON.stringify(page_json));
	entry = { ...entry, id: page?.id || '' };

	return {
		projectData: await getProjects({ cat: 'community', status: 'published', featured: false }),
		entry
	};
}) satisfies PageServerLoad;
