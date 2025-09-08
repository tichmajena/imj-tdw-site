<script lang="ts">
	import { fly, slide } from 'svelte/transition';
	import type { PageData } from './$types';
	import { dev } from '$app/environment';
	import { blurhash } from '$src/lib/js/utils';
	import ProjectSlider from '$src/lib/components/ProjectSlider.svelte';

	let { data }: { data: PageData } = $props();
	let project: Project = data.project;

	let slides = $derived(
		project.images.map((image, i) => ({
			title: project.title + ' ' + (i + 1),
			slug: '',
			image: image,
			description: ''
		}))
	);
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
		<div class="flex flex-col sm:w-full md:w-2/12">
			<div class="mb-4 flex flex-col justify-end md:h-40">
				<div class="md:text-right">{project.type}</div>
			</div>

			<div class="font-thin md:text-right">{project.year}</div>
			<div class="mt-4 flex w-full justify-start md:justify-end">
				<a
					class="btn btn-circle btn-ghost btn-xl -ml-5 transition-all delay-100 hover:ml-0 md:-mr-5 md:hover:mr-0"
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
			</div>
		</div>
		<div class=" flex sm:w-full md:w-8/12">
			<div class="hidden h-full border-l border-purple-600 md:flex"></div>
			<div class="sm:w-full md:w-5/6 md:pl-6">
				<div class="mb-4 flex items-end md:h-48">
					<h1 class=" text-3xl font-thin md:text-4xl lg:text-5xl">
						{project.title}
					</h1>
				</div>
				<p class="text-xl font-thin">{project.description}</p>
			</div>
		</div>
		<div class="flex flex-col sm:w-full md:w-2/12">
			{#if project.category === 'project'}
				<div class="mb-4 flex items-end md:h-40">
					<div class="block w-full font-medium">Service</div>
				</div>

				<ul class="flex flex-col space-y-2">
					{#each project.services as service}
						<li class="font-thin">{service}</li>
					{/each}
				</ul>
			{/if}
		</div>
	</div>
	<!-- Carousel -->
	{#if false}
		<div in:fly={{ delay: 600, y: 300, x: 0 }} class="container mx-auto min-h-[720px] px-5">
			<div class="carousel carousel-center w-full space-x-4">
				{#each project.images as image}
					{#if image === project.featured_image}
						<img
							width={image.width}
							height={image.height}
							src={blurhash(image)}
							class="absolute inset-0 z-10 hidden h-full w-full"
							alt={image.name}
						/>
						<div class="carousel-item">
							<!-- <picture>
							<source
								srcset="{data.cloudfront}/fit-in/1920x/{image.name} 1920w,
   {data.cloudfront}/fit-in/1440x/{image.name} 1440w,
   {data.cloudfront}/fit-in/1024x/{image.name} 1024w"
								media="(min-width: 1024px)"
							/>
							<source
								srcset="{data.cloudfront}/fit-in/768x/{image.name} 768w,
   {data.cloudfront}/fit-in/480x/{image.name} 480w"
								media="(max-width: 1023px)"
							/>
							<img src="{data.cloudfront}/fit-in/768x/{image.name}" alt={project.title} />
						</picture> -->
							<img
								src="{data.cloudfront}/fit-in/1280x720/{image.name}?webp"
								class=""
								alt={project.title}
							/>
						</div>
					{/if}
				{/each}
				{#each project.images as image}
					{#if image !== project.featured_image}
						<div class="carousel-item h-[600px]">
							<!-- <img
							width={image.width}
							height={image.height}
							src="{data.cloudfront}/fit-in/1920x0/{image.name}"
							class="relative z-10 hidden h-full w-full"
							alt={image.name}
						/>
						<picture class="ob">
							<source
								srcset="{data.cloudfront}/fit-in/1920x0/{image.name} 1920w,
   {data.cloudfront}/fit-in/1440x0/{image.name} 1440w,
   {data.cloudfront}/fit-in/1024x0/{image.name} 1024w"
								media="(min-width: 1024px)"
							/>
							<source
								srcset="{data.cloudfront}/fit-in/768x0/{image.name} 768w,
   {data.cloudfront}/fit-in/480x/{image.name} 480w"
								media="(max-width: 1023px)"
							/>
							<img src="{data.cloudfront}/fit-in/768x0/{image.name}" alt={project.title} />
						</picture> -->
							<img
								src="{data.cloudfront}/fit-in/1280x720/{image.name}?webp"
								class=""
								alt={project.title}
							/>
						</div>
					{/if}
				{/each}
			</div>
		</div>
	{/if}
	<ProjectSlider {slides} />
</div>
