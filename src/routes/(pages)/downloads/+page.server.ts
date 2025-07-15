import { getPage, getResources } from '$src/lib/server/firebase-admin';
import { page_json_clean } from '$src/lib/server/utils';
import type { PageServerLoad } from './$types';

export const load = (async ({ fetch }) => {
	let route = '/downloads'.replaceAll('/', '_-_');
	const page = await getPage(route);

	let entry = JSON.parse(page?.entry || page_json_clean);
	entry = { ...entry, id: page?.id || '' };

	let downloads = await getResources();
	//console.log({ downloads });

	const futurBuild = downloads.filter((item) => {
		return item.category === 'futur-build';
	});
	//console.log({ futurBuild });

	const corporate = downloads.filter((item) => {
		return item.category === 'corporate';
	});

	//console.log({ corporate });

	return { entry, downloads: { corporate, futurBuild } };
}) satisfies PageServerLoad;
