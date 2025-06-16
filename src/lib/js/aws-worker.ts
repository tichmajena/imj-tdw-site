async function sendHttpRequest(
	url: string,
	options: { method: string; body?: string | File } = { method: 'GET' }
) {
	const promsise = new Promise((resolve, reject) => {
		const xhr = new XMLHttpRequest();
		let payload: any = options?.body;
		xhr.open(options.method, url);
		if (options?.body && typeof options.body === 'string') {
			xhr.responseType = 'json';
			xhr.setRequestHeader('Content-Type', 'application/json');
		} else if (options?.body instanceof File) {
			const file = options.body;
			payload = file;
			xhr.setRequestHeader('Content-Type', file.type);
			//payload = new FormData();

			//payload.append('file', file, file.name);
			// Listen for the progress event on the upload
			xhr.upload.addEventListener('progress', function (e) {
				if (e.lengthComputable) {
					const percent = Math.round((e.loaded / e.total) * 100);
					postMessage({
						type: 'upload-progress',
						payload: { percent, loaded: e.loaded, total: e.total, name: file.name }
					});
				}
			});
		}
		xhr.onload = () => {
			if (xhr.status >= 400) {
				reject(null);
			} else {
				console.log(xhr.response);

				resolve(xhr.response);
			}
		};
		xhr.onerror = () => {
			console.log('Bhaiz');

			reject('Something went wrong');
		};

		xhr.send(payload);
	});
	return promsise;
}

export function formatFileSize(size: number) {
	return size > 1024
		? size > 1048576
			? Math.round(size / 1048576) + 'mb'
			: Math.round(size / 1024) + 'kb'
		: size + 'b';
}

async function uploadFile(blobData: any) {
	const { file, blur_hash, width, height } = blobData;

	if (file instanceof File && file.size) {
		//get signed url for the image
		const res = await sendHttpRequest(`/api/signing`, {
			method: 'POST',
			body: file?.name
		});
		const signedUrl = (await res) as { put: string };

		//upload image to aws using signed url
		const response = (await sendHttpRequest(signedUrl.put, { method: 'PUT', body: file })) as {
			ok: boolean;
		};
		console.log({ response });

		if (response !== null) {
			//upload image meta-data to our database
			let strArry = file.name.split('.');
			let lastIndex = strArry.length - 1;
			let ext = strArry[lastIndex];

			const metaDataObject = {
				ext: ext,
				key: file.name,
				project: 'picturehub',
				size: formatFileSize(file.size),
				sizeRaw: file.size,
				source: 'aws',
				status: 'published',
				type: 'image',
				blur_hash,
				width,
				height
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

addEventListener('message', async (e) => {
	const { type, payload } = e.data;
	if (type === 'upload') {
		const files = payload.files;
		let index = 0;
		let total = payload.files.length;
		for (const file of files) {
			const result = await uploadFile(file);
			index++;
			if (result)
				postMessage({ type: 'image-done', payload: { index, total, result, name: file.name } });
			else postMessage({ type: 'image-error', payload: { index, total, result, name: file.name } });
		}
		postMessage({
			type: 'upload-done',
			payload: {
				files: files.map((f: FileUpload) => f.file.name)
			}
		});
	}
});
