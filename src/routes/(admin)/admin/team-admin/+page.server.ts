import { AWS_BUCKET_NAME } from '$env/static/private';
import { formatFileSize } from '$src/lib/js/utils';
import type { PageServerLoad, Actions } from './$types';

export const load = (async ({ fetch }) => {
	const res = await fetch('/api/members');
	const members = await res.json();
	return { members };
}) satisfies PageServerLoad;

export const actions: Actions = {
	create: async ({ request, fetch }) => {
		//get data from form
		const formEntries = await request.formData();
		const formData = Object.fromEntries(formEntries);
		const file = formEntries.get('image') as File;

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

		//format data
		let body = {
			name: formData.fullname,
			position: formData.position,
			department: formData.department,
			content: formData.bio,
			image: file?.name || ''
		};
		//post to the server
		let res = await fetch('/api/members', { method: 'POST', body: JSON.stringify(body) });
		const result = await res.json();
		return result;
	},

	deleteMember: async ({ request, fetch }) => {
		let dataEntries = await request.formData();
		let id = dataEntries.get('id');
		const res = await fetch('api/members?id=' + id, { method: 'DELETE' });
		const result = await res.json();
		return result;
	},

	update: async ({ request, fetch }) => {
		//get data from form
		let formEntries = await request.formData();
		//get the object coming with the stuff
		let formData = Object.fromEntries(formEntries);
		let file = formEntries.get('image');
		//fetch and post
		let body = {
			name: formData.fullname,
			position: formData.position,
			department: formData.department,
			content: formData.content
		} as Team;

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

			body = { ...body, image: file.name };
		}

		const res = await fetch(`/api/members?id=${formData.id}`, {
			method: 'PUT',
			body: JSON.stringify(body)
		});
		//convert image to string
	}
};
