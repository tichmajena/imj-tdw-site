import type { PageServerLoad } from './$types';

export const load = (async ({ params, fetch }) => {
	//console.log({ params });
	const res = await fetch(`/api/projects/${params.project_id}`);
	const project = await res.json();
	return { project };
}) satisfies PageServerLoad;
