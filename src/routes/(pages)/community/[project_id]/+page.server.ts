import type { PageServerLoad } from './$types';

export const load = (async ({ params, fetch }) => {
	//console.log({ params });
	const res = await fetch(`/api/projects/${params.project_id}`);
	const project = await res.json();

	//console.log(project);
	// id: 'PBXRrAYihkhcD2c3fZhk'

	// if (Array.isArray(project.images) && project.images.length >= 2) {
	// 	const lastTwo = project.images.slice(-2);
	// 	project.images = [...lastTwo, ...project.images.slice(0, -2)];
	// 	await fetch(`/api/projects?id=${'PBXRrAYihkhcD2c3fZhk'}`, {
	// 		method: 'PUT',
	// 		body: JSON.stringify({ images: project.images })
	// 	});
	// 	console.log('done');
	// }

	return { project };
}) satisfies PageServerLoad;
