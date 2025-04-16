<script>
	import { enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import Logo from '$lib/assets/Logo.svelte';
	import Mail from '$icons/IconMail.svelte';
	import Telephone from '$icons/IconPhone.svelte';
	import Location from '$icons/IconMap.svelte';
	import Clock from '$icons/IconClock.svelte';
	import { toTitleCase } from '$lib/js/utils';
	import IconInstagram from '$icons/IconInstagram.svelte';
	import IconYoutube from '$icons/IconYoutube.svelte';
	import IconFacebook from '$icons/IconFacebook.svelte';
	import { fade, fly, slide } from 'svelte/transition';
	import { page } from '$app/state';
	import Socials from '../Socials.svelte';
	import Menu from '../Menu.svelte';
	import Footer from '../Footer.svelte';
	import IconPlus from '$icons/IconPlus.svelte';
	let { children, socials, url } = $props();

	let title = '',
		image = '',
		slug = '';
	let showMenu = $state(false);
	let showMenuBool = $state(false);
</script>

<div data-theme={page.data.theme} class="!bg-base-100">
	<input bind:checked={showMenuBool} id="menu-toggle" type="checkbox" class="drawer-toggle peer" />
	<div class="absolute z-10 flex h-32 w-full items-center peer-checked:fixed peer-checked:bg-black">
		<div class="container mx-auto flex flex-row items-center justify-between p-5">
			<a href="/" class="text-4xl font-bold"><Logo></Logo></a>
			<div class="flex flex-row items-center space-x-2">
				<div>
					<Socials />
				</div>

				<label class="ml-4 inline-flex" for="menu-toggle"><IconPlus /></label>
			</div>
		</div>
	</div>
	<!-- {#if showMenu} -->
	<div transition:fade class="fixed inset-0 top-32 z-10 hidden bg-black peer-checked:block">
		<Menu />
	</div>
	<!-- {/if} -->

	{@render children()}
	{@render footer()}

	{#snippet footer()}
		<!-- <footer class=" -mt-1 w-full bg-[#006838] p-10 text-white">
			<div class="footer container mx-auto">
				<nav>
					<h6 class="footer-title">Contact</h6>
					<div class="flex flex-col text-xs">
						<div class="flex w-fit flex-row space-x-6">
							<div class="w-6">
								<Location />
							</div>
							<div class="mx-2 text-lg font-medium">
								<a
									href="https://maps.app.goo.gl/F3Lx27MAjX8Y8WfN6"
									target="_blank"
									class="text-sm text-white no-underline"
									rel="noreferrer"
								>
									Stand 479 Pomona, Harare Drive<br /> Harare, Zimbabwe
								</a>
							</div>
						</div>
						<div class="flex w-fit flex-row space-x-6">
							<div class="w-6">
								<Telephone />
							</div>
							<div class="mx-2 text-lg font-medium">
								<a class="text-sm text-white no-underline" href="tel:+263 771 387 703">
									+263 771 387 703
								</a><br />
								<a class="text-sm text-white no-underline" href="tel:+263 771 637 769">
									+263 771 637 769
								</a><br />
								<a class="text-sm text-white no-underline" href="tel:+263 771 600 124">
									+263 771 600 124
								</a><br />
							</div>
						</div>
						<div class="flex w-fit flex-row space-x-6">
							<div class="w-6">
								<Mail />
							</div>
							<div class="mx-2 text-lg font-medium">
								<a class="text-sm text-white no-underline" href="mailto:info@.net">
									info@.net
								</a>
							</div>
						</div>
						<div class="flex w-fit flex-row space-x-6">
							<div class="w-6">
								<Clock />
							</div>
							<div class="mx-2 text-lg font-medium">
								<div class="text-sm text-white no-underline">Mon-Fri 8:00 AM - 5:00 PM</div>
							</div>
						</div>
					</div>
				</nav>
				<nav>
					<h6 class="footer-title">About</h6>
					<a href="/about" class="link-hover link text-[--light]">About</a>
				</nav>
				<nav>
					<h6 class="footer-title">Company</h6>
					<a href="/" class="link-hover link text-[--light]">Home</a>
					<a href="/about" class="link-hover link text-[--light]">Approach</a>
					<a href="/about" class="link-hover link text-[--light]">Our Story</a>
					<a href="/about" class="link-hover link text-[--light]">Team</a>
					<a href="/contact" class="link-hover link text-[--light]">Contact</a>
				</nav>

				<nav>
					<h6 class="footer-title">Social</h6>
					<div class="grid grid-flow-col gap-4 text-[--light]">
						<a aria-label="instagram" href={socials.instagram} target="_blank">
							<IconInstagram />
						</a>
						<a aria-label="youtube" href={socials.youtube} target="_blank">
							<IconYoutube />
						</a>
						<a aria-label="facebook" href={socials.facebook} target="_blank">
							<IconFacebook />
						</a>
					</div>
				</nav>
			</div>
		</footer> -->
		<footer class="bg-base-300 text-base-content p-24">
			<Footer />
		</footer>
	{/snippet}

	{#snippet themeToggle()}
		<form
			use:enhance
			action="/?/setTheme&theme={page.data.theme === 'dark' ? 'light' : 'dark'}"
			method="post"
		>
			<button
				class="the-drop swap swap-rotate relative flex size-8 items-center justify-center !rounded-full border-0 ring-0 outline-none hover:bg-transparent"
			>
				<!-- this hidden checkbox controls the state -->
				<input type="checkbox" class="sr-only" />

				<!-- sun icon -->
				<svg
					class:swap-on={page.data.theme === 'light'}
					class:swap-off={page.data.theme === 'dark'}
					class="absolute right-2 h-4 w-4 fill-current"
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 24 24"
				>
					<path
						d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z"
					/>
				</svg>

				<!-- moon icon -->
				<svg
					class:swap-on={page.data.theme === 'dark'}
					class:swap-off={page.data.theme === 'light'}
					class="absolute right-2 h-4 w-4 fill-current"
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 24 24"
				>
					<path
						d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z"
					/>
				</svg>
			</button>
		</form>
	{/snippet}
</div>

<style>
	.the-drop {
		position: relative;
		display: flex;
		flex-shrink: 0;
		flex-direction: column;
		flex-wrap: wrap;
		align-items: stretch;
		border-radius: var(--rounded-btn, 0.5rem);
		padding-left: 1rem;
		padding-right: 1rem;
		padding-top: 0.5rem;
		padding-bottom: 0.5rem;
		text-align: start;
		transition-property:
			color,
			background-color,
			border-color,
			text-decoration-color,
			fill,
			stroke,
			opacity,
			box-shadow,
			transform,
			filter,
			-webkit-backdrop-filter;
		transition-property:
			color, background-color, border-color, text-decoration-color, fill, stroke, opacity,
			box-shadow, transform, filter, backdrop-filter;
		transition-property:
			color,
			background-color,
			border-color,
			text-decoration-color,
			fill,
			stroke,
			opacity,
			box-shadow,
			transform,
			filter,
			backdrop-filter,
			-webkit-backdrop-filter;
		transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
		transition-timing-function: cubic-bezier(0, 0, 0.2, 1);
		transition-duration: 200ms;
		text-wrap: balance;
	}

	.the-drop:hover {
		background-color: var(--fallback-bc, oklch(var(--bc) / 0.1));
	}
</style>
