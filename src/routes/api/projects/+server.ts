import { db } from '$src/lib/server/firebase-admin';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
	let zvinhu = await db.collection('projects').get();
	let projects: any[] = [];

	zvinhu.forEach(extractor);

	function extractor(chinhu: any) {
		let unzippedDoc = chinhu.data();
		let doc_id = chinhu.id;
		let project = { ...unzippedDoc, id: doc_id };
		projects.push(project);
	}

	return json(projects);
};

export const POST: RequestHandler = async ({ request }) => {
	let project = await request.json();
	await db.collection('projects').add(project);
	return json({ success: true });
};

export const PUT: RequestHandler = async ({ request, url }) => {
	let project = await request.json();
	let id = url.searchParams.get('id') as string;

	await db.collection('projects').doc(id).set(project, { merge: true });
	return json({ success: true });
};

export const DELETE: RequestHandler = async ({ url }) => {
	let id = url.searchParams.get('id') as string;

	await db.collection('projects').doc(id).delete();
	return new Response();
};
