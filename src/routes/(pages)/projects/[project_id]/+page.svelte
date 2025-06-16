<script lang="ts">
	import { fly, slide } from 'svelte/transition';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	console.log(data);
	let project: Project = data.project;
</script>

<svelte:head>
	<meta charset="utf-8" />
	<meta name="description" content={project.description} />
	<!-- <meta
		name="google-site-verification"
		content="+nxGUDJ4QpAZ5l9Bsjdi102tLVC21AIh5d1Nl23908vVuFHs34="
	/> -->
	<title>{project.title}</title>
	<!-- <meta name="robots" content="noindex,nofollow" /> -->
</svelte:head>

<div class="w-full pt-6 pb-20 md:pt-0">
	<div
		class="container mx-auto mb-10 flex flex-col space-y-4 space-x-0 px-5 md:flex-row md:space-y-0 md:space-x-6"
	>
		<div class="flex flex-col items-end justify-end sm:w-full md:w-2/12">
			<a
				class="btn btn-circle btn-ghost btn-xl -mr-3 mb-12"
				aria-label="Back to projects"
				href="/{project.category === 'project' ? 'projects' : 'community'}"
			>
				<span class="sr-only">Back to projects {project.category}</span>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke-width="1.5"
					stroke="currentColor"
					class="size-6"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M6.75 15.75 3 12m0 0 3.75-3.75M3 12h18"
					/>
				</svg>
			</a>
			<div class="md:text-right">{project.type}</div>
			<div class="font-thin md:text-right">{project.year}</div>
		</div>
		<div class=" flex sm:w-full md:w-8/12">
			<div class="hidden h-full border-l border-purple-600 md:flex"></div>
			<div class="sm:w-full md:mt-20 md:w-5/6 md:pl-6">
				<h1 class="mb-4 text-4xl font-thin md:text-6xl">{project.title}</h1>
				<p class="text-xl font-thin">{project.description}</p>
			</div>
		</div>
		<div class="flex flex-col justify-end sm:w-full md:w-2/12">
			<div class="mb-2 block w-full font-medium">Service</div>
			<ul>
				{#each project.services as service}
					<li class="font-thin">{service}</li>
				{/each}
			</ul>
		</div>
	</div>
	<div in:fly={{ delay: 600, y: 300, x: 0 }} class="container mx-auto min-h-[720px] px-5">
		<div class="carousel carousel-center w-full space-x-4">
			{#each project.images as image}
				{#if image === project.featured_image}
					<div class="carousel-item">
						<img
							src="{data.cloudfront}/fit-in/1280x720/{image.name}"
							class=""
							alt={project.title}
						/>
					</div>
				{/if}
			{/each}
			{#each project.images as image}
				{#if image !== project.featured_image}
					<div class="carousel-item">
						<img
							src="{data.cloudfront}/fit-in/1280x720/{image.name}"
							class=""
							alt={project.title}
						/>
					</div>
				{/if}
			{/each}
		</div>
	</div>
</div>
