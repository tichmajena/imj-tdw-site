<script>
	import ProjectSlide from '$src/lib/cards/ProjectSlide.svelte';
	import { slugify } from '$lib/js/utils';
	import Slider from './Slider.svelte';
	let { slides } = $props();

	const items = slides.map((props, i) => ({
		props: {
			title: props.title,
			slug: props.slug,
			image: props.image,
			description: props.description
		},
		component: ProjectSlide
	}));

	const optsMain = {
		type: 'loop',
		rewind: false,
		autoplay: true,
		// perPage: 3,
		gap: '20px',
		autoWidth: true,
		// height: '60vh',
		pagination: false,
		// breakpoints: {
		// 	800: { perPage: 2 },
		// 	640: { perPage: 1 }
		// },
		scroll: true,
		//releaseWheel: false,
		keyboard: 'global',
		autoScroll: {
			speed: 0.5,
			autoplay: true
		}
	};
</script>

<div class="container mx-auto mb-4 flex w-full">
	<Slider autoscroll={false} items={items || []} {optsMain} />
</div>
