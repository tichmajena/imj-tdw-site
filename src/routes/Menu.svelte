<script>
	import { slide } from 'svelte/transition';
	import Socials from './Socials.svelte';
	let menuItems = [
		{ href: '/about', text: 'About' },
		{ href: '/projects', text: 'Projects' },
		{ href: '/downloads', text: 'downloads' },
		{ href: '/services', text: 'Services' },
		{ href: '/contact', text: 'Contact' },
		{ href: '/', text: 'Vistit Turnbury' }
	];
</script>

<nav class="container mx-auto mt-24 flex w-full flex-col items-end md:flex-row">
	<ul class="mb-8 flex w-full flex-col space-y-8 pl-4 text-4xl md:mb-0 md:w-1/2">
		{#each menuItems as { href, text }, i}
			<li transition:slide={{ duration: 200, delay: 100 * i }}>
				<a {href} class="font-light transition-all hover:font-bold">{text}</a>
			</li>
		{/each}
	</ul>
	<div class=" -mb-3 w-full space-x-6 md:w-1/2">
		<Socials />
	</div>
</nav>
