import { page_json } from '$src/lib/server/utils';
import type { PageServerLoad, Actions } from './$types';

export const load = (async ({ fetch }) => {
	let route = '/'.replaceAll('/', '_-_');
	const page = await getPage(route);
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

	async function getProjects() {
		const res = await fetch('/api/projects');
		const projects = await res.json();
		console.log({ projects });
		//await timeout(3000);
		return projects;
	}

	return { gallery: getGallery(), entry, projects: getProjects() };
}) satisfies PageServerLoad;

export const actions: Actions = {
	setTheme: ({ url, cookies }) => {
		const theme = url.searchParams.get('theme');

		if (theme) {
			cookies.set('colortheme', theme, {
				path: '/',
				maxAge: 60 * 60 * 24 * 365
			});
		}
	}
};

async function timeout(ms: number) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}
