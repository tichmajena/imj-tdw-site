<script>
	import { page } from '$app/state';
	import { blurhash } from '../js/utils';

	let { project } = $props();

	let imageFailed = $state(0);
	let imageRetry = $state(0);
	let zvaramba = $state(false);
	// let fitIn1920 = $state('/fit-in/1920x0/');
	// let fitIn1440 = $state('/fit-in/1440x0/');
	let fitIn1024 = $state('/fit-in/1024x0/');
	let fitIn768 = $state('/fit-in/768x0/');
	let fitIn540 = $state('/fit-in/540x0/');
	let fitIn480 = $state('/fit-in/480x0/');
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
			{page.data.cloudfront}{fitIn1024}{project.featured_image.name} 1920w,
			{page.data.cloudfront}{fitIn768}{project.featured_image.name} 1440w,
			{page.data.cloudfront}{fitIn540}{project.featured_image.name} 1024w"
			media="(min-width: 1024px)"
		/>
		<source
			class="h-full w-full object-cover"
			srcset="
			{page.data.cloudfront}{fitIn768}{project.featured_image.name} 768w,
			{page.data.cloudfront}{fitIn480}{project.featured_image.name} 480w"
			media="(max-width: 1023px)"
		/>

		<img
			onerror={async (e) => {
				if (imageFailed < 4) {
					imageFailed++;
					zvaramba = true;
				} else {
					zvaramba = true;
				}
				if (imageFailed === 1) {
					// fitIn1920 = '/fit-in/1921x0/';
					// fitIn1440 = '/fit-in/1441x0/';
					fitIn1024 = '/fit-in/1025x0/';
					fitIn768 = '/fit-in/769x0/';
					fitIn540 = '/fit-in/541x0/';
					fitIn480 = '/fit-in/481x0/';
					zvaramba = false;
				} else if (imageFailed === 2) {
					// fitIn1920 = '/fit-in/1922x0/';
					// fitIn1440 = '/fit-in/1442x0/';
					fitIn1024 = '/fit-in/1026x0/';
					fitIn768 = '/fit-in/770x0/';
					fitIn540 = '/fit-in/542x0/';
					fitIn480 = '/fit-in/482x0/';
					zvaramba = false;
				} else if (imageFailed === 3) {
					// fitIn1920 = '/';
					// fitIn1440 = '/';
					fitIn1024 = '/';
					fitIn768 = '/';
					fitIn540 = '/';
					fitIn480 = '/';
					zvaramba = false;
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
						zvaramba = false;
					} else {
						zvaramba = true;
					}
					console.log('Invalidation requested');
				}

				//e.target.src = `${page.data.cloudfront}/fit-in/770x0/${image.name}`;
			}}
			class="h-full w-full object-cover"
			src="{page.data.cloudfront}{fitIn768}{project.featured_image.name}?webp"
			alt={project.title}
		/>
	</picture>

	<div
		class="absolute bottom-0 h-5/6 w-full bg-linear-to-t from-black/70 via-black/50 to-transparent transition-all duration-250 md:h-1/2 md:opacity-100"
	></div>

	<div
		class="absolute bottom-0 left-0 flex w-auto origin-bottom-left flex-col p-7 transition-all duration-250"
	>
		<div class="w-full">
			<h4 class="text-sm font-thin md:mb-2 md:text-xl">{project.year}</h4>
		</div>
		<div class="w-full">
			<h3 class="text-xl font-thin md:text-2xl lg:text-4xl">{project.title}</h3>
		</div>
	</div>
</a>
