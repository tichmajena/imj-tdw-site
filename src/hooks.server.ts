import { AWS_CLOUDFRONT } from '$env/static/private';
import type { Handle } from '@sveltejs/kit';
import admin from '$lib/server/firebase-admin';
import { ratelimit, redis } from '$lib/server/redis';
import { building } from '$app/environment';
export const handle: Handle = async ({ event, resolve }) => {
	/** @type {String|null} */
	let theme = 'light';

	// Ratelimit for crawlers and bruteforce protection
	const userAgent = event.request.headers.get('user-agent') || '';
	const ip = building ? '' : event.getClientAddress();

	// Simple bot/crawler detection (adjust as needed)
	const isCrawler = /bot|crawl|spider|slurp|bing|duckduck|baidu|yandex/i.test(userAgent);
	const ratelimitKey = isCrawler ? `ratelimit:crawler:${ip}` : `ratelimit:user:${ip}`;
	if (isCrawler) {
		// For crawlers, we can allow more requests
		console.log(`Crawler detected: ${userAgent} from IP: ${ip}`);
		const { success, remaining, reset } = await ratelimit.create.limit(ratelimitKey);

		if (!success && !building) {
			return new Response('Too Many Requests', {
				status: 429,
				headers: {
					'Retry-After': String(reset),
					'X-RateLimit-Remaining': String(remaining)
				}
			});
		}
	}

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

	// CACHE CONTROL
	// response.headers.set['Cache-Control'] = 'no-store, no-cache, must-revalidate, proxy-revalidate'
	// response.headers.set['Cache-Control'] = 'public, max-age=0, s-maxage=1'

	// SECURITY HEADERS
	// CSP directives are set elsewhere in svelte.config.js and added automatically by SvelteKit.
	// CSRF mitigation in SvelteKit is handled by header-checking and is enabled by default. More secure token-based CSRF mitigation must be added manually.
	// Token-based CSRF mitigation for the most sensitive endpoints/form actions is handled by Cloudflare Turnstile.
	const permissions =
		'payment=(self "https://js.stripe.com/"), accelerometer=(), camera=(), display-capture=(), encrypted-media=*, fullscreen=*, gyroscope=(), hid=(), interest-cohort=(), magnetometer=(), microphone=(), midi=(), picture-in-picture=*, publickey-credentials-get=(), sync-xhr=(), usb=(), xr-spatial-tracking=(), geolocation=()';

	try {
		const claims = await getSession(session);

		event.locals = { ...event.locals, ...claims };
		if (theme) {
			const response = await resolve(event, {
				transformPageChunk: ({ html }) => html.replace('%theme%', theme || 'light')
			});
			response.headers.set('X-Frame-Options', 'DENY');
			response.headers.set('X-Content-Type-Options', 'nosniff');
			response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
			// response.headers.set('Permissions-Policy', permissions);

			return response;
		}
		const response = await resolve(event);

		response.headers.set('X-Frame-Options', 'DENY');
		response.headers.set('X-Content-Type-Options', 'nosniff');
		response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
		response.headers.set('Permissions-Policy', permissions);

		return response;
	} catch (error) {
		if (theme) {
			const response = await resolve(event, {
				transformPageChunk: ({ html }) => html.replace('%theme%', theme || 'light')
			});
			response.headers.set('X-Frame-Options', 'DENY');
			response.headers.set('X-Content-Type-Options', 'nosniff');
			response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
			response.headers.set('Permissions-Policy', permissions);

			return response;
		}
		const response = await resolve(event, {
			transformPageChunk: ({ html }) => html.replace('%theme%', theme || 'light')
		});
		response.headers.set('X-Frame-Options', 'DENY');
		response.headers.set('X-Content-Type-Options', 'nosniff');
		response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
		response.headers.set('Permissions-Policy', permissions);

		return response;
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
