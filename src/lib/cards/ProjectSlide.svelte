<script>
	import { slide } from 'svelte/transition';
	import { page } from '$app/state';
	import { blurhash } from '../js/utils';
	import { z } from 'zod';

	let { title, image, slug, description } = $props();

	function toggleInfo() {
		info = !info;
	}
	let w = $derived(image.width || 1920);
	let h = $derived(image.height || 1080);
	let imageFailed = $state(0);
	let imageRetry = $state(0);
	let zvaramba = $state(false);
	let fitIn1920 = $state('/fit-in/1920x0/');
	let fitIn1440 = $state('/fit-in/1440x0/');
	let fitIn1024 = $state('/fit-in/1024x0/');
	let fitIn768 = $state('/fit-in/768x0/');
	let fitIn480 = $state('/fit-in/480x0/');
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
{#key imageFailed}
	<picture>
		<source
			srcset="
			{page.data.cloudfront}{fitIn1920}{image.name} 1920w,
			{page.data.cloudfront}{fitIn1440}{image.name} 1440w,
			{page.data.cloudfront}{fitIn1024}{image.name} 1024w"
			media="(min-width: 1024px)"
		/>
		<source
			srcset="
			{page.data.cloudfront}{fitIn768}{image.name} 768w,
			{page.data.cloudfront}{fitIn480}{image.name} 480w"
			media="(max-width: 1023px)"
		/>
		<img
			onload={(e) => {
				//console.log(e);

				zvaramba = false;
			}}
			onerror={async (e) => {
				zvaramba = true;

				//console.log(e);

				//console.log('Failed', { fitIn1024, fitIn768, fitIn480, fitIn1920, imageFailed, title });
				if (imageFailed < 4) {
					imageFailed++;
				} else {
					zvaramba = true;
				}
				if (imageFailed === 1) {
					fitIn1920 = '/fit-in/1921x0/';
					fitIn1440 = '/fit-in/1441x0/';
					fitIn1024 = '/fit-in/1025x0/';
					fitIn768 = '/fit-in/769x0/';
					fitIn480 = '/fit-in/481x0/';
				} else if (imageFailed === 2) {
					fitIn1920 = '/fit-in/1922x0/';
					fitIn1440 = '/fit-in/1442x0/';
					fitIn1024 = '/fit-in/1026x0/';
					fitIn768 = '/fit-in/770x0/';
					fitIn480 = '/fit-in/482x0/';
				} else if (imageFailed === 3) {
					fitIn1920 = '/';
					fitIn1440 = '/';
					fitIn1024 = '/';
					fitIn768 = '/';
					fitIn480 = '/';
				} else if (imageFailed === 4) {
					// do nothing more
					await fetch('/api/invalidate', {
						method: 'POST',
						headers: { 'Content-Type': 'application/json' },
						body: JSON.stringify([
							`/${image.name}`
							// `/fit-in/1280x720/${image.name}`,
							// `/fit-in/1440x0/${image.name}`,
							// `/fit-in/1024x0/${image.name}`,
							// `/fit-in/768x0/${image.name}`,
							// `/fit-in/480x0/${image.name}`
						])
					});
					if (imageRetry < 3) {
						imageFailed = 0;
						imageRetry++;
					} else {
						zvaramba = true;
					}
					console.log('Invalidation requested');
				} else {
					console.error(title);
				}

				//e.target.src = `${page.data.cloudfront}/fit-in/770x0/${image.name}`;
			}}
			fetchpriority="high"
			width={w}
			height={h}
			class:w-0={zvaramba}
			class="h-[40vh] w-auto overflow-hidden object-contain md:h-[80vh]"
			src="{page.data.cloudfront}/{image.name}?webp"
			alt="{zvaramba}-{title}"
		/>
	</picture>
{/key}

<!-- </div> -->
<!-- <img
	src="{page.data.cloudfront}/fit-in/768x0/{image.name}"
	alt=""
	style="height: 300px; width: auto; object-fit: contain; display: block; margin: 0 auto;"
/> -->
