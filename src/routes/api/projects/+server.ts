import { db } from '$src/lib/server/firebase-admin';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { FieldValue } from 'firebase-admin/firestore';

export const GET: RequestHandler = async ({ url }) => {
	const cat = url.searchParams.get('category') || 'project';
	const status = url.searchParams.get('status') || 'published';
	const featured = url.searchParams.get('featured');
	const limit = url.searchParams.get('limit') || '20';

	let zvinhu: any = [];
	if (cat === 'all') {
		zvinhu = await db.collection('projects').get();
	} else if (featured) {
		zvinhu = await db
			.collection('projects')
			.where('status', '==', status)
			.where('category', '==', cat)
			.where('is_featured', '==', true)
			.limit(+6)
			.get();
	} else {
		zvinhu = await db
			.collection('projects')
			.where('status', '==', status)
			.where('category', '==', cat)
			.get();
	}
	let projects: any[] = [];

	zvinhu.forEach(extractor);

	function extractor(chinhu: any) {
		let unzippedDoc = chinhu.data();

		let doc_id = chinhu.id;
		let project = {
			...unzippedDoc,
			id: doc_id,
			createdAt: unzippedDoc.createdAt.toDate(),
			updatedAt: unzippedDoc.updatedAt.toDate()
		};
		projects.push(project);
	}

	return json(projects);
};

export const POST: RequestHandler = async ({ request }) => {
	let project = await request.json();
	await db.collection('projects').add({
		...project,
		createdAt: FieldValue.serverTimestamp(),
		updatedAt: FieldValue.serverTimestamp()
	});
	return json({ success: true });
};

export const PUT: RequestHandler = async ({ request, url }) => {
	let project = await request.json();
	let id = url.searchParams.get('id') as string;

	await db
		.collection('projects')
		.doc(id)
		.set({ ...project, updatedAt: FieldValue.serverTimestamp() }, { merge: true });
	return json({ success: true });
};

export const DELETE: RequestHandler = async ({ url }) => {
	let id = url.searchParams.get('id') as string;

	await db.collection('projects').doc(id).delete();
	return new Response();
};
