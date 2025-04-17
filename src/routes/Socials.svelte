<script>
	import { page } from '$app/state';
	import IconHouzz from '$icons/IconHouzz.svelte';
	import IconInstagram from '$icons/IconInstagramline.svelte';
	import IconLinkedin from '$icons/IconLinkedin.svelte';
	import IconX from '$icons/IconX.svelte';
</script>

<a
	href={page.data.socials.instagram}
	target="_blank"
	class="ml-4 inline-flex size-7 text-gray-500 transition-all hover:text-white"><IconInstagram /></a
>
<a
	href={page.data.socials.houzz}
	target="_blank"
	class="ml-4 inline-flex size-7 text-gray-500 transition-all hover:text-white"><IconHouzz /></a
>
<a
	href={page.data.socials.x}
	target="_blank"
	class="ml-4 inline-flex size-7 text-gray-500 transition-all hover:text-white"><IconX /></a
>
<a
	href={page.data.socials.linkedin}
	target="_blank"
	class="ml-4 inline-flex size-7 text-gray-500 transition-all hover:text-white"><IconLinkedin /></a
>
