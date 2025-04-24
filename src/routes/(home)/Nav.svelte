<script>
	import { enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import Logo from '$lib/assets/Logo.svelte';
	import Mail from '$icons/IconMail.svelte';
	import Telephone from '$icons/IconPhone.svelte';
	import Location from '$icons/IconMap.svelte';
	import Clock from '$icons/IconClock.svelte';
	import { toTitleCase } from '$src/lib/js/utils';
	import IconInstagram from '$icons/IconInstagram.svelte';
	import IconYoutube from '$icons/IconYoutube.svelte';
	import IconFacebook from '$icons/IconFacebook.svelte';
	import { fade, fly, slide } from 'svelte/transition';
	import { page } from '$app/state';
	import Socials from '../Socials.svelte';
	import Menu from '../Menu.svelte';
	import Footer from '../Footer.svelte';
	import IconPlus from '$icons/IconPlus.svelte';
	import IconMinus from '$icons/IconMinus.svelte';
	let { children, socials, url } = $props();

	let title = '',
		image = '',
		slug = '';
	let showMenu = $state(false);
	let showMenuBool = $state(false);

	$effect(() => {
		page.data.url.pathname;
		page.data.theme;
		showMenuBool = false;
		showMenu = false;
	});
</script>

<div
	data-theme={page.data.theme}
	class="data-[theme=dark]:!bg-[#161515] data-[theme=light]:bg-white"
>
	<input bind:checked={showMenuBool} id="menu-toggle" type="checkbox" class="drawer-toggle peer" />
	<div class="absolute z-10 flex h-32 w-full items-center peer-checked:fixed peer-checked:bg-black">
		<div class="container mx-auto flex flex-row items-center justify-between px-5 py-5">
			<a href="/" class="text-4xl font-bold"><Logo></Logo></a>
			<div class="flex flex-row items-center space-x-2">
				{#if !showMenuBool}
					<div class="hidden space-x-6 md:flex">
						<Socials />
					</div>
				{/if}

				<label class="ml-10 inline-flex pt-4 text-gray-500 hover:text-white" for="menu-toggle">
					{#if showMenuBool}
						<IconMinus class="size-10" />
					{:else}
						<IconPlus class="size-10" />
					{/if}
				</label>
			</div>
		</div>
	</div>
	<!-- {#if showMenu} -->
	<div
		class="fixed inset-0 top-32 z-10 hidden bg-black transition-all duration-600 peer-checked:block"
	>
		<Menu />
	</div>
	<!-- {/if} -->

	{@render children()}
	{@render footer()}

	{#snippet footer()}
		<footer class="text-base-content bg-[#0A0A09] py-24">
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
