<script>
	import { page } from '$app/state';

	let { project } = $props();
</script>

<a
	href="/projects/{project.id}"
	class="group relative flex h-96 w-full cursor-pointer flex-col overflow-hidden"
>
	<img
		src="{page.data.cloudfront}/{project.featured_image}"
		alt=""
		class="absolute inset-0 h-full w-full object-cover transition-all group-hover:scale-110"
	/>
	<div class="absolute inset-0 w-full bg-black/70"></div>
	<div class="absolute bottom-0 z-10 hidden w-full p-5 group-hover:block">
		<div class="w-full">
			<h3 class="text-2xl font-bold">{project.title}</h3>
		</div>
		<div class="w-full">
			<h4 class="text-lg">{project.year}</h4>
		</div>
	</div>
</a>
