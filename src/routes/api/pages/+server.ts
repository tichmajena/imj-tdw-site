import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/server/firebase-admin';

export const GET: RequestHandler = async () => {
	return new Response();
};

export const PUT: RequestHandler = async ({ request, locals, url }) => {
	const session = await request.json();
	const route = url.searchParams.get('route')?.replaceAll('_-_', '/') || '';
	//console.log({ route });

	try {
		let page = { entry: JSON.stringify(session) };
		//console.log({ page___: page });

		const newPage = db.collection('pages').doc(session.id).set(page, { merge: true });
		return json({ success: true, page: newPage });
	} catch (error) {
		console.error(error);
		return json({ success: false, page: null });
	}
};
export const POST: RequestHandler = async ({ request, locals, url }) => {
	const session = await request.json();
	const route = url.searchParams.get('route')?.replaceAll('_-_', '/') || '';
	//console.log({ route });

	try {
		let page = { entry: JSON.stringify(session), status: 'published', route, project: 'tdw' };
		const newPage = db.collection('pages').add(page);
		return json({ success: true, page: newPage });
	} catch (error) {
		console.error(error);
		return json({ success: false, page: null });
	}
};
