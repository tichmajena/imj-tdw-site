<script lang="ts">
	import '$src/app.css';
	import '$lib/styles/spacing.css';
	import '$lib/styles/colors.css';
	import '$lib/styles/shadows.css';
	import '@fontsource/roboto/200.css';
	import '@fontsource/roboto/300.css';
	import '@fontsource/roboto/400.css';
	import '@fontsource/roboto/700.css';
	import { setUploader } from '$lib/js/Uploader.svelte';
	import { onMount, type Snippet } from 'svelte';
	import type { LayoutData } from './$types.js';
	import AWSWorker from '$lib/js/aws-worker?worker';
	import Gallery from '$lib/components/Gallery.svelte';

	let { data, children }: { data: LayoutData; children: Snippet } = $props();
	let Uploader = $state();
	let releaseModal = $state(false);

	onMount(() => {
		console.log(':::USER', data.user.exists);

		if (data.user.exists) {
			Uploader = setUploader(AWSWorker);
		}
	});
	$inspect('Uploader', Uploader);
	$inspect('RELEASE', releaseModal, Uploader?.modals);

	$effect(() => {
		releaseModal = true;
	});
</script>

{@render children()}

{#if releaseModal && Uploader?.modals}
	<input
		bind:checked={Uploader.modals}
		type="checkbox"
		id="gallaries-modal"
		class="modal-toggle z-10"
	/>
	<div class="modal">
		<div class="modal-box relative w-4/5 max-w-none">
			<label for="gallaries-modal" class="btn btn-circle btn-sm absolute top-2 right-2">✕</label>

			<Gallery
				onSelect={(e) => {
					Uploader.modals = false;
				}}
				onUpload={() => {
					Uploader.handleUpload();
					Uploader.modals = false;
				}}
			/>
		</div>
	</div>
{/if}
