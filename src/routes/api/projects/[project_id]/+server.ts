import { db } from '$src/lib/server/firebase-admin';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ params }) => {
	const snapshot = await db.collection('projects').doc(params.project_id).get();
	let doc = snapshot.data();

	return json({ ...doc, id: snapshot?.id });
};
