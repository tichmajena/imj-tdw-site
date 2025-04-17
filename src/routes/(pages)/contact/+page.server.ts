import { page_json_clean } from '$src/lib/server/utils';
import type { Actions, PageServerLoad } from './$types';

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

	let route = '/contact'.replaceAll('/', '_-_');
	const page = await getPage(route);

	let entry = JSON.parse(page?.entry || page_json_clean);
	entry = { ...entry, id: page?.id || '' };

	return { entry, gallery: getGallery() };
}) satisfies PageServerLoad;

export const actions: Actions = {
	default: async ({ request, fetch }) => {
		const formData = await request.formData();
		const contactData = Object.fromEntries(formData);
		console.log(contactData);
		let fullMessage = `Name: ${contactData.name}\nEmail: ${contactData.email}\r\n\r\nMessage:\n${contactData.message}`;
		console.log(fullMessage);

		return;
	}
};
