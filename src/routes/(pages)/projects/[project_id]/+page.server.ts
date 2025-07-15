import { db, getProject } from '$src/lib/server/firebase-admin';
import type { PageServerLoad, EntryGenerator } from './$types';

export const entries: EntryGenerator = async () => {
	const zvinhu = await db
		.collection('projects')
		.where('status', '==', 'published')
		.where('category', '==', 'project')
		.get();

	let ids: { project_id: string }[] = [];

	zvinhu.forEach((p) => {
		ids.push({ project_id: p.id });
	});

	return ids;
};

export const load = (async ({ params, fetch }) => {
	const project = await getProject(params.project_id);

	return { project };
}) satisfies PageServerLoad;
