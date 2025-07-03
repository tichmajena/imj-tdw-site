<script>
	import { page } from '$app/state';
	import { dataURItoBlob } from '../js/utils';

	let { member } = $props();
</script>

<div class="group relative flex aspect-[3/4] w-full flex-col overflow-hidden text-white">
	<img
		class="absolute h-full w-full object-cover object-center grayscale transition-all group-hover:scale-105"
		src="{page.data.cloudfront}/fit-in/500x900/{member.image}"
		alt={member.name}
	/>
	<div
		class="absolute bottom-0 h-1/2 w-full bg-linear-to-t from-black via-black/40 to-transparent transition-all duration-250"
	></div>
	<div class="absolute bottom-0 flex flex-col p-5">
		<div class="w-full text-xl font-light">{member.name}</div>
		<div class="w-full font-light">{member.position}</div>
	</div>
</div>
