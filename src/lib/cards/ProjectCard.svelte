<script>
	import { page } from '$app/state';
	import { blurhash } from '../js/utils';

	let { project } = $props();
</script>

<a
	data-sveltekit-preload-data="hover"
	data-sveltekit-preload-code="hover"
	href="/projects/{project.id}"
	class="group relative flex aspect-[400/267] w-full cursor-pointer flex-col overflow-hidden text-white"
>
	<img
		width={project.featured_image.width}
		height={project.featured_image.height}
		src={blurhash(project.featured_image)}
		class="absolute inset-0 z-10 hidden h-full w-full"
		alt={project.featured_image.name}
	/>
	<!-- <img
		fetchpriority="high"
		src="{page.data.cloudfront}/fit-in/1600x0/{project.featured_image.name}"
		alt=""
		class="absolute inset-0 h-full w-full object-cover transition-all duration-250"
	/> -->
	<picture class="h-full w-full object-center">
		<source
			class="h-full w-full object-cover"
			srcset="
			{page.data.cloudfront}/fit-in/1024x0/{project.featured_image.name}?webp 1920w,
			{page.data.cloudfront}/fit-in/768x0/{project.featured_image.name}?webp 1440w,
			{page.data.cloudfront}/fit-in/540x0/{project.featured_image.name}?webp 1024w"
			media="(min-width: 1024px)"
		/>
		<source
			class="h-full w-full object-cover"
			srcset="
			{page.data.cloudfront}/fit-in/768x0/{project.featured_image.name}?webp 768w,
			{page.data.cloudfront}/fit-in/480x0/{project.featured_image.name}?webp 480w"
			media="(max-width: 1023px)"
		/>
		<img
			class="h-full w-full object-cover"
			src="{page.data.cloudfront}/fit-in/768x0/{project.featured_image.name}?webp"
			alt={project.title}
		/>
	</picture>

	<div
		class="absolute bottom-0 h-1/2 w-full bg-linear-to-t from-black/70 via-black/50 to-transparent transition-all duration-250 md:opacity-100"
	></div>

	<div
		class="absolute bottom-0 left-0 flex w-auto origin-bottom-left flex-col-reverse p-2 transition-all duration-250 md:flex-col md:p-6"
	>
		<div class="w-full">
			<h3 class="text-xl font-thin md:mb-2 md:text-4xl">{project.title}</h3>
		</div>
		<div class="w-full">
			<h4 class="text-sm font-thin md:text-xl">{project.year}</h4>
		</div>
	</div>
</a>
