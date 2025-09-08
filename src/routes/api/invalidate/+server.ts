import { invalidateCache } from '$src/lib/server/aws';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
	const body = (await request.json()) as string[];
	await invalidateCache(body);
	return new Response();
};
