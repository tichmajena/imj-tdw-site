<script>
	import { page } from '$app/state';
	import { dataURItoBlob } from '../js/utils';

	let { member } = $props();
</script>

<div class="group relative flex aspect-square w-full flex-col overflow-hidden">
	<img
		class="absolute h-full w-full object-cover object-center grayscale transition-all group-hover:scale-105 group-hover:grayscale-0"
		src="{page.data.cloudfront}/{member.image}"
		alt={member.name}
	/>
	<div
		class="absolute bottom-0 h-1/2 w-full bg-linear-to-t from-black/90 via-black/70 to-transparent opacity-0 transition-all duration-250 group-hover:opacity-100"
	></div>
	<div class="absolute bottom-0 hidden flex-col p-5 group-hover:flex">
		<div class="w-full text-xl font-light">{member.name}</div>
		<div class="w-full font-light">{member.position}</div>
	</div>
</div>
