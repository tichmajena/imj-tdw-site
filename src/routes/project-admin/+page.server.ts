import type { PageServerLoad, Actions } from './$types';

export const load = (async ({ fetch }) => {
	let res = await fetch('/api/projects', { method: 'GET' });
	let projects = await res.json();
	return { projects };
}) satisfies PageServerLoad;

export const actions: Actions = {
	createProject: async ({ request, fetch }) => {
		let dataEntries = await request.formData();
		let project = Object.fromEntries(dataEntries);

		let body = {
			title: project.title,
			type: project.type,
			year: +project.year,
			description: project.description,
			services: project.services.split(','),
			images: [],
			featured_image: 'home-sample.jpg',
			index: 1,
			is_featured: false
		};

		console.log({ body });
		let res = await fetch('/api/projects', { method: 'POST', body: JSON.stringify(body) });

		return {
			success: true
		};
	},
	deleteProject: async ({ request, fetch }) => {
		let dataEntries = await request.formData();
		let id = dataEntries.get('id') as string;
		console.table({ id1: id });

		await fetch(`api/projects?id=${id}`, { method: 'DELETE' });
		return {
			success: true
		};
	}
};
