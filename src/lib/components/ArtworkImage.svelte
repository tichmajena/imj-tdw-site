<script lang="ts">
	import IconCamera from '$icons/IconCamera.svelte';
	import IconCheck from '$icons/IconCheck.svelte';
	import IconClose from '$icons/IconClose.svelte';
	import AnimCheck from '$icons/AnimCheck.svelte';
	import { page } from '$app/state';
	//import AWSWorker from '$lib/js/aws-worker?worker';
	import { onMount } from 'svelte';
	//TODO import { galleryImages } from '$lib/stores/gallery';
	import { createEventDispatcher } from 'svelte';
	import placeholder from '$lib/assets/placeholder-3.png';

	import Gallery from './Gallery.svelte';

	import { encode } from 'blurhash';
	import { decodeBlurHash as decode } from 'fast-blurhash';
	import { dataURItoBlob, formatFileSize } from '$lib/js/utils';
	import { getUploader } from '$lib/js/Uploader.svelte';
	import { slide } from 'svelte/transition';
	import { flip } from 'svelte/animate';
	import { browser } from '$app/environment';

	let data;

	let Uploader: UploaderClass = $state();
	let uid = $props.id();

	const dispatch = createEventDispatcher();

	let {
		post = { _id: 'x' },
		confirmImage = false,
		featuredImageModel,
		featuredSaveCheck,
		center = true,
		name = 'image',
		maxWidth = 3840,
		label,
		blobs = $bindable([]),
		upload = true,
		multiple = false,
		onSelect = () => {}
	} = $props();

	let divider;
	let blobKeys = $derived(blobs.map((b) => b.name));

	let source = 'aws';

	let featuredImg = $derived(
		source && source === 'unsplash'
			? post?.featuredImg?.image[post?.featuredImg?.source].src
			: source && post?.image
				? `${page.data.cloudfront}/fit-in/1920x0/${post?.image}`
				: undefined
	);

	let files = [];

	let galleryTab = 'aws';

	let modals = {
		featured: false,
		[post._id]: { featured: false }
	};

	let loaders = {
		save: false
	};

	$inspect(featuredImg);

	let photo;
	let hiddenInput;
	let loading = false;
	let imageKey = '';
	let online = true;

	let imgBlob;
	let imgSize;
	let imgSizeRaw;
	let imgData = null;
	let imageKeys = $state([]);

	const handleOnChange = async (e, i) => {
		loaders.save = false;
		if (!multiple) {
			files = e.target.files;
			const file = e.target.files[0];
			const blob = await processImage(file);
			const { name, origin, blur_hash, width, height, size, sizeRaw } = blob;
			blobs = [{ name, origin, blur_hash, width, height, size, sizeRaw }];

			imgData = blob.img;
			photo = file.name;
			imageKey = file.name;
			imgSize = blob.size;
			imgSizeRaw = blob.sizeRaw;
			imgBlob = blob;
			Uploader.blobs = { ...Uploader.blobs, [blob.name]: blob };

			Uploader.progress = {
				...Uploader.progress,
				[blob.name]: {
					percent: 0,
					error: false,
					success: false,
					done: false,
					state: 'loaded',
					confirm: true
				}
			};

			featuredImageModel = { src: imgData, name: photo, source: 'upload' };
			modals[post._id].featured = false;
			confirmImage = true;
			Uploader.modals = false;
		} else {
			files = e.target.files;
			for (const file of e.target.files) {
				const blob = await processImage(file);
				Uploader.blobs = { ...Uploader.blobs, [blob.name]: blob };
				const { name, origin, blur_hash, width, height, size, sizeRaw } = blob;
				blobs.push({ name, origin, blur_hash, width, height, size, sizeRaw });
				Uploader.progress = {
					...Uploader.progress,
					[blob.name]: {
						percent: 0,
						error: false,
						success: false,
						done: false,
						state: 'loaded',
						confirm: true
					}
				};
			}
			confirmImage = true;
			Uploader.modals = false;
		}
	};

	export const handleUpload = () => {
		hiddenInput.click();
	};

	export async function handleCreate() {
		loaders.save = true;
		if (!multiple) {
			await workerUploader([imageKey]);
		} else {
			if (upload) {
				const blobData = $state.snapshot(Uploader.blobs[blobs[0].name]);
				await fileSubmit($state.snapshot(blobData));
				let up = blobs[0];

				if ('src' in up) {
					delete up['src'];
				}
				await onSelect(up);
			} else {
				await workerUploader(imageKeys);
				await onSelect(blobs[0]);
			}
		}
	}

	async function workerUploader(imageKeys) {
		let filesToUpload: FileUpload[] = [];

		for (const blob of blobs) {
			// 	// 	console.log(blobData);
			// let blobData = $state.snapshot(Uploader.blobs[key]);
			// console.log(blobData.name, {
			// 	type: blobData.data.type || 'application/octet-stream',
			// 	lastModified: Date.now()
			// });

			if (blob.origin === 'upload') {
				const blobData = $state.snapshot(Uploader.blobs[blob.name]);

				const file = new File([blobData.data], blobData.name || 'default.bin', {
					type: blobData.data.type || 'application/octet-stream',
					lastModified: Date.now()
				});

				const { blur_hash, width, height } = blobData;
				// const result = await fileSubmit(blob);
				// console.log({ result });

				filesToUpload.push({ file, blur_hash, width, height });
			}
			// console.log('ran');
		}
		// filesToUpload = files;
		Uploader.uploadFiles({
			type: 'upload',
			payload: {
				files: filesToUpload
			}
		});
	}

	function handleSelectFromGallery() {}

	async function uploadSelected() {
		loaders.save = true;
		await handleCreate();
		source = 'aws';
		//const image = featuredImageModel;
		const image = $state.snapshot(blobs[0]);
		onSelect({ image, source });
		loaders.save = false;
		console.log({ image });

		dispatch('saveSelected', {
			image: { ...image, img: image.name },
			source: 'aws'
		});
	}
	async function saveSelected() {
		const image = $state.snapshot(blobs[0]);
		onSelect({ image, source: 'aws' });
		dispatch('saveSelected', { image, source: 'aws' });
	}

	$inspect(blobs);

	const processImage = async (file: File): Promise<BlobData> => {
		return new Promise((resolve) => {
			let data;
			let blob: BlobData;
			const reader = new FileReader();

			reader.readAsDataURL(file);

			reader.onload = function (event) {
				const imgEl = document.createElement('img');
				imgEl.src = event.target.result;
				imgEl.onload = function (e) {
					const MAX_WIDTH = maxWidth;
					const MAX_HASH_WIDTH = 512;

					const canvas = document.createElement('canvas');
					const hashCanvas = document.createElement('canvas');

					let width;

					if (e.target.width > MAX_WIDTH) {
						width = MAX_WIDTH;
					} else {
						width = e.target.width;
					}

					const scaleSize = width / e.target.width;
					canvas.width = width;
					canvas.height = e.target.height * scaleSize;

					const hashScaleSize = MAX_HASH_WIDTH / e.target.width;
					const hashHeight = Math.floor(e.target.height * hashScaleSize);
					hashCanvas.width = MAX_HASH_WIDTH;
					hashCanvas.height = hashHeight;

					const ctx = canvas.getContext('2d');
					ctx.drawImage(e.target, 0, 0, canvas.width, canvas.height);
					data = canvas.toDataURL('image/jpeg', 50);
					//console.log(file.name, imgdata);

					// console.log(data?.width, data?.height, e.target?.width);

					const hashCtx = canvas.getContext('2d');
					hashCtx.drawImage(e.target, 0, 0);
					const hashImageData = hashCtx.getImageData(0, 0, MAX_HASH_WIDTH, hashHeight);
					const blur_hash = encode(
						hashImageData.data,
						hashImageData.width,
						hashImageData.height,
						9,
						9
					);

					divider.appendChild(canvas);

					const blobData = dataURItoBlob(data);
					blob = {
						name: file.name,
						img: data,
						data: blobData,
						width: canvas.width,
						height: canvas.height,
						blur_hash: { hash: blur_hash, w: MAX_HASH_WIDTH, h: hashHeight },
						sizeRaw: blobData.size,
						size: formatFileSize(blobData.size),
						origin: 'upload'
					};
					// alert(blob.size / 1000 + "KB");
					//					console.log(blob);
					resolve(blob);
				};
			};
		});
	};

	async function filePrepare(blobData) {
		if (!blobData) return { key: '', src: '', ok: true, blur_hash: null };
		return new Promise((resolve) => {
			const file = blobData.data;
			let result = null;
			try {
				const reader = new FileReader();
				reader.onloadend = async () => {
					result = { key: imageKey, src: '', ok: true, blur_hash: blobData.blur_hash };

					let payload = {
						key: imageKey,
						source: 'aws',
						type: 'image',
						size: imgSize,
						sizeRaw: imgSizeRaw,
						ext: imageKey.split('.')[imageKey.split('.').length - 1],
						status: 'published'
					};

					const file = new File([reader.result], blobData.name || 'default.bin', {
						type: blobData.data.type || 'application/octet-stream',
						lastModified: Date.now()
					});

					resolve(file);

					// try {
					// 	Uploader.postMessage({
					// 		type: 'upload',
					// 		payload: {
					// 			files: [file],
					// 			mediaObjects: [payload]
					// 		}
					// 	});

					// 	resolve(result);
					// } catch (err) {
					// 	console.log(err);
					// 	console.log(err?.msg);

					// 	resolve({ ok: false, error: err });
					// }
				};

				reader.readAsArrayBuffer(file);
			} catch (error) {
				console.warn(`Error in handleSubmit on / route: ${error}`);
				resolve(null);
			}
		});
	}

	async function fileSubmit(blobData: BlobData) {
		if (!blobData) return { key: '', src: '', ok: true, blur_hash: null };
		return new Promise((resolve) => {
			const file = blobData.data;
			let result = null;
			try {
				const reader = new FileReader();
				reader.onloadend = async () => {
					try {
						const res = await fetch('/api/signing', { method: 'POST', body: blobData.name });
						const url = await res.json();

						// const response = await fetch(url.put, {
						// 	method: 'PUT',
						// 	body: reader.result
						// });

						// const file = new File([reader.result], blobData.name || 'default.bin', {
						// 	type: blobData.data.type || 'application/octet-stream',
						// 	lastModified: Date.now()
						// });

						const response = await sendHttpRequest(url.put, {
							method: 'PUT',
							body: {
								file: new Blob([reader.result]),
								name: blobData.name,
								type: 'file',
								mime: blobData.data.type
							}
						});

						console.log({ response });
						//const d = await response.text();
						//console.log(d);

						if (response !== null) {
							result = {
								key: blobData.name,
								src: url.get,
								ok: true,
								blur_hash: blobData.blur_hash
							};
							//TODO await galleryImages.create({ key: imageKey, size: imgSize || '' });
							let payload: FileMetaData = {
								key: imageKey,
								name: imageKey,
								source: 'aws',
								type: 'image',
								size: imgSize,
								sizeRaw: imgSizeRaw,
								ext: imageKey.split('.')[imageKey.split('.').length - 1],
								status: 'published'
							};
							// console.log('POSTING TO GALLERY', payload);

							const res = await fetch('/api/media', {
								method: 'POST',
								body: JSON.stringify([payload])
							});

							// console.log(await res.json());

							// UPLOADS[file.name] = { key: file.name, src: url.get, size: file.blob.size };
						}

						if (Uploader.progress[blobData.name]) {
							Uploader.progress[blobData.name].success = true;
							Uploader.progress[blobData.name].done = true;
							Uploader.progress[blobData.name].state = 'uploaded';
						}

						resolve(result);
					} catch (err) {
						// console.log(err);
						// console.log(err?.msg);

						resolve({ ok: false, error: err });
					}
				};

				reader.readAsArrayBuffer(file);
			} catch (error) {
				console.warn(`Error in handleSubmit on / route: ${error}`);
				resolve(null);
			}
		});
	}

	function toggleGallery(e) {
		galleryTab = e.srcElement.id;
	}

	async function handleSelectFeatured(e) {
		loaders.save = false;
		const { source, image } = e.detail;
		if (source === 'unsplash') {
			let model = {
				source,
				src: image.urls.regular,
				alt: image.alt_description,
				name: image.photographer.name,
				profile: image.photographer.profile,
				referer: 'referer',
				urls: image.urls,
				links: image.links
			};

			featuredImageModel = model;
		} else if (source === 'envato') {
			// console.log(image, e.detail);
			const { thumbnail, medium, large, larger, name } = image;

			let model = {
				source,
				src: larger.url || large.url,
				alt: image.alt_description,
				name,
				thumbnail,
				medium,
				large,
				larger
			};

			featuredImageModel = model;
		} else if (source === 'aws') {
			let model = {
				src: `${page.data.cloudfront}/${image.key}`,
				name: image.key,
				source
			};
			featuredImageModel = model;
		}
		confirmImage = true;
		modals[post._id].featured = false;
	}

	let fm = {
		source: 'unsplash',
		image: {
			unsplash: [{}],
			envato: [{}],
			aws: [{}]
		}
	};

	async function sendHttpRequest(
		url: string,
		options: { method: string; body?: string | File } = { method: 'GET' }
	) {
		// console.log({ options });

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
				//console.log(file.name, file.type, file);

				//payload.append('file', file, file.name);
				// Listen for the progress event on the upload
				xhr.upload.addEventListener('progress', function (e) {
					if (e.lengthComputable) {
						const percent = Math.round((e.loaded / e.total) * 100);
						if (Uploader.progress[file.name]) Uploader.progress[file.name].percent = percent;
					}
				});
			}
			xhr.onload = () => {
				// console.log(xhr.status);

				if (xhr.status >= 400) {
					reject(null);
				} else {
					// console.log(xhr);

					resolve(xhr);
				}
			};
			xhr.onerror = () => {
				// console.log('Bhaiz');

				reject('Something went wrong');
			};
			// console.log(payload);

			xhr.send(payload);
		});
		return promsise;
	}

	onMount(() => {
		Uploader = getUploader('ArtworkImage', multiple);
		//console.log(Uploader);
	});

	function handleLaunchModal() {
		Uploader.currentInput = hiddenInput;
		Uploader.isCurrentMultiple = multiple;
		Uploader.activeId = uid;
		Uploader.modals = true;
	}
	//$inspect(Uploader);
	export function resetUploader() {
		Uploader.currentInput = undefined;

		files = [];
		blobs = [];
		let photo;
		confirmImage = false;
		loading = false;
		imageKey = '';

		imgBlob = undefined;
		imgSize = undefined;
		imgSizeRaw = undefined;
		imgData = null;
		imageKeys = [];
		featuredImageModel = undefined;
		loaders.save = false;
	}

	$effect(() => {
		if (uid in (Uploader?.selected || {})) {
			Uploader.selected[uid].forEach((blob) => {
				// console.log(blobs);

				if (!blobKeys.includes(blob.name)) {
					if (multiple) {
						blobs.push(blob);
					} else {
						blobs = [blob];
					}
				}
			});
		}
	});

	let blurhash = (photo) => {
		if (!browser) return;
		if (!photo.blur_hash) return;

		const { hash, w, h } = photo.blur_hash;
		const pixels = decode(hash, w, h, 1);
		// draw it on canvas

		const canvas = document.createElement('canvas');
		canvas.width = w;
		canvas.height = h;
		const ctx = canvas.getContext('2d');
		const imageData = ctx.createImageData(w, h);
		imageData.data.set(pixels);
		ctx.putImageData(imageData, 0, 0);
		//hash = document.getElementById('hash');

		return canvas.toDataURL();
	};
