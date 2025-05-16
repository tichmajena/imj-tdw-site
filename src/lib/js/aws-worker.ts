const sendHttpRequest = (
	url: string,
	options: { method: string; body?: string | File } = { method: 'GET' }
) => {
	console.log({ options });

	const promsise = new Promise((resolve, reject) => {
		const xhr = new XMLHttpRequest();
		let payload: any = options?.body;
		xhr.open(options.method, url);
		if (options?.body && typeof options.body === 'string') {
			xhr.responseType = 'json';
			xhr.setRequestHeader('Content-Type', 'application/json');
		} else if (options?.body instanceof File) {
			payload = new FormData();
			payload.append(options?.body.name, options?.body);
			console.log(payload);
		}
		xhr.onload = () => {
			console.log(xhr.status);

			if (xhr.status >= 400) {
				reject(xhr.response);
			} else {
				console.log(xhr.response);

				resolve(xhr.response);
			}
		};
		xhr.onerror = () => {
			console.log('Bhaiz');

			reject('Something went wrong');
		};
		console.log(payload);

		xhr.send(payload);
	});
	return promsise;
};
export function formatFileSize(size: number) {
	return size > 1024
		? size > 1048576
			? Math.round(size / 1048576) + 'mb'
			: Math.round(size / 1024) + 'kb'
		: size + 'b';
}

async function uploadFile(file: File) {
	if (file instanceof File && file.size) {
		//get signed url for the image
		const res = await sendHttpRequest(`/api/signing`, {
			method: 'POST',
			body: file.name
		});
		const signedUrl = (await res) as { put: string };
		console.log(signedUrl);

		//upload image to aws using signed url
		const response = (await sendHttpRequest(signedUrl.put, { method: 'PUT', body: file })) as {
			ok: boolean;
		};
		console.log({ response });

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
			await sendHttpRequest('/api/media', {
				method: 'POST',
				body: JSON.stringify([metaDataObject])
			});
			return file.name;
		}
		return null;
	}
	return null;
}

const actions = {
	createProject: async (project: any) => {
		const featured = project.featured_image || [];
		const gallery = project.images || [];

		let body: Project = {
			title: project.title,
			type: project.type,
			year: +project.year,
			description: project.description.replaceAll('\r\n', ' '),
			services: (project.services as any as string).split('\r\n'),
			images: [],
			featured_image: 'home-sample.jpg',
			index: 1,
			is_featured: false,
			status: project.status,
			category: project.category
		};

		for (const file of featured) {
			const filename = await uploadFile(file);
			if (filename) body = { ...body, featured_image: filename };
		}

		for (const file of gallery) {
			const filename = await uploadFile(file);
			if (filename) body.images.push(filename);
		}

		let res = await sendHttpRequest('/api/projects', {
			method: 'POST',
			body: JSON.stringify(body)
		});

		return {
			success: true
		};
	},

	updateProject: async (project: any) => {
		const featured = project.featured_image || [];
		const gallery = project.images || [];

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
			const filename = await uploadFile(file);
			if (filename) body = { ...body, featured_image: filename };
		}
		if (project.replace) {
			body.images = [];
		}
		for (const file of gallery) {
			const filename = await uploadFile(file);
			if (filename) body.images.push(filename);
		}

		let res = await fetch(`/api/projects?id=${project.id}`, {
			method: 'PUT',
			body: JSON.stringify(body)
		});

		return {
			success: true
		};
	}
};

addEventListener('message', async (e) => {
	const { type, payload } = e.data;
	//console.log({ type, payload });

	if (type === 'create-project') {
		await actions.createProject(payload.data);
		postMessage({ type: 'create-project-done', payload: { form: payload.form } });
	} else if (type === 'update-project') {
		await actions.updateProject(payload.data);
		postMessage({ type: 'update-project-done', payload: { form: payload.form } });
	}
});
