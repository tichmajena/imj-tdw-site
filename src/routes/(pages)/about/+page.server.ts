import { page_json } from '$src/lib/server/utils';
import type { PageServerLoad } from './$types';

export const load = (async ({ fetch }) => {
	let route = '/about'.replaceAll('/', '_-_');
	const page = await getPage(route);

	const getTeam = await fetch('/api/members');
	const teamData = await getTeam.json();
	console.log({ teamData });

	let entry = JSON.parse(page?.entry || JSON.stringify(page_json));
	entry = { ...entry, id: page?.id || '' };
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

	return {
		gallery: getGallery(),
		entry: entry,
		teamData: teamData.filter((member) => member.image)
	};
}) satisfies PageServerLoad;
