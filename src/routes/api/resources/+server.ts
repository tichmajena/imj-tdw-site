import { db } from '$src/lib/server/firebase-admin';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
	let zvinhu = await db.collection('resources').orderBy('order', 'asc').get();
	let resources: any[] = [];

	zvinhu.forEach(extractor);

	function extractor(chinhu: any) {
		let unzippedDoc = chinhu.data();
		let doc_id = chinhu.id;
		let resource = { ...unzippedDoc, id: doc_id };
		resources.push(resource);
	}

	return json(resources);
};

export const POST: RequestHandler = async ({ request }) => {
	let resource = await request.json();

	await db.collection('resources').add(resource);
	return json({ success: true });
};

export const PUT: RequestHandler = async ({ request, url }) => {
	let resource = await request.json();
	let id = url.searchParams.get('id') as string;

	await db.collection('resources').doc(id).set(resource, { merge: true });
	return json({ success: true });
};

export const DELETE: RequestHandler = async ({ url }) => {
	let id = url.searchParams.get('id') as string;

	await db.collection('resources').doc(id).delete();
	return new Response();
};
