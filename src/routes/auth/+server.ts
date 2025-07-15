import admin from '$lib/server/firebase-admin';
import { dev } from '$app/environment';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

const secure = dev ? '' : 'Secure';
const expiresIn = 1000 * 60 * 60 * 24 * 7;

export const POST: RequestHandler = async ({ request, cookies }) => {
	const { idToken } = await request.json();
	try {
		const sessionCookie = await admin.auth().createSessionCookie(idToken, { expiresIn });

		cookies.set('session', sessionCookie, { path: '/', httpOnly: true, secure: true });
		return json({
			status: 200
		});
	} catch (error) {
		// console.log(error);

		return json({
			status: 500
		});
	}
};

export const DELETE: RequestHandler = async ({ cookies }) => {
	// console.log({ cookies });

	cookies.delete('session', { path: '/' });

	return json({ status: 200 });
};