</script>

<div contenteditable="false" bind:this={divider} class="sr-only"></div>

<div
	contenteditable="false"
	class="group relative inset-0 mb-2 flex h-full min-h-24 w-full min-w-24 flex-col items-center overflow-auto"
>
	{#if label}
		<label class="mb-2 w-full" for={name}>{label}</label>
	{/if}
	{#if multiple}
		<div class="grid grid-cols-2 gap-2 lg:grid-cols-3">
			{#each blobs as blob, i (blob.name)}
				{@const key = blob.name}
				{@render imageLoader(key, blob, i)}
			{:else}
				<div
					class="border hidden lg:block border-dashed border-gray-500 rounded w-full h-full"
				></div>
				<div class="border border-dashed border-gray-500 rounded w-full h-full"></div>
			{/each}
			{#if upload}
				<div class:hidden={!Object.keys(Uploader?.blobs || {}).length} class="col-span-2">
					<button type="button" onclick={handleCreate} class="btn btn-primary btn-sm">Upload</button
					>
				</div>
			{/if}
			{@render inputLoader()}
		</div>
	{:else}
		{#key featuredImageModel}
			{#each blobs as blob, i (blob.name)}
				{@const key = blob.name}
				{@render imageLoader(key, blob, i)}
			{:else}
				{@render inputLoader()}
			{/each}
		{/key}
	{/if}
</div>

{#snippet imageLoader(key, blob, i)}
	<div class="relative h-full w-full shadow-lg">
		{#if Uploader?.progress[key]?.state === 'loaded'}
			<!-- Preload on success -->
			<!-- Blob -->
			{#if blob.origin === 'upload'}
				<img
					src={Uploader.blobs[key]?.img || placeholder}
					alt=""
					class="inset-0 -z-10 aspect-square h-full w-full object-cover"
				/>
			{:else}
				<img
					src="{page.data.cloudfront}/fit-in/600x0/{key}"
					alt=""
					class="inset-0 -z-10 aspect-square h-full w-full object-cover"
				/>
			{/if}
			<!-- Uploading states -->
			{#if Uploader.progress[key]?.success}
				<div
					class="absolute inset-0 z-10 flex items-center justify-center bg-white/30 text-green-500"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="1.5"
						stroke="currentColor"
						class="w-[20%]"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
						/>
					</svg>
				</div>
			{:else if Uploader?.progress[key]?.error}
				<div
					class="absolute inset-0 z-10 flex items-center justify-center bg-white/30 text-red-500"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="1.5"
						stroke="currentColor"
						class="w-[20%]"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
						/>
					</svg>
				</div>
			{:else}
				<div
					class="absolute inset-0 z-10 flex items-center justify-center bg-white/30 text-red-500"
				>
					{#if Uploader?.progress[key].percent > 0}
						<svg width="100" height="100" viewBox="0 0 50 50">
							<circle
								cx="25"
								cy="25"
								r="20"
								stroke="#3498db"
								stroke-width="4"
								fill="none"
								stroke-linecap="round"
								stroke-dasharray="125"
								stroke-dashoffset={125 - (125 * Uploader?.progress[key].percent) / 100}
							>
								<!-- <animate
								attributeName="stroke-dashoffset"
								from="125"
								to="0"
								dur="2s"
								repeatCount="indefinite"
							/> -->
							</circle>
						</svg>
					{/if}
				</div>
			{/if}
			<!-- Controls -->

			<div class="t absolute right-3 bottom-3 z-20">
				{#if upload && !multiple && blob.origin === 'upload'}
					<button
						type="button"
						class:-mt-1={loaders.save && !featuredSaveCheck}
						onclick={uploadSelected}
						class="btn btn-circle"
						>{#if featuredSaveCheck}
							<AnimCheck />
						{:else if !loaders.save}
							<IconCheck />
						{:else if loaders.save && !featuredSaveCheck}
							<span class="loading loading-spinner"></span>
						{/if}
					</button>
				{:else if upload && !multiple && blob.origin === 'gallery'}
					<button
						type="button"
						class:-mt-1={loaders.save && !featuredSaveCheck}
						onclick={saveSelected}
						class="btn btn-circle"
						>{#if featuredSaveCheck}
							<AnimCheck />
						{:else if !loaders.save}
							<IconCheck />
						{:else if loaders.save && !featuredSaveCheck}
							<span class="loading loading-spinner"></span>
						{/if}
					</button>
				{/if}
				<button
					type="button"
					onclick={() => {
						if (loaders.save || featuredSaveCheck) return;
						// console.log(blobs, key);

						blobs = blobs.filter((blob_) => blob_.name !== key);
						// console.log(blobs);

						delete Uploader.blobs[key];
						delete Uploader.progress[key];
						// console.log(blob.origin);

						if (blob.origin === 'gallery') {
							// console.log(Uploader.selected[uid]);

							Uploader.selected[uid] = Uploader.selected[uid].filter((item) => item.name !== key);
						}
					}}
					class="btn btn-circle"
				>
					<IconClose />
				</button>
			</div>
		{:else if Uploader?.progress[key]?.state === 'uploaded'}
			<!-- Image -->
			<img
				src="{page.data.cloudfront}/fit-in/600x0/{key}"
				alt=""
				class="inset-0 -z-10 aspect-square h-full w-full object-cover"
			/>
		{:else}
			{@render inputLoader(blob)}
			<!-- If success -->
		{/if}
		<!-- <img
			src={blurhash(blob)}
			alt=""
			class="inset-0 -z-10 aspect-square h-full w-full object-cover"
		/> -->
	</div>
{/snippet}

{#snippet inputLoader(blob)}
	<div class="relative h-full w-full overflow-hidden rounded shadow-lg">
		<img
			src={blob?.name || blob?.key
				? `${page.data.cloudfront}/fit-in/1920x0/${blob.name || blob.key}`
				: placeholder}
			alt=""
			class="inset-0 col-span-2 h-full w-full object-cover"
		/>
		<div
			class:items-center={center}
			class:justify-center={center}
			class:items-end={!center}
			class:justify-end={!center}
			class="absolute inset-0 z-20 flex rounded p-10"
		>
			<div class="absolute inset-0 bg-black/10"></div>
			<button
				type="button"
				onclick={handleLaunchModal}
				id="button"
				class="btn btn-circle btn-sm relative block size-24 p-6 shadow-none"
			>
				<IconCamera />
			</button>
		</div>
		<input
			onchange={(e) => handleOnChange(e)}
			bind:this={hiddenInput}
			id={uid}
			type="file"
			{name}
			multiple
			hidden
		/>
	</div>
{/snippet}
