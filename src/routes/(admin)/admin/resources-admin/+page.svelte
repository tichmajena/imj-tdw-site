<script lang="ts">
	import DownloadCard from '$src/lib/cards/DownloadCard.svelte';
	import { slide } from 'svelte/transition';
	import type { PageData } from './$types';
	import Field from '$src/lib/components/Field.svelte';
	import TextArea from '$src/lib/components/TextArea.svelte';
	import Date from '$src/lib/components/Date.svelte';
	import { enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import ArtworkImage from '$src/lib/components/ArtworkImage.svelte';

	let { data, form }: { data: PageData; form: any } = $props();
	let loaders = $state({ edit: false, create: false, delete: false, trash: false });
	let status = $state({ edit: false, create: false, delete: false, trash: false });

	let currentIndex = $state(-1);
	let currentPost = $state();

	let resource = {
		title: 'Issue 1',
		content: 'Content for the thing',
		date: '09-27-99',
		url: 'https://facebook.com',
		category: 'Futur-build',
		file: '',
		ext: 'png'
	};

	let resources = $state(
		data.resources.map((item: typeof resource) => {
			let newObj = { ...item, edit: false, featuredComponent: null, featuredBlobs: [] };
			return newObj;
		})
	);
	let featuredComponent = $state();
	let featuredBlobs = $state([]);

	async function handleCreateForm({ cancel, formData, formElement }) {
		let dataEntries = formData;
		let resource = Object.fromEntries(dataEntries);

		resource.featured_image = false;

		loaders.create = true;

		if (featuredBlobs.length) {
			for (const file of featuredBlobs) {
				resource.featured_image = $state.snapshot(featuredBlobs)[0];
			}
			await featuredComponent.handleCreate();
		}

		let res = await fetch('/api/resources', { method: 'POST', body: JSON.stringify(resource) });
		console.log(res.status);
		console.log(data.url);

		await invalidateAll();
		createUpdate();
		formElement.reset();
		cancel();
		return;

		return async ({ update }) => {
			//await invalidate('/project-admin');
			await update();
			createUpdate();
		};
	}

	async function handleEditForm({ cancel, formData, formElement }) {
		loaders.edit = true;

		let body = { featured_image: false };

		if (currentPost.featuredBlobs.length) {
			for (const file of currentPost.featuredBlobs) {
				body.featured_image = $state.snapshot(currentPost.featuredBlobs)[0];
			}
			await currentPost.featuredComponent.handleCreate();
		}

		let dataEntries = formData;

		let res = await fetch(`/api/resources?id=${formData.get('id')}`, {
			method: 'PUT',
			body: JSON.stringify(body)
		});
		console.log(res.status);

		return async ({ update }) => {
			await invalidateAll();
			await update({ reset: false });
			loaders.edit = false;
		};
	}
</script>

<div
	class="container mx-auto flex flex-col space-y-12 px-5 py-20 md:flex-row md:space-y-0 md:space-x-12 lg:space-x-20"
>
	<div class="w-1/2">
		<form
			use:enhance={handleCreateForm}
			class="flex flex-col"
			action="?/create"
			enctype="multipart/form-data"
			method="POST"
		>
			<h2 class="mb-4 text-3xl">Resources</h2>

			<Field
				--label-bg-dark="#161515"
				--label-bg-light="white"
				name="title"
				label="Title"
				id="title"
				{form}
				required
			/>

			<TextArea
				--label-bg-dark="#161515"
				--label-bg-light="white"
				id="content"
				name="content"
				label="Content"
				{form}
			/>

			<Date
				--label-bg-dark="#161515"
				--label-bg-light="white"
				name="date"
				label="Date"
				id="date"
				{form}
				required
			/>

			<Field
				--label-bg-dark="#161515"
				--label-bg-light="white"
				name="url"
				label="URL"
				id="url"
				{form}
				required
			/>
			<label for="file"></label><input
				class="file-input file-input-primary mb-3 w-full rounded-none"
				name="file"
				id="file"
				type="file"
			/>
			<label for="category">Choose a category</label><select
				class="select select-primary mb-3 w-full rounded-none"
				name="category"
				id="category"
			>
				<option value="futur-build">Futur-build</option>
				<option value="corporate">Corporate</option>
				<option value="video">Video</option>
				<option value="news">News</option>
			</select>
			<div class="mb-4 aspect-square">
				<ArtworkImage
					bind:blobs={featuredBlobs}
					bind:this={featuredComponent}
					name="featured_image"
					upload={false}
					label="Featured Image"
				></ArtworkImage>
			</div>
			{#if form && form.success}
				Zvafaya
			{:else if form && !form.success}
				Zvadhakwa
			{/if}
			<button class="btn btn-primary">Submit</button>
		</form>
	</div>
	<div class="w-1/2">
		{#each resources as resource, resourseIndex}
			<div class="mb-12 w-48">
				<DownloadCard {resource}></DownloadCard>

				{#if resources[resourseIndex].edit === true}
					<form
						transition:slide
						use:enhance={handleEditForm}
						class="flex flex-col"
						action="?/update"
						enctype="multipart/form-data"
						method="POST"
					>
						<input name="id" hidden value={resource.id} type="text" />
						<h2 class="mb-4 text-3xl">Resources</h2>
						<label for="title">Title</label><input
							class="input input-primary mb-3 w-full"
							name="title"
							id="title"
							type="text"
							value={resource.title}
						/>
						<label for="content">Content</label><textarea
							class="textarea textarea-primary mb-3 w-full"
							name="content"
							id="content"
						></textarea>
						<label for="date">Date</label><input
							class="input input-primary mb-3 w-full"
							name="date"
							id="date"
							type="date"
							value={resource.date}
						/>
						<label for="url">URL</label><input
							class="input input-primary mb-3 w-full"
							name="url"
							id="url"
							type="url"
							value={resource.url}
						/>
						<label for="file"></label><input
							class="file-input file-input-primary mb-3 w-full"
							name="file"
							id="file"
							type="file"
						/>
						<label for="category">Choose a category</label><select
							class="select select-primary mb-3 w-full"
							name="category"
							id="category"
							value={resource.category}
						>
							<option value="futur-build">Futur-build</option>
							<option value="corporate">Corporate</option>
							<option value="video">Video</option>
							<option value="news">News</option>
						</select>
						<div class="mb-4 aspect-square">
							<ArtworkImage
								bind:blobs={resource.featuredBlobs}
								bind:this={resource.featuredComponent}
								name="featured_image-{resourseIndex}"
								upload={false}
								label="Featured Image"
							></ArtworkImage>
						</div>
						{#if form && form.success}
							Zvafaya
						{:else if form && !form.success}
							Zvadhakwa
						{/if}
						<button
							onclick={() => {
								currentIndex = resourseIndex;
								currentPost = resource;
							}}
							class="btn btn-primary"
						>
							{#if status.edit}Updated Successfully!{:else if loaders.edit && currentIndex === resourseIndex}
								Updating...<span class="loading loading-spinner"></span>
							{:else}
								Update
							{/if}
						</button>
					</form>
				{/if}
				<div class="mb- flex space-x-4">
					<button
						onclick={() => {
							if (resources[resourseIndex].edit === false) {
								resources[resourseIndex].edit = true;
							} else {
								resources[resourseIndex].edit = false;
							}
						}}
						class="btn btn-accent">{resources[resourseIndex].edit ? 'Cancel' : 'Edit'}</button
					>
					<form action="?/delete" method="POST">
						<input hidden type="text" name="id" value={resource.id} />
						<button class="btn btn-ghost btn-error">Delete</button>
					</form>
				</div>
			</div>
		{/each}
	</div>
</div>
