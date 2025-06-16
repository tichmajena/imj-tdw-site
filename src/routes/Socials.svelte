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
	arial-label="instagram"
	class="inline-flex size-7 text-gray-500 transition-all hover:text-gray-200"
>
	<span class="sr-only">Instagran</span><IconInstagram /></a
>
<a
	arial-label="facebook"
	href={page.data.socials.facebook}
	target="_blank"
	class="ml-4 inline-flex size-7 text-gray-500 transition-all hover:text-gray-200"
>
	<span class="sr-only">Facebook</span><IconFacebook /></a
>
<a
	arial-label="youtube"
	href={page.data.socials.youtube}
	target="_blank"
	class="ml-4 inline-flex size-7 text-gray-500 transition-all hover:text-gray-200"
>
	<span class="sr-only">Youtube</span><IconYoutube /></a
>
<a
	href={page.data.socials.x}
	target="_blank"
	class="ml-4 inline-flex size-7 text-gray-500 transition-all hover:text-gray-200"><IconX /></a
>
