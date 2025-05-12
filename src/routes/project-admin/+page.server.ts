import { AWS_BUCKET_NAME } from '$env/static/private';
import { formatFileSize } from '$src/lib/js/utils';
import { db } from '$src/lib/server/firebase-admin';
import type { PageServerLoad, Actions } from './$types';

export const load = (async ({ fetch }) => {
	let images = [];
	//
	for (let i = 0; i < 11; i++) {
		images.push('chase-dental-0' + (i + 1) + '.jpg');
	}
	// await db.collection('projects').doc('KgPO5VoDxOswT6IaRtae').set({ images }, { merge: true });
	let res = await fetch('/api/projects', { method: 'GET' });
	let projects = await res.json();
	return { projects };
}) satisfies PageServerLoad;

export const actions: Actions = {
	createProject: async ({ request, fetch }) => {
		let dataEntries = await request.formData();
		let project = Object.fromEntries(dataEntries);

		const featured = dataEntries.getAll('featured_image') as File[];
		const gallery = dataEntries.getAll('images') as File[];

		let body = {
			title: project.title,
			type: project.type,
			year: +project.year,
			description: project.description.replaceAll('\r\n', ' '),
			services: project.services.split('\r\n'),
			images: [],
			featured_image: 'home-sample.jpg',
			index: 1,
			is_featured: false
		};

		for (const file of featured) {
			if (file instanceof File && file.size) {
				//get signed url for the image
				const res = await fetch(`/api/signing?bucket=${AWS_BUCKET_NAME}`, {
					method: 'POST',
					body: file.name
				});
				const signedUrl = await res.json();
				//upload image to aws using signed url
				const response = await fetch(signedUrl.put, { method: 'PUT', body: file });

				if (response.ok) {
					//upload image meta-data to our database
					let strArry = file.name.split('.');
					let lastIndex = strArry.length - 1;
					let ext = strArry[lastIndex];

					const metaDataObject = {
						ext: ext,
						key: file.name,
						project: 'tdw',
						size: formatFileSize(file.size),
						sizeRaw: file.size,
						source: 'aws',
						status: 'published',
						type: 'image'
					};
					await fetch('/api/media', { method: 'POST', body: JSON.stringify([metaDataObject]) });
				}
				body = { ...body, featured_image: file.name };
			}
		}

		for (const file of gallery) {
			if (file instanceof File && file.size) {
				//get signed url for the image
				const res = await fetch(`/api/signing?bucket=${AWS_BUCKET_NAME}`, {
					method: 'POST',
					body: file.name
				});
				const signedUrl = await res.json();
				//upload image to aws using signed url
				const response = await fetch(signedUrl.put, { method: 'PUT', body: file });

				if (response.ok) {
					//upload image meta-data to our database
					let strArry = file.name.split('.');
					let lastIndex = strArry.length - 1;
					let ext = strArry[lastIndex];

					const metaDataObject = {
						ext: ext,
						key: file.name,
						project: 'tdw',
						size: formatFileSize(file.size),
						sizeRaw: file.size,
						source: 'aws',
						status: 'published',
						type: 'image'
					};
					await fetch('/api/media', { method: 'POST', body: JSON.stringify([metaDataObject]) });
				}
			}
			body.images.push(file.name);
		}

		let res = await fetch('/api/projects', { method: 'POST', body: JSON.stringify(body) });

		return {
			success: true
		};
	},
	updateProject: async ({ request, fetch }) => {
		let dataEntries = await request.formData();
		let project = Object.fromEntries(dataEntries);

		const featured = dataEntries.getAll('featured_image') as File[];
		const gallery = dataEntries.getAll('images') as File[];

		let body = {
			title: project.title,
			type: project.type,
			year: +project.year,
			description: project.description.replaceAll('\r\n', ' '),
			services: project.services.split('\r\n'),
			index: 1,
			is_featured: false
		};

		for (const file of featured) {
			if (file instanceof File && file.size) {
				//get signed url for the image
				const res = await fetch(`/api/signing?bucket=${AWS_BUCKET_NAME}`, {
					method: 'POST',
					body: file.name
				});
				const signedUrl = await res.json();
				//upload image to aws using signed url
				const response = await fetch(signedUrl.put, { method: 'PUT', body: file });

				if (response.ok) {
					//upload image meta-data to our database
					let strArry = file.name.split('.');
					let lastIndex = strArry.length - 1;
					let ext = strArry[lastIndex];

					const metaDataObject = {
						ext: ext,
						key: file.name,
						project: 'tdw',
						size: formatFileSize(file.size),
						sizeRaw: file.size,
						source: 'aws',
						status: 'published',
						type: 'image'
					};
					await fetch('/api/media', { method: 'POST', body: JSON.stringify([metaDataObject]) });
				}
				body = { ...body, featured_image: file.name };
			}
		}

		for (const file of gallery) {
			if (file instanceof File && file.size) {
				//get signed url for the image
				const res = await fetch(`/api/signing?bucket=${AWS_BUCKET_NAME}`, {
					method: 'POST',
					body: file.name
				});
				const signedUrl = await res.json();
				//upload image to aws using signed url
				const response = await fetch(signedUrl.put, { method: 'PUT', body: file });

				if (response.ok) {
					//upload image meta-data to our database
					let strArry = file.name.split('.');
					let lastIndex = strArry.length - 1;
					let ext = strArry[lastIndex];

					const metaDataObject = {
						ext: ext,
						key: file.name,
						project: 'tdw',
						size: formatFileSize(file.size),
						sizeRaw: file.size,
						source: 'aws',
						status: 'published',
						type: 'image'
					};
					await fetch('/api/media', { method: 'POST', body: JSON.stringify([metaDataObject]) });
				}
			}
			// body.images.push(file.name);
		}

		let res = await fetch(`/api/projects?id=${project.id}`, {
			method: 'PUT',
			body: JSON.stringify(body)
		});

		return {
			success: true
		};
	},
	deleteProject: async ({ request, fetch }) => {
		let dataEntries = await request.formData();
		let id = dataEntries.get('id') as string;

		await fetch(`api/projects?id=${id}`, { method: 'DELETE' });
		return {
			success: true
		};
	}
};
