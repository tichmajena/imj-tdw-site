import { AWS_BUCKET_NAME, AWS_BUCKET_NAME2 } from '$env/static/private';
import { formatFileSize } from '$src/lib/js/utils';
import type { PageServerLoad, Actions } from './$types';
import { ResourceSchema } from '$lib/js/zod';

export const load = (async ({ fetch }) => {
	const res = await fetch('/api/resources', { method: 'GET' });
	const resources = await res.json();

	// Set featured_img: false for all resources
	// for (const resource of resources) {
	// 	await fetch(`/api/resources?id=${resource.id}`, {
	// 		method: 'PUT',
	// 		headers: { 'Content-Type': 'application/json' },
	// 		body: JSON.stringify({ featured_image: false })
	// 	});
	// 	console.log(`Updated resource ${resource.id} to set featured_image: false`);
	// }
	return { resources };
}) satisfies PageServerLoad;

export const actions: Actions = {
	create: async ({ fetch, request }) => {
		//get data from form
		let formEntries = await request.formData();
		let formData = Object.fromEntries(formEntries);
		let file = formEntries.get('file') as File;
		formData = { ...formData, type: 'url' };
		//upload files
		if (file instanceof File && file.size) {
			let arry = file.name.split('.');
			let lastIndex = arry.length - 1;
			let ext = arry[lastIndex];
			// - getting signed url for AWS_BUCKET2

			let bucket = '';
			let type = '';
			if (ext === 'jpg' || ext === 'jpeg' || ext === 'png') {
				bucket = AWS_BUCKET_NAME;
				type = 'image';
			} else {
				bucket = AWS_BUCKET_NAME2;
				type = 'file';
			}

			const res = await fetch(`/api/signing?bucket=${bucket}`, {
				body: file.name,
				method: 'POST'
			});
			const urls = await res.json();
			// - PUT file to AWS using signed url
			const res2 = await fetch(urls.put, { method: 'PUT', body: file });
			// - save media meta-data to database

			if (res2.ok === true) {
				const metaDataObject = {
					ext: ext,
					key: file.name,
					project: 'tdw',
					size: formatFileSize(file.size),
					sizeRaw: file.size,
					source: 'aws',
					status: 'published',
					type: ext
				};

				const res = await fetch('/api/media', {
					method: 'POST',
					body: JSON.stringify([metaDataObject])
				});

				formData = { ...formData, file: file.name, ext, type };
			}
		}

		//format the data
		let body = {
			title: formData.title,
			content: formData.content,
			date: formData.date,
			url: formData.url,
			category: formData.category,
			file: file?.size ? formData.file : '',
			ext: formData.ext || '',
			type: formData.type
		};
		try {
			ResourceSchema.parse(body);
		} catch (error) {
			//console.log(error);
			return { success: false };
		}
		//save resource to database
		try {
			const res = await fetch('/api/resources', { method: 'POST', body: JSON.stringify(body) });
			//console.log(res);
			if (!res.ok) throw new Error('Wauraya');

			return { success: true };
		} catch (error) {
			//console.log(error);
			return { success: false };
		}
	},

	delete: async ({ request, fetch }) => {
		const formEntries = await request.formData();
		const id = formEntries.get('id');
		//console.log(`/api/resources?id=${id}`);

		const res = await fetch(`/api/resources?id=${id}`, { method: 'DELETE' });
	},

	update: async ({ request, fetch }) => {
		//get data from form
		let formEntries = await request.formData();
		let formData = Object.fromEntries(formEntries);
		let file = formEntries.get('file');

		//upload files
		if (file instanceof File && file.size) {
			// - getting signed url for AWS_BUCKET2
			const res = await fetch(`/api/signing?bucket=${AWS_BUCKET_NAME2}`, {
				body: file.name,
				method: 'POST'
			});
			const urls = await res.json();
			// - PUT file to AWS using signed url
			const res2 = await fetch(urls.put, { method: 'PUT', body: file });
			// - save media meta-data to database

			if (res2.ok === true) {
				let arry = file.name.split('.');
				let lastIndex = arry.length - 1;
				let ext = arry[lastIndex];

				const metaDataObject = {
					ext: ext,
					key: file.name,
					project: 'tdw',
					size: formatFileSize(file.size),
					sizeRaw: file.size,
					source: 'aws',
					status: 'published',
					type: ext
				};

				const res = await fetch('/api/media', {
					method: 'POST',
					body: JSON.stringify([metaDataObject])
				});

				formData = { ...formData, file: file.name, ext };
			}
		}

		//format the data
		let body = {
			title: formData.title,
			content: formData.content,
			date: formData.date,
			url: formData.url,
			category: formData.category
		};

		//save resource to database
		try {
			const res = await fetch(`/api/resources?id=${formData.id}`, {
				method: 'PUT',
				body: JSON.stringify(body)
			});
			// console.log(res);
			if (!res.ok) throw new Error('Wauraya');

			return { success: true };
		} catch (error) {
			// console.log(error);
			return { success: false };
		}
	}
};
