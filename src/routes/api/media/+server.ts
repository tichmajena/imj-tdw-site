import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';
import { db } from '$lib/server/firebase-admin';

export const GET: RequestHandler = async ({ url }) => {
	const page = parseInt(url.searchParams.get('page') || '1');
	const limit = parseInt(url.searchParams.get('limit') || '200');
	const source = url.searchParams.get('source');
	const type = url.searchParams.get('type');
	const ext = url.searchParams.get('ext');
	const size_lte = url.searchParams.get('size_lte');
	const size_gte = url.searchParams.get('size_gte');
	const orderby_asc = url.searchParams.get('orderby_asc');
	const orderby_desc = url.searchParams.get('orderby_desc');
	let where: any = { status: 'published', project: '' };
	let orderBy: any = { upatedAt: 'desc' };

	if (type) {
		where = { ...where, type };
	}
	if (source) {
		where = { ...where, source };
	}
	if (ext) {
		where = { ...where, ext };
	}
	if (size_lte) {
		where = { ...where, size: { lte: size_lte } };
	}
	if (size_gte) {
		where = { ...where, size: { gte: size_gte } };
	}

	if (orderby_asc) {
		orderBy = { ...orderBy, [orderby_asc]: 'asc' };
	}
	if (orderby_desc) {
		orderBy = { ...orderBy, [orderby_desc]: 'desc' };
	}
	const snapshot = await db.collection('media').get();

	let images: any[] = [];
	snapshot.forEach((doc_) => {
		images.push({ ...doc_.data(), id: doc_.id });
	});
	console.log({ images });

	return json(images);
};

export const POST: RequestHandler = async ({ request }) => {
	try {
		const data = await request.json();
		let files = data.map((file: any) => {
			return {
				...file,
				project: ''
			};
		});
		let image;
		console.log({ files });

		try {
			const batch = db.batch();

			// Loop through the documents and add them to the batch
			files.forEach((doc: any) => {
				console.log({ doc });

				const docRef = db.collection('media').doc(); // Auto-generated document ID
				batch.set(docRef, doc); // Add document data
			});

			// Commit the batch
			image = await batch.commit();
			console.log('Documents added successfully!');
		} catch (error) {
			console.error('Error adding documents:', error);
		}

		return json(image);
	} catch (error) {
		console.error(error);

		return json(null);
	}
};

export const DELETE: RequestHandler = async ({ url }) => {
	const id = url.searchParams.get('id') || '';
	await db.collection('media').doc(id).delete();
	try {
		return json({ success: true });
	} catch (error) {
		return json({ success: false });
	}
};
