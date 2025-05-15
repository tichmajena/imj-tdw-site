<script>
	import { page } from '$app/state';
	import IconFacebook from '$icons/IconFacebook2.svelte';
	import IconHouzz from '$icons/IconHouzz.svelte';
	import IconInstagram from '$icons/IconInstagramline.svelte';
	import IconLinkedin from '$icons/IconLinkedin.svelte';
	import IconX from '$icons/IconX.svelte';
	import IconYoutube from '$icons/IconYoutube2.svelte';
</script>

<a
	href={page.data.socials.instagram}
	target="_blank"
	class="inline-flex size-7 text-gray-500 transition-all hover:text-white"><IconInstagram /></a
>
<a
	href={page.data.socials.facebook}
	target="_blank"
	class="ml-4 inline-flex size-7 text-gray-500 transition-all hover:text-white"><IconFacebook /></a
>
<a
	href={page.data.socials.youtube}
	target="_blank"
	class="ml-4 inline-flex size-7 text-gray-500 transition-all hover:text-white"><IconYoutube /></a
>
<!-- <a
	href={page.data.socials.x}
	target="_blank"
	class="ml-4 inline-flex size-7 text-gray-500 transition-all hover:text-white"><IconX /></a
> -->
