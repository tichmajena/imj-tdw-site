<script lang="ts">
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	console.log(data);
	let project: Project = data.project;
</script>

<div class="w-full pt-12 pb-20 md:pt-0">
	<div
		class="container mx-auto mb-10 flex flex-col space-y-8 space-x-0 px-5 md:flex-row md:space-y-0 md:space-x-12"
	>
		<div class="flex w-2/12 flex-col justify-end">
			<div class="md:text-right">{project.type}</div>
			<div class="font-thin md:text-right">{project.year}</div>
		</div>
		<div class=" flex w-8/12">
			<div class="hidden h-full border-l border-purple-600 md:flex"></div>
			<div class="md:mt-20 md:w-5/6 md:pl-6">
				<h1 class="mb-4 text-4xl font-thin md:text-6xl">{project.title}</h1>
				<p class="text-xl font-thin">{project.description}</p>
			</div>
		</div>
		<div class="flex w-2/12 flex-col justify-end">
			<div class="mb-2 block w-full font-medium">Service</div>
			<ul>
				{#each project.services as service}
					<li class="font-thin">{service}</li>
				{/each}
			</ul>
		</div>
	</div>
	<div class="container mx-auto px-5">
		<div class="carousel carousel-center w-full space-x-4 p-4">
			{#each project.images as image}
				<div class="carousel-item">
					<img
						src="{data.cloudfront}/fit-in/1280x720/{image}"
						class="rounded-box"
						alt={project.title}
					/>
				</div>
			{/each}
		</div>
	</div>
</div>
