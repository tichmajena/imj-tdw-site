<script>
	import { slide } from 'svelte/transition';
	import { page } from '$app/state';
	import { blurhash } from '../js/utils';

	let { title, image, slug, description } = $props();

	function toggleInfo() {
		info = !info;
	}
	let w = $derived(image.width || 1920);
	let h = $derived(image.height || 1080);
</script>

<!-- <div class="relative aspect-[400/627] h-full bg-sky-400"> -->
<!-- src="{$page.data.cloudfront}/fit-in/1080x1920/{image}" -->

<!-- <img
		width={image.width}
		height={image.height}
		src={blurhash(image)}
		class="absolute inset-0 z-10 hidden h-full w-full"
		alt={image.name}
	/> -->
<!-- <img
		fetchpriority="high"
		src="{page.data.cloudfront}/fit-in/1600x0/{image.name}"
		alt=""
		class="absolute inset-0 h-full w-full object-cover transition-all duration-250"
	/> -->

<picture>
	<source
		srcset="
			{page.data.cloudfront}/fit-in/1920x0/{image.name}?webp 1920w,
			{page.data.cloudfront}/fit-in/1440x0/{image.name}?webp 1440w,
			{page.data.cloudfront}/fit-in/1024x0/{image.name}?webp 1024w"
		media="(min-width: 1024px)"
	/>
	<source
		srcset="
			{page.data.cloudfront}/fit-in/768x0/{image.name}?webp 768w,
			{page.data.cloudfront}/fit-in/480x0/{image.name}?webp 480w"
		media="(max-width: 1023px)"
	/>
	<img
		width={w}
		height={h}
		class="h-[40vh] w-auto object-contain md:h-[80vh]"
		src="{page.data.cloudfront}/fit-in/768x0/{image.name}?webp"
		alt={title}
	/>
</picture>

<!-- </div> -->
<!-- <img
	src="{page.data.cloudfront}/fit-in/768x0/{image.name}"
	alt=""
	style="height: 300px; width: auto; object-fit: contain; display: block; margin: 0 auto;"
/> -->
