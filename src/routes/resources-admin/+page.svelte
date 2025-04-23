<script lang="ts">
	import DownloadCard from '$src/lib/cards/DownloadCard.svelte';
	import { slide } from 'svelte/transition';
	import type { PageData } from './$types';

	let { data, form }: { data: PageData; form: any } = $props();

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
			let newObj = { ...item, edit: false };
			return newObj;
		})
	);
	console.log($state.snapshot(resources));
</script>

<div
	class="container mx-auto flex flex-col space-y-12 py-20 md:flex-row md:space-y-0 md:space-x-12 lg:space-x-20"
>
	<div class="w-1/2">
		<form class="flex flex-col" action="?/create" enctype="multipart/form-data" method="POST">
			<h2 class="mb-4 text-3xl">Resources</h2>
			<label for="title">Title</label><input
				class="input input-primary mb-3 w-full"
				name="title"
				id="title"
				type="text"
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
			/>
			<label for="url">URL</label><input
				class="input input-primary mb-3 w-full"
				name="url"
				id="url"
				type="url"
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
			>
				<option value="futur">Futur</option>
				<option value="coporate">Coporate</option>
				<option value="video">Video</option>
				<option value="news">News</option>
			</select>
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
							<option value="futur">Futur</option>
							<option value="coporate">Coporate</option>
							<option value="video">Video</option>
							<option value="news">News</option>
						</select>
						{#if form && form.success}
							Zvafaya
						{:else if form && !form.success}
							Zvadhakwa
						{/if}
						<button class="btn btn-primary">Submit</button>
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
