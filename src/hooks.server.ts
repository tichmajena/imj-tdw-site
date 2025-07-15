import { AWS_CLOUDFRONT } from '$env/static/private';
import type { Handle } from '@sveltejs/kit';
import admin from '$lib/server/firebase-admin';

export const handle: Handle = async ({ event, resolve }) => {
	/** @type {String|null} */
	let theme = 'light';

	const newTheme = null;
	//const newTheme = event.url.searchParams.get('theme');
	const cookieTheme = event.cookies.get('colortheme');
	const session = event.cookies.get('session') as string;

	if (newTheme) {
		theme = newTheme;
	} else if (cookieTheme) {
		theme = cookieTheme;
	}

	event.locals.theme = theme;
	event.locals.cloudfront = AWS_CLOUDFRONT;

	try {
		const claims = await getSession(session);

		event.locals = { ...event.locals, ...claims };
		if (theme) {
			return await resolve(event, {
				transformPageChunk: ({ html }) => html.replace('%theme%', theme || 'light')
			});
		}
		return await resolve(event);
	} catch (error) {
		if (theme) {
			return await resolve(event, {
				transformPageChunk: ({ html }) => html.replace('%theme%', theme || 'light')
			});
		}
		return await resolve(event);
	}
};

const getSession = async (session: string) => {
	try {
		const claims = await admin.auth().verifySessionCookie(session);

		return {
			user: {
				exists: true,
				...claims
			}
		};
	} catch {
		return {
			user: {
				exists: false
			}
		};
	}
};
