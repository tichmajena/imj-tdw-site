<script lang="ts">
	import { page } from '$app/stores';
	//TODO import { galleryImages } from '$lib/stores/gallery';
	import { createEventDispatcher, onMount } from 'svelte';
	import { getUploader } from '$lib/js/Uploader.svelte';
	const dispatch = createEventDispatcher();
	let items = async function getGallery() {
		const res = await fetch('/api/media');
		const media = await res.json();
		return media;
	};
	let { onSelect = () => {} } = $props();
	let Uploader: UploaderClass = $state();
	let selectedItems = $state([]);
	let selectedKeys = $derived(selectedItems.map((item) => item.name || item.key));

	onMount(() => {
		Uploader = getUploader('Gallery');
	});
</script>

<button
	onclick={() => {
		console.log(Uploader);
		Uploader.launchFilePicker();
	}}
	class="my-6 flex w-full items-center justify-center rounded-lg border-2 border-dashed border-blue-600 py-4 text-2xl text-blue-600"
>
	Upload
</button>
{#await items()}
	:::LOADING
{:then items_}
	<div class:hidden={!selectedItems.length} class="flex justify-end space-x-2 py-2">
		<button
			onclick={() => {
				selectedItems = [];
			}}
			class="btn btn-primary">Deselect all</button
		>
		<button
			onclick={() => {
				selectedItems.forEach((image) => {
					Uploader.selectFiles(image);
				});
				Uploader.modals = false;
			}}
			class="btn btn-primary">Add Selected</button
		>
	</div>
	<div class="lg:colums-4 w-full columns-2 gap-3 space-y-3 sm:columns-3 md:columns-6">
		{#each items_ as image}
			<div
				role="button"
				class:border-primary={selectedKeys.includes(image.key)}
				class:border-2={selectedKeys.includes(image.key)}
				class:p-2={selectedKeys.includes(image.key)}
				tabindex="-1"
				onkeydown={() => {}}
				onclick={() => {
					//dispatch('select', { source: 'aws', image });
					if (Uploader.isCurrentMultiple) {
						if (selectedKeys.includes(image.key)) {
							selectedItems = selectedItems.filter((item) => item.key !== image.key);
						} else {
							selectedItems.push(image);
							// console.log(Uploader.activeId);
						}
					} else {
						Uploader.selectFiles(image);
						Uploader.modals = false;
						console.log(Uploader);
					}

					//Uploader.selectFiles(image);
				}}
			>
				<img src={$page.data.cloudfront + '/fit-in/300x0/' + image.key} alt="" />
			</div>
		{:else}
			No images found {items.length}
		{/each}
	</div>
{/await}
