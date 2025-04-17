<script>
	import { page } from '$app/state';

	let { project } = $props();
</script>

<a
	href="/projects/{project.id}"
	class="group relative flex aspect-[3/4.3] w-full cursor-pointer flex-col overflow-hidden"
>
	<img
		src="{page.data.cloudfront}/{project.featured_image}"
		alt=""
		class="absolute inset-0 h-full w-full scale-110 object-cover transition-all duration-250 group-hover:-translate-x-5"
	/>

	<div
		class="absolute bottom-0 h-1/2 w-full bg-linear-to-t from-black/90 via-black/70 to-transparent opacity-0 transition-all duration-250 group-hover:opacity-100"
	></div>

	<div
		class="absolute bottom-0 left-0 z-10 w-auto origin-bottom-left scale-0 p-5 transition-all duration-250 group-hover:scale-100"
	>
		<div class="w-full">
			<h3 class="mb-2 text-4xl font-thin">{project.title}</h3>
		</div>
		<div class="w-full">
			<h4 class="text-xl font-thin">{project.year}</h4>
		</div>
	</div>
</a>
