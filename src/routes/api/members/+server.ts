import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$src/lib/server/firebase-admin';

export const GET: RequestHandler = async ({}) => {
	//
	const snapshots = await db.collection('members').orderBy('order', 'asc').get();
	let members: Team[] = [];
	snapshots.forEach((doc) => {
		const member = { ...doc.data(), id: doc.id } as Team;
		members.push(member);
	});
	// console.log(members.map((m) => m.name));

	return json(members);
};

export const POST: RequestHandler = async ({ request }) => {
	try {
		const data = await request.json();
		// console.log({ data });

		await db.collection('members').add(data);
		// console.log('zvafaya');

		return json({ success: true });
	} catch (error) {
		// console.log('Zvadhakwa', error);

		return json({ success: false });
	}
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
