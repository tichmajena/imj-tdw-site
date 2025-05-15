<script lang="ts">
	import { enhance } from '$app/forms';
	import { invalidate } from '$app/navigation';
	import Field from '$src/lib/components/Field.svelte';
	import TextArea from '$src/lib/components/TextArea.svelte';
	import { slide } from 'svelte/transition';
	import type { PageData } from './$types';

	let { data, form }: { data: PageData; form: any } = $props();
	let loaders = $state({ edit: false, create: false, delete: false, trash: false });
	let status = $state({ edit: false, create: false, delete: false, trash: false });

	let project_sample = {
		title: 'Gtel',
		type: 'Office Building',
		year: 2015,
		description:
			'Set in a tired locale within the Harare CBD, Alford house was designed as a catalyst of transformation of the area. The Gtel HQ is testimony to the hopes and aspirations of the brand to “stand tall” in the marketplace.',
		services: ['Architecture', 'Construction Management'],
		images: [
			{
				id: 'sfhnte',
				key: 'https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp',

				title: 'house'
			}
		],
		featured_image: 'https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp',
		index: 1,
		is_featured: false
	};
	let projects = $state(data.projects.map((p: Project) => ({ ...p, edit: false })));

	let categories = ['project', 'community'];

	async function handleEditForm(e) {
		loaders.edit = true;
		return async ({ update }) => {
			await invalidate('/project-admin');
			await update();
			loaders.edit = false;
			status.edit = true;
			setTimeout(() => {
				status.edit = false;
			}, 2000);
		};
	}

	async function handleCreateForm(e) {
		loaders.create = true;
		return async ({ update }) => {
			//await invalidate('/project-admin');
			await update();
			loaders.create = false;
			status.create = true;
			setTimeout(() => {
				status.create = false;
			}, 3000);
		};
	}

	async function handleTrashForm(e) {
		loaders.trash = true;
		return async ({ update }) => {
			//await invalidate('/project-admin');
			await update();
			loaders.trash = false;
			status.trash = true;
			setTimeout(() => {
				status.trash = false;
			}, 3000);
		};
	}

	async function handleDeleteForm(e) {
		loaders.delete = true;
		return async ({ update }) => {
			//await invalidate('/project-admin');
			await update();
			loaders.delete = false;
			status.delete = true;
			setTimeout(() => {
				status.delete = false;
			}, 3000);
		};
	}
</script>

<div
	class="container mx-auto flex w-full flex-col space-y-6 space-x-0 px-5 py-10 md:flex-row md:space-y-0 md:space-x-10 lg:space-x-20"
