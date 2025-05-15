import { page_json_clean } from '$src/lib/server/utils';
import type { PageServerLoad } from './$types';

export const load = (async ({ fetch }) => {
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

	let route = '/downloads'.replaceAll('/', '_-_');
	const page = await getPage(route);

	let entry = JSON.parse(page?.entry || page_json_clean);
	entry = { ...entry, id: page?.id || '' };

	let resp = await fetch('/api/resources');
	let downloads = await resp.json();
	//console.log({ downloads });

	const futurBuild = downloads.filter((item) => {
		return item.category === 'futur-build';
	});
	//console.log({ futurBuild });

	const corporate = downloads.filter((item) => {
		return item.category === 'corporate';
	});

	//console.log({ corporate });

	return { entry, gallery: getGallery(), downloads: { corporate, futurBuild } };
}) satisfies PageServerLoad;
