import { AWS_BUCKET_NAME } from '$env/static/private';
import { formatFileSize } from '$src/lib/js/utils';
import type { PageServerLoad, Actions } from './$types';

export const load = (async ({ fetch }) => {
	let res = await fetch('/api/projects?category=all');
	let projects: Project[] = await res.json();
	for (const project of projects) {
		console.log(project.services, project.title);
		if (!project.services && false) {
			const { images, featured_image, ...rest } = project;

			//put PUT to edit data in firestore
			let newServices = { services: [] };
			let res = await fetch(`/api/projects?id=${project.id}`, {
				method: 'PUT',
				body: JSON.stringify(newServices)
			});
			let edits = await res.json();
			console.log(project.title, edits);
		}
	}

	console.log('console ran');
	const res2 = await fetch('/api/media');
	const media = await res2.json();
	console.log(media[11]);

	for (const project of projects) {
		if (typeof project.featured_image === 'string') {
		}
	}

	projects = projects.sort(
		(a: Project, b: Project) => (new Date(b.createdAt) as any) - (new Date(a.createdAt) as any)
	);
	return { projects };
}) satisfies PageServerLoad;

export const actions: Actions = {
	createProject: async ({ request, fetch }) => {
		let dataEntries = await request.formData();
		let project = Object.fromEntries(dataEntries) as any as Project & { services: string };

		let featured = dataEntries.getAll('featured_image') as File[];
		let gallery = dataEntries.getAll('images') as File[];
		featured = featured.filter((file) => file?.size);
		gallery = gallery.filter((file) => file?.size);

		let body: Project = {
			title: project.title,
			type: project.type,
			year: +project.year,
			description: project.description.replaceAll('\r\n', ' '),
			services: project.services.split('\r\n'),
			images: [],
			featured_image: 'home-sample.jpg',
			index: 1,
			is_featured: false,
			status: 'published',
			category: project.category
		};

		if (!featured.length) {
			body.status = 'draft';
		}

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
		let project = Object.fromEntries(dataEntries) as { [key: string]: string };

		const featured = dataEntries.getAll('featured_image') as File[];
		const gallery = dataEntries.getAll('images') as File[];

		let body: Project = {
			title: project.title,
			type: project.type,
			year: +project.year,
			description: project.description.replaceAll('\r\n', ' '),
			services: project.services.split('\r\n'),
			index: 1,
			category: project.category,
			status: project.status as 'published',
			is_featured: false,
			images: JSON.parse(project.currentImages as string)
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
		if (project.replace) {
			body.images = [];
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

				body.images.push(file.name);
			}

			// body.images.push(file.name);
		}
		// console.log(body);

		let res = await fetch(`/api/projects?id=${project.id}`, {
			method: 'PUT',
			body: JSON.stringify(body)
		});

		return {
			success: true
		};
	},
	updateStatus: async ({ request, fetch }) => {
		let dataEntries = await request.formData();
		let project = Object.fromEntries(dataEntries) as { [key: string]: string };

		let res = await fetch(`/api/projects?id=${project.id}`, {
			method: 'PUT',
			body: JSON.stringify({ status: project.status })
		});

		return {
			success: true
		};
	},
	deleteProject: async ({ request, fetch }) => {
		let dataEntries = await request.formData();
		let id = dataEntries.get('id') as string;

		await fetch(`/api/projects?id=${id}`, { method: 'DELETE' });
		return {
			success: true
		};
	}
};
