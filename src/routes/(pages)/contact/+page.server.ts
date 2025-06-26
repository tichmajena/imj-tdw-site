import { page_json_clean } from '$lib/server/utils';
import type { Actions, PageServerLoad } from './$types';
import { sendMail } from '$lib/server/aws';
import { ContactMessage } from '$src/lib/js/zod';
import { zodValidationErrors } from '$src/lib/js/utils';
import { fail } from '@sveltejs/kit';

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
		const mi = formData.get('mi');

		if (!mi) {
			fail(401, { success: false });
		}
		const contactData = Object.fromEntries(formData);
		// console.log(contactData);

		try {
			ContactMessage.parse(contactData);
		} catch (error) {
			const messages: any = zodValidationErrors(error);
			return fail(401, { messages, success: false, fields: contactData });
		}
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
