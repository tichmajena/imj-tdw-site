<script lang="ts">
	import { enhance } from '$app/forms';
	import { invalidate, invalidateAll } from '$app/navigation';
	import Field from '$src/lib/components/Field.svelte';
	import TextArea from '$src/lib/components/TextArea.svelte';
	import { fly, scale, slide } from 'svelte/transition';
	import type { PageData } from './$types';
	import { flip } from 'svelte/animate';
	import empty_state from '$icons/empty-state-data-not-found-illustration_46952344.svg';
	import AWSWorker from '$lib/js/aws-worker?worker';
	import { onMount } from 'svelte';
	import { ProjectSchema } from '$src/lib/js/zod';
	import { zodValidationErrors } from '$src/lib/js/utils';
	import ArtworkImage from '$src/lib/components/ArtworkImage.svelte';

	let Uploader: UploaderClass = $state();

	let { data, form }: { data: PageData; form: any } = $props();
	let loaders = $state({ edit: false, create: false, delete: false, trash: false });
	let status = $state({ edit: false, create: false, delete: false, trash: false });
	let tabview = $state('published');
	let createForm;
	let editForm = null;

	let featuredComponent = $state();
	let featuredBlobs = $state([]);
	let galleryComponent = $state();
	let galleryBlobs = $state([]);

	let currentIndex = $state(-1);
	let currentPost = $state();

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

	let projects = $state(groupByStatus(data.projects));
	$inspect(projects.draft);

	let categories = ['project', 'community'];
	let statuses = ['published', 'draft', 'trashed'];

	onMount(() => {
		Uploader = new AWSWorker();

		// listen for messages
		Uploader.addEventListener('message', (e) => {
			const { type, payload } = e.data;
			console.log(type, payload);

			if (type === 'create-project-done') {
				invalidateAll().then((e) => {
					document.getElementById(payload.form)?.reset();
					createUpdate();
				});
			} else if (type === 'update-project-done') {
				invalidateAll().then((e) => {
					document.getElementById(payload.form)?.reset();
					editUpdate();
				});
			}
		});
	});

	async function handleEditForm({ cancel, formData, formElement }) {
		editForm = null;
		let dataEntries = formData;
		let project = Object.fromEntries(dataEntries) as any as Project & { services: string };

		let featured = dataEntries.getAll('featured_image') as File[];
		let gallery = dataEntries.getAll('images') as File[];

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

		if (project.replace) {
			body.images = [];
		}

		try {
			ProjectSchema.parse(body);
		} catch (error) {
			console.error(error);

			const messages: any = zodValidationErrors(error);
			const fields = project;
			projects[tabview][currentIndex].form = { messages, fields, success: false };
			cancel({ reset: false });
			return;
		}

		body.services = project.services.split('\r\n');

		console.log('featured', $state.snapshot(currentPost.featuredBlobs));

		loaders.edit = true;

		if (currentPost.featuredBlobs.length) {
			for (const file of currentPost.featuredBlobs) {
				body.featured_image = $state.snapshot(currentPost.featuredBlobs)[0];
			}
			await currentPost.featuredComponent.handleCreate();
		}

		if (currentPost.galleryBlobs.length) {
			body.images = [...body.images, ...$state.snapshot(currentPost.galleryBlobs)];
			await currentPost.galleryComponent.handleCreate();
		}

		let res = await fetch(`/api/projects?id=${project.id}`, {
			method: 'PUT',
			body: JSON.stringify(body)
		});

		console.log(res.status);
		console.log(data.url);

		await invalidateAll();
		editUpdate();
		cancel();
		return;

		return async ({ update }) => {
			await invalidate('/project-admin');
			await update({ reset: false });
			editUpdate();
		};
	}

	async function handleStatusForm({ cancel, formData, formElement }) {
		loaders.edit = true;
		return async ({ update }) => {
			await invalidate('/project-admin');
			await update({ reset: false });
			editUpdate();
		};
	}
	function editUpdate() {
		loaders.edit = false;
		status.edit = true;
		projects = groupByStatus(data.projects);
		setTimeout(() => {
			status.edit = false;
			currentPost.featuredComponent.resetUploader();
			currentPost.galleryComponent.resetUploader();
		}, 3000);
	}
	async function handleCreateForm({ cancel, formData, formElement }) {
		let dataEntries = formData;
		let project = Object.fromEntries(dataEntries) as any as Project & { services: string };

		let featured = dataEntries.getAll('featured_image') as File[];
		let gallery = dataEntries.getAll('images') as File[];
		featured = featured.filter((file) => file?.size);
		gallery = gallery.filter((file) => file?.size);

		project.featured_image = { name: 'home-sample.jpg' };
		project.images = [];
		project = { ...project, year: +project.year, services: project.services.split('\r\n') };

		try {
			ProjectSchema.parse(project);
		} catch (error) {
			const messages: any = zodValidationErrors(error);
			const fields = project;
			form = { ...form, messages, fields, success: false };
			cancel({ reset: false });
			return;
		}
		loaders.create = true;

		if (featuredBlobs.length) {
			for (const file of featuredBlobs) {
				project.featured_image = $state.snapshot(featuredBlobs)[0];
			}
			await featuredComponent.handleCreate();
		}
		if (galleryBlobs.length) {
			project.images = $state.snapshot(galleryBlobs);
			await galleryComponent.handleCreate();
		}
		console.log(project, gallery, featured);
		let res = await fetch('/api/projects', { method: 'POST', body: JSON.stringify(project) });
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

	function createUpdate() {
		loaders.create = false;
		status.create = true;
		projects = groupByStatus(data.projects);
		setTimeout(() => {
			status.create = false;
			featuredComponent.resetUploader();
			galleryComponent.resetUploader();
		}, 3000);
	}

	async function handleTrashForm(e) {
		loaders.trash = true;
		return async ({ update }) => {
			//await invalidate('/project-admin');
			status.trash = true;
			await update();
			status.trash = false;
			loaders.trash = false;
			projects = data.projects
				.map((p: Project) => ({ ...p, edit: false }))
				.reduce(
					(r, p) => {
						r[p.status].push(p);
						return r;
					},
					{ published: [], trashed: [], draft: [] }
				);
			// setTimeout(() => {
			// 	status.trash = false;
			// }, 3000);
		};
	}

	async function handleDeleteForm(e) {
		loaders.delete = true;
		return async ({ update }) => {
			//await invalidate('/project-admin');
			loaders.delete = false;
			status.delete = true;
			await update();
			setTimeout(() => {
				status.delete = false;
				projects = data.projects
					.map((p: Project) => ({ ...p, edit: false }))
					.reduce(
						(r, p) => {
							r[p.status].push(p);
							return r;
						},
						{ published: [], trashed: [], draft: [] }
					);
			}, 1000);
		};
	}

	function handleTabs(e) {
		tabview = e.target.id;
	}

	function groupByStatus(projects) {
		return projects
			.map((p: Project) => ({
				...p,
				edit: false,
				galleryComponent: null,
				featuredComponent: null,
				featuredBlobs: [],
				galleryBlobs: [],
				form: null
			}))
			.reduce(
				(r, p) => {
					r[p.status].push(p);
					return r;
				},
				{ published: [], trashed: [], draft: [] }
			);
	}
</script>

<div
	class="container mx-auto flex w-full flex-col space-y-6 space-x-0 px-5 py-10 md:flex-row md:space-y-0 md:space-x-10 lg:space-x-20"
>
	<div class="flex w-full md:w-1/2">
		{#key form}
			<form
				enctype="multipart/form-data"
				action="?/createProject"
				class="mb-3 flex w-full flex-col"
				method="POST"
				id="createForm"
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
					value={form?.fields?.['title'] || ''}
				/>
				<Field
					--label-bg-dark="#161515"
					--label-bg-light="white"
					name="type"
					label="Project Type"
					id="type"
					{form}
					required
					value={form?.fields?.['type'] || ''}
				/>
				<Field
					--label-bg-dark="#161515"
					--label-bg-light="white"
					name="year"
					label="Year"
					id="year"
					{form}
					required
					value={form?.fields?.['year'] || ''}
				/>
				<TextArea
					--label-bg-dark="#161515"
					--label-bg-light="white"
					id="description"
					name="description"
					label="Description"
					{form}
					value={form?.fields?.['description'] || ''}
				/>
				<TextArea
					--label-bg-dark="#161515"
					--label-bg-light="white"
					id="services"
					name="services"
					label="Services"
					{form}
					value={form?.fields?.['services'] || ''}
				/>

				<label for="category">Category</label><select
					id="category"
					class="select select-primary mb-3 w-full rounded-none"
					name="category"
					required
					value={form?.fields?.['category'] || 'project'}
				>
					{#each categories as category}
						<option value={category}>{category}</option>
					{/each}
				</select>
				<label for="status">Status</label><select
					id="status"
					class="select select-primary mb-3 w-full rounded-none"
					name="status"
					required
					value={form?.fields?.['status'] || 'published'}
				>
					{#each statuses as status_}
						<option value={status_}>{status_}</option>
					{/each}
				</select>

				<div class="aspect-video">
					<ArtworkImage
						bind:blobs={featuredBlobs}
						bind:this={featuredComponent}
						name="featured_image"
						upload={false}
						label="Featured Image"
					></ArtworkImage>
				</div>
				<div class="block aspect-video">
					<ArtworkImage
						bind:blobs={galleryBlobs}
						bind:this={galleryComponent}
						multiple
						name="images"
						upload={false}
						label="Gallery"
					></ArtworkImage>
				</div>
				<button class:btn-success={status.create === true} class="btn btn-primary"
					>{#if status.create}Created Successfully!{:else if loaders.create}
						Creating...
					{:else}
						Create
					{/if}
					<span class:hidden={loaders.create === false} class="loading loading-spinner"
					></span></button
				>
			</form>
		{/key}
	</div>

	<div class="w-full md:w-1/2">
		<div class="flex w-full justify-end">
			<div role="tablist" class="tabs tabs-border mb-2">
				<a
					class:tab-active={tabview === 'published'}
					onclick={handleTabs}
					onkeydown={handleTabs}
					tabindex="-1"
					role="tab"
					id="published"
					class="tab">Published</a
				>
				<a
					class:tab-active={tabview === 'draft'}
					onclick={handleTabs}
					onkeydown={handleTabs}
					tabindex="-1"
					role="tab"
					id="draft"
					class="tab">Drafts</a
				>
				<a
					class:tab-active={tabview === 'trashed'}
					onclick={handleTabs}
					onkeydown={handleTabs}
					tabindex="-1"
					role="tab"
					id="trashed"
					class="tab">Trash</a
				>
			</div>
		</div>
		{#if tabview === 'published'}
			<div in:fly={{ x: -100, y: 0, delay: 300 }} out:fly={{ duration: 200, y: 200, x: 200 }}>
				{#each projects.published as project, i (project.id)}
					<div animate:flip={{ duration: 300 }}>
						{@render project_card(project, i)}
					</div>
				{:else}
					{@render data_not_found('projects')}
				{/each}
			</div>
		{:else if tabview === 'draft'}
			<div in:fly={{ x: -100, y: 0, delay: 300 }} out:fly={{ duration: 200, y: 200, x: 200 }}>
				{#each projects.draft as project, i (project.id)}
					<div animate:flip={{ duration: 300 }}>
						{@render project_card(project, i)}
					</div>
				{:else}
					{@render data_not_found('projects')}
				{/each}
			</div>
		{:else if tabview === 'trashed'}
			<div in:fly={{ x: -100, y: 0, delay: 300 }} out:fly={{ duration: 200, y: 200, x: 200 }}>
				{#each projects.trashed as project, i (project.id)}
					<div animate:flip={{ duration: 300 }}>
						{@render project_card(project, i)}
					</div>
				{:else}
					{@render data_not_found('projects')}
				{/each}
			</div>
		{/if}
	</div>
</div>

{#snippet data_not_found(postType)}
	<div class="flex w-full flex-col items-center">
		<div class="mb-4 text-center">No {postType} found.</div>
		<img width="200" height="auto" src={empty_state} alt="" />
	</div>
{/snippet}

{#snippet project_card(item: Project, i: number)}
	<div transition:scale class="card bg-base-300 mb-4 shadow-sm md:w-md lg:w-lg">
		<figure>
			<img src="{data.cloudfront}/fit-in/800x600/{item.featured_image.name}" alt={item.title} />
		</figure>
		<div class="mt-2 flex w-full flex-wrap">
			{#each item.images as image}
				<img
					class="mr-1 mb-1 size-24 object-cover"
					src="{data.cloudfront}/fit-in/300x0/{image.name}?webp"
					alt=""
				/>
			{/each}
		</div>
		<div class="card-body">
			{#if !projects[item.status][i].edit}
				<div in:slide={{ delay: 200 }} out:slide={{ duration: 190 }}>
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
				</div>
			{:else}
				<form
					enctype="multipart/form-data"
					action="?/updateProject"
					class="mb-3 flex w-full flex-col"
					method="POST"
					id="edit-form-{i + 1}"
					use:enhance={handleEditForm}
					in:slide={{ delay: 200 }}
					out:slide={{ duration: 190 }}
				>
					<input type="text" name="id" hidden value={item.id} />
					<input type="text" name="currentImages" hidden value={JSON.stringify(item.images)} />
					<h2 class="mb-4 text-2xl">Edit Project</h2>
					<Field
						--label-bg-dark="var(--color-base-300)"
						--label-bg-light="var(--color-base-300)"
						name="title"
						label="Title"
						id="title"
						value={item.title}
						{form}
						required
					/>
					<Field
						--label-bg-dark="var(--color-base-300)"
						--label-bg-light="var(--color-base-300)"
						name="type"
						label="Project Type"
						value={item.type}
						id="type"
						{form}
						required
					/>
					<Field
						--label-bg-dark="var(--color-base-300)"
						--label-bg-light="var(--color-base-300)"
						name="year"
						label="Year"
						value={item.year}
						id="year"
						{form}
						required
					/>
					<TextArea
						--label-bg-dark="var(--color-base-300)"
						--label-bg-light="var(--color-base-300)"
						id="description"
						value={item.description}
						name="description"
						label="Description"
						{form}
					/>
					<TextArea
						--label-bg-dark="var(--color-base-300)"
						--label-bg-light="var(--color-base-300)"
						id="services"
						name="services"
						label="Services"
						value={item?.services?.join('\r\n')}
						{form}
					/>

					<label for="category">Category</label><select
						id="category"
						class="select select-primary mb-3 w-full rounded-none"
						name="category"
						value={item.category}
						required
					>
						{#each categories as category}
							<option value={category}>{category}</option>
						{/each}
					</select>
					<label for="status">Status</label><select
						id="status"
						value={item.status}
						class="select select-primary mb-3 w-full rounded-none"
						name="status"
						required
					>
						{#each statuses as status_}
							<option value={status_}>{status_}</option>
						{/each}
					</select>

					<div class="aspect-video">
						<ArtworkImage
							bind:blobs={item.featuredBlobs}
							bind:this={item.featuredComponent}
							name="featured_image-{i}"
							upload={false}
							label="Featured Image"
						></ArtworkImage>
					</div>
					<div class="block aspect-[24/9]">
						<ArtworkImage
							bind:blobs={item.galleryBlobs}
							bind:this={item.galleryComponent}
							multiple
							name="images-{i}"
							upload={false}
							label="Gallery"
						></ArtworkImage>
					</div>
					<label for="replace">Replace Gallery</label><input
						id="replace"
						class="checkbox checkbox-primary mb-3"
						name="replace"
						type="checkbox"
					/>

					<button
						onclick={() => {
							currentIndex = i;
							currentPost = item;
						}}
						class:btn-success={status.edit === true && currentIndex === i}
						class="btn btn-primary"
						>{#if status.edit}Updated Successfully!{:else if loaders.edit && currentIndex === i}
							Updating...<span class="loading loading-spinner"></span>
						{:else}
							Update
						{/if}
					</button>
				</form>
			{/if}
			<div class="card-actions justify-end">
				{#if item.status === 'published' || item.status === 'draft'}
					<button
						class:btn-ghost={projects[item.status][i].edit}
						class:btn-primary={!projects[item.status][i].edit}
						onclick={() => {
							projects[item.status][i].edit = !projects[item.status][i].edit;
							console.log(projects[item.status][i].edit);
						}}
						class="btn">{projects[item.status][i].edit ? 'Cancel' : 'Edit'}</button
					>
					{#if item.status === 'draft'}
						<form action="?/updateStatus" method="POST" use:enhance={handleStatusForm}>
							<input type="text" hidden name="id" value={item.id} />
							<input type="text" hidden name="status" value="published" />
							<button
								class:btn-success={status.edit === true && currentIndex === i}
								class="btn btn-info"
								>{#if status.edit}Published Successfully!{:else if loaders.edit && currentIndex === i}
									Publish...<span class="loading loading-spinner"></span>
								{:else}
									Publish
								{/if}
							</button>
						</form>
					{/if}
					<form action="?/updateStatus" method="POST" use:enhance={handleTrashForm}>
						<input type="text" hidden name="id" value={item.id} />
						<input type="text" hidden name="status" value="trashed" />
						<button
							class:btn-success={status.trash === true && currentIndex === i}
							class="btn btn-error"
							>{#if status.trash}Trashed!{:else if loaders.trash === true && currentIndex === i}
								Trashing...<span class="loading loading-spinner"></span>
							{:else}
								Trash
							{/if}
						</button>
					</form>
				{:else if item.status === 'trashed'}
					<form action="?/updateStatus" method="POST" use:enhance={handleStatusForm}>
						<input type="text" hidden name="id" value={item.id} />
						<input type="text" hidden name="status" value="draft" />
						<button
							class:btn-success={status.edit === true && currentIndex === i}
							class="btn btn-info"
							>{#if status.edit}Restored Successfully!{:else if loaders.edit && currentIndex === i}
								Restoring...<span class="loading loading-spinner"></span>
							{:else}
								Restore
							{/if}
						</button>
					</form>
					<form action="?/deleteProject" method="POST" use:enhance={handleDeleteForm}>
						<input type="text" hidden name="id" value={item.id} />
						<input type="text" hidden name="status" value="trashed" />
						<button
							class:btn-warning={status.delete === true && currentIndex === i}
							class="btn btn-error"
							>{#if status.delete}Deleted Forever!{:else if loaders.delete === true && currentIndex === i}
								Deleting...<span class="loading loading-spinner"></span>
							{:else}
								Delete forever
							{/if}
						</button>
					</form>
				{/if}
			</div>
		</div>
	</div>
{/snippet}
