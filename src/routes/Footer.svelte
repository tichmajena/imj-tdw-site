<script>
	import { page } from '$app/state';
	import { dataURItoBlob } from '$src/lib/js/utils';
</script>

<div class="flex-flex-col container mx-auto px-5">
	<div class="mb-20 text-white">
		<div class="mb-8 block text-4xl font-thin md:text-6xl">Contact us</div>
		<a
			href="/contact"
			class="btn btn-xl btn-primary btn-outline rounded-xl border-white font-thin text-white hover:bg-stone-900"
		>
			<span>Enquire</span><svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				stroke-width="1.5"
				stroke="currentColor"
				class="size-6"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
				/>
			</svg>
		</a>
	</div>
	<nav
		class="flex flex-col space-y-3 font-thin text-white md:flex-row md:space-y-0 md:space-x-6 lg:space-x-8"
	>
		<div class="link link-hover hover:text-white">
			© Copyright Troika Design Workshop {new Date().getFullYear()}
		</div>
		<a href="https://turnbury.co.zw" class="link link-hover hover:text-white">Visit Turnbury</a>
		<a href={page.data.socials.x} class="link link-hover hover:text-white">X</a>
		<a href={page.data.socials.linkedin} class="link link-hover hover:text-white">Linkedin</a>
		<a href={page.data.socials.instagram} class="link link-hover hover:text-white">Instagram</a>
		<a href={page.data.socials.facebook} class="link link-hover hover:text-white">Facebook</a>
		<a href={page.data.socials.youtube} class="link link-hover hover:text-white">Youtube</a>
		<a href={page.data.socials.houzz} class="link link-hover hover:text-white">Houzz</a>
	</nav>
</div>
