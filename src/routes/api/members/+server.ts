import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$src/lib/server/firebase-admin';

export const GET: RequestHandler = async ({}) => {
	const snapshots = await db.collection('members').get();
	let members: Team[] = [];
	snapshots.forEach((doc) => {
		const member = { ...doc.data(), id: doc.id } as team;
		members.push(member);
	});
	return json(members);
};
export const POST: RequestHandler = async ({ request }) => {
	const data = await request.json();
	await db.collection('members').add(data);
	return json({ success: true });
};

export const DELETE: RequestHandler = async ({ url }) => {
	let id = url.searchParams.get('id') as string;

	await db.collection('members').doc(id).delete();
	return json({ success: true });
};

export const PUT: RequestHandler = async ({ request, url }) => {
	let id = url.searchParams.get('id') as string;
	const body = await request.json();
	await db.collection('members').doc(id).set(body, { merge: true });
	return json({ success: true });
};
