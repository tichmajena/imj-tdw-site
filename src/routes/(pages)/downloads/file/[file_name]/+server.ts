import { AWS_BUCKET_NAME2 } from '$env/static/private';
import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { read } from '$app/server';

export const GET: RequestHandler = async ({ params, fetch, setHeaders }) => {
	let res = await fetch(`/api/signing?bucket=${AWS_BUCKET_NAME2}`, {
		method: 'POST',
		body: params.file_name
	});
	const urls = await res.json();
	const res2 = await fetch(urls.get);
	const pdfData = await res2.blob();

	redirect(302, urls.get);

	setHeaders({
		'Content-Type': 'application/json',
		'Content-Length': pdfData.size.toString(),
		'Last-Modified': new Date().toUTCString(),
		'Cache-Control': 'public, max-age=30'
	});

	return new Response(pdfData);
};
