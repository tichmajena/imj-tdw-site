import { page_json } from '$src/lib/server/utils';
import type { PageServerLoad } from './$types';

export const load = (async ({ fetch }) => {
	let route = '/about'.replaceAll('/', '_-_');
	const page = await getPage(route);
	console.log({ page });

	let entry = JSON.parse(page?.entry || JSON.stringify(page_json));
	entry = { ...entry, id: page?.id || '' };
	async function getGallery() {
		const res = await fetch('/api/media');
		const media = await res.json();
		console.log({ media });
		return media;
	}
	async function getPage(route: string) {
		const res = await fetch('/api/page?route=' + route);
		const page = await res.json();
		// console.log({ media });
		return page;
	}
	return { gallery: getGallery(), entry: entry };
}) satisfies PageServerLoad;
