import { getPage, getTeam } from '$src/lib/server/firebase-admin';
import { page_json } from '$src/lib/server/utils';
import type { PageServerLoad } from './$types';

export const load = (async () => {
	let route = '/about'.replaceAll('/', '_-_');
	const page = await getPage(route);

	let entry = JSON.parse(page?.entry || JSON.stringify(page_json));
	entry = { ...entry, id: page?.id || '' };

	return {
		entry: entry,
		teamData: await getTeam()
	};
}) satisfies PageServerLoad;
