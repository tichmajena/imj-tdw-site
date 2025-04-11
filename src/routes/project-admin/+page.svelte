<script lang="ts">
	import type { PageData } from './$types';

	let { data, form }: { data: PageData; form: any } = $props();
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
	let projects = $state([project_sample, project_sample]);

	$inspect(form);
</script>

<div
	class="container mx-auto flex w-full flex-col space-y-6 space-x-3 pt-20 md:flex-row md:space-y-0"
>
	<div class="flex w-full md:w-1/2">
		<form action="?/createProject" class="mb-3 flex flex-col" method="POST">
			<h2 class="mb-4 text-3xl">Create Project</h2>
			<label for="title">Project Title</label><input
				id="title"
				class="input input-primary mb-3"
				name="title"
				type="text"
				placeholder="Project Title"
				required
			/>
			<label for="type">Project Type</label><input
				id="type"
				class="input input-primary mb-3"
				name="type"
				type="text"
				required
				placeholder="Project Type"
			/>
			<label for="year">Year</label><input
				id="year"
				class="input input-primary mb-3"
				name="year"
				type="text"
				placeholder="Year"
				required
			/>
			<label for="description">Description</label><textarea
				id="description"
				class="textarea textarea-primary mb-3"
				name="description"
				placeholder="Description"
				required
			></textarea>
			<label for="services">Services</label><textarea
				id="services"
				class="textarea textarea-primary mb-3"
				name="services"
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
				type="file"
			/>
			<button class="btn btn-primary">Create</button>
		</form>
	</div>

	<div class="w-full md:w-1/2">
		{#each data.projects as project}
			{@render project_card(project)}
		{:else}
			MuDataBase hamuna zvinu
		{/each}
	</div>
</div>

{#snippet project_card(item: Project)}
	<div class="card bg-base-100 w-96 shadow-sm">
		<figure>
			<img src="/images/{item.featured_image}" alt="Shoes" />
		</figure>
		<div class="card-body">
			<h2 class="card-title">{item.title}</h2>
			<p>
				{item.description}
			</p>
			<div class="card-actions justify-end">
				<button class="btn btn-primary">Edit</button>
				<form action="?/deleteProject" method="POST">
					<input type="text" hidden name="id" value={item.id} />
					<button class="btn btn-error">Delete</button>
				</form>
			</div>
		</div>
	</div>
{/snippet}
