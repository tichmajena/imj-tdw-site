import { page_json_clean } from '$lib/server/utils';
import type { Actions, PageServerLoad } from './$types';
import { sendMail } from '$lib/server/aws';

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
		// console.log(contactData);
		let body = `Name: ${contactData.name}\nEmail: ${contactData.email}\r\n\r\nMessage:\n${contactData.message}`;

		const result = await sendMail({ body, subject: 'From TDW Website' });
		// console.log({ result });
		if (result === null) {
			return { success: false, data: contactData };
		} else {
			return { success: true };
		}
	}
};
