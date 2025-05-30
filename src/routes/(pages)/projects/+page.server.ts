import { db } from '$src/lib/server/firebase-admin';
import type { PageServerLoad } from './$types';

export const load = (async ({ fetch }) => {
	const page_json = {
		id: '',
		type: 'page',
		title: ['Svedit', []],
		subtitle: ['A  for building rich content editors with Svelte 5', [[24, 44, 'emphasis']]],
		body: []
	};

	let route = '/projects'.replaceAll('/', '_-_');
	const page = await getPage(route);

	let entry = JSON.parse(page?.entry || JSON.stringify(page_json));
	entry = { ...entry, id: page?.id || '' };

	const res = await fetch('/api/projects');
	const projectData = await res.json();

	async function getGallery() {
		const res = await fetch('/api/media');
		const media = await res.json();
		return media;
	}
	async function getPage(route: string) {
		const res = await fetch('/api/page?route=' + route);
		const page = await res.json();
		return page;
	}
	return { projectData, entry };
}) satisfies PageServerLoad;