>
	<div class="flex w-full md:w-1/2">
		<form
			enctype="multipart/form-data"
			action="?/createProject"
			class="mb-3 flex w-full flex-col"
			method="POST"
			use:enhance={handleCreateForm}
		>
			<h2 class="mb-4 text-3xl">Create Project</h2>
			<Field
				--label-bg-dark="#161515"
				--label-bg-light="white"
				name="title"
				label="Title"
				id="title"
				{form}
				required
			/>
			<Field
				--label-bg-dark="#161515"
				--label-bg-light="white"
				name="type"
				label="Project Type"
				id="type"
				{form}
				required
			/>
			<Field
				--label-bg-dark="#161515"
				--label-bg-light="white"
				name="year"
				label="Year"
				id="year"
				{form}
				required
			/>
			<TextArea
				--label-bg-dark="#161515"
				--label-bg-light="white"
				id="description"
				name="description"
				label="Description"
				{form}
			/>
			<TextArea
				--label-bg-dark="#161515"
				--label-bg-light="white"
				id="services"
				name="services"
				label="Services"
				{form}
			/>

			<label for="category">Category</label><select
				id="category"
				class="select select-primary mb-3 w-full rounded-none"
				name="category"
				required
			>
				{#each categories as category}
					<option value={category}>{category}</option>
				{/each}
			</select>

			<label for="featured_image">Featured image</label><input
				id="featured_image"
				class="file-input file-input-primary mb-3 w-full rounded-none"
				name="featured_image"
				type="file"
			/>

			<label for="images">Gallery</label><input
				id="images"
				class="file-input file-input-primary mb-3 w-full rounded-none"
				name="images"
				multiple
				type="file"
			/>
			<button class:btn-success={status.create === true} class="btn btn-primary"
				>{#if status.create}Updated Successfully!{:else if loaders.create}
					Creating...
				{:else}
					Create
				{/if}
				<span class:hidden={loaders.create === false} class="loading loading-spinner"
				></span></button
			>
		</form>
	</div>

	<div class="w-full md:w-1/2">
		{#each projects as project, i}
			{@render project_card(project, i)}
		{:else}
			No Projects found.
		{/each}
	</div>
</div>

{#snippet project_card(item: Project, i: number)}
	<div class="card bg-base-300 mb-4 shadow-sm md:w-md lg:w-lg">
		<figure>
			<img src="{data.cloudfront}/fit-in/800x600/{item.featured_image}" alt={item.title} />
		</figure>
		<div class="mt-2 flex w-full flex-wrap">
			{#each item.images as image}
				<img
					class="mr-1 mb-1 size-24 object-cover"
					src="{data.cloudfront}/fit-in/300x0/{image}?webp"
					alt=""
				/>
			{/each}
		</div>
		<div class="card-body">
			{#if !item.edit}
				<h2 class="card-title">{item.title}</h2>
				<p>
					Year: {item.year}
				</p>
				<p>
					Type: {item.type}
				</p>
				<p class="mb-2">
					{item.description}
				</p>
				SERVICES:
				<ul class="mb-4 list-disc pl-6">
					{#each item.services as service}
						<li>{service}</li>
					{/each}
				</ul>
			{:else}
				<form
					enctype="multipart/form-data"
					action="?/updateProject"
					class="mb-3 flex w-full flex-col"
					method="POST"
					use:enhance={handleEditForm}
					transition:slide
				>
					<input type="text" name="id" hidden value={item.id} />
					<input type="text" name="currentImages" hidden value={JSON.stringify(item.images)} />
					<h2 class="mb-4 text-2xl">Edit Project</h2>
					<label for="title">Project Title</label><input
						id="title"
						class="input input-primary mb-3 w-full"
						name="title"
						type="text"
						value={item.title}
						placeholder="Project Title"
						required
					/>
					<label for="type">Project Type</label><input
						id="type"
						class="input input-primary mb-3 w-full"
						name="type"
						type="text"
						value={item.type}
						required
						placeholder="Project Type"
					/>
					<label for="year">Year</label><input
						id="year"
						class="input input-primary mb-3 w-full"
						name="year"
						type="text"
						value={item.year}
						placeholder="Year"
						required
					/>
					<label for="description">Description</label><textarea
						id="description"
						class="textarea textarea-primary mb-3 w-full"
						name="description"
						value={item.description}
						placeholder="Description"
						required
					></textarea>
					<label for="services">Services</label><textarea
						id="services"
						class="textarea textarea-primary mb-3 w-full"
						name="services"
						value={item.services.join('\r\n')}
						placeholder="Services"
						required
					></textarea>

					<label for="featured_image">Featured image</label><input
						id="featured_image"
						class="file-input mb-3"
						name="featured_image"
						type="file"
					/>

					<label for="images">Gallery</label><input
						id="images"
						class="file-input mb-3"
						name="images"
						multiple
						type="file"
					/>
					<label for="replace">Replace Gallery</label><input
						id="replace"
						class="checkbox checkbox-primary mb-3"
						name="replace"
						type="checkbox"
					/>

					<button class:btn-success={status.edit === true} class="btn btn-primary"
						>{#if status.edit}Updated Successfully!{:else if loaders.edit}
							Updating...
						{:else}
							Update
						{/if}
						<span class:hidden={loaders.edit === false} class="loading loading-spinner"
						></span></button
					>
				</form>
			{/if}
			<div class="card-actions justify-end">
				<button
					class:btn-ghost={projects[i].edit}
					class:btn-primary={!projects[i].edit}
					onclick={() => (projects[i].edit = !projects[i].edit)}
					class="btn">{projects[i].edit ? 'Cancel' : 'Edit'}</button
				>
				<form action="?/deleteProject" method="POST">
					<input type="text" hidden name="id" value={item.id} />
					<button class:btn-success={status.trash === true} class="btn btn-error"
						>{#if status.trash}Trashed!{:else if loaders.trash}
							Trashing...
						{:else}
							Trash
						{/if}
						<span class:hidden={loaders.trash === false} class="loading loading-spinner"
						></span></button
					>
				</form>
			</div>
		</div>
	</div>
{/snippet}
