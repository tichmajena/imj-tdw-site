<script>
	import { getContext } from 'svelte';
	import Text from '$lib/Text.svelte';
	const svedit = getContext('svedit');

	let { path } = $props();

	let block = $derived(svedit.entry_session.get(path));
	let hovered = $state(-1);
	let fired = $state(-1);
	let debouncer = $state(-1);
	// console.log(block);
	import { getLightbox } from '$lib/js/Lightbox.svelte';
	import { page } from '$app/stores';

	const lightbox = getLightbox();

	function select(i) {
		// console.log(i);

		if (!document.startViewTransition) {
			lightbox.launch(i, block.images);
		} else {
			document.startViewTransition(() => {
				lightbox.launch(i, block.images);
			});
		}
	}
	// $inspect(block);

	function onHover(i) {
		if (fired === i) return;
		if (!document.startViewTransition) return;

		return new Promise((resolve) => {
			document.startViewTransition(async () => {
				hovered = i;
				fired = i;
				resolve();
				// console.log('resolved');
				await navigation.complete;
			});
		});
	}
</script>

<div
	data-path={path.join('.')}
	data-type="block"
	data-index={path.at(-1)}
	style="anchor-name: --{path.join('-')};"
	class:layout-1={block.layout === 1}
	class="container mx-auto my-4 hidden"
>
	<div class="hidden h-96 w-full">
		<!--  -->
		{@render image(block.images?.[0], 0)}
	</div>
	<div class="h-[32rem] w-full md:flex">
		<div class="h-full w-1/2 p-1">
			{@render image(block.images?.[0], 0)}
		</div>
		<div class="flex h-full w-1/2">
			<div class="h-full w-1/2 p-1">
				{@render image(block.images?.[1], 1)}
			</div>
			<div class="flex h-full w-1/2 flex-col">
				<div class="flex h-1/2 w-full p-1">
					{@render image(block.images?.[2], 2)}
				</div>
				<div class="flex h-1/2 w-full p-1">
					{@render image(block.images?.[3], 3)}
				</div>
			</div>
		</div>
	</div>
</div>
<div
	data-path={path.join('.')}
	data-type="block"
	data-index={path.at(-1)}
	style="anchor-name: --{path.join('-')};"
	class:layout-1={block.layout === 1}
	class="stack my-20 hidden aspect-video w-full"
>
	{@render image(block.images?.[0], 0)}
	{@render image(block.images?.[1], 1)}
	{@render image(block.images?.[2], 2)}
</div>

<div
	data-path={path.join('.')}
	data-type="block"
	data-index={path.at(-1)}
	style="anchor-name: --{path.join('-')};"
	class:layout-2={block.layout === 2}
	class="container mx-auto hidden columns-2 gap-4 space-y-4 md:columns-3 lg:columns-4"
>
	{#each block.images as item, i}
		{@render image(item, i)}
	{:else}
		<div
			class="flex aspect-video h-full w-full items-center justify-center overflow-hidden rounded-lg bg-teal-700"
		>
			<h1 class="text-5xl text-teal-400">1</h1>
		</div>
		<div
			class="flex aspect-square h-full w-full items-center justify-center overflow-hidden rounded-lg bg-teal-700"
		>
			<h1 class="text-5xl text-teal-400">2</h1>
		</div>
		<div
			class="flex aspect-video h-full w-full items-center justify-center overflow-hidden rounded-lg bg-teal-700"
		>
			<h1 class="text-5xl text-teal-400">3</h1>
		</div>
	{/each}
</div>
<!-- <img class="w-full rounded-xl shadow" src="./masonry-01.jpg" width="232" height="290" alt="Image 01" /> -->

{#snippet image(item, i)}
	{#if item}
		<div
			role="button"
			tabindex="-1"
			onkeydown={(e) => {
				if (e.key === 'Enter') {
					select(i);
				}
			}}
			onclick={() => select(i)}
			style:--tag={'g-image-' + item.id}
			class:hidden={lightbox?.selected !== -1}
			class="card flex h-full w-full items-center justify-center overflow-hidden rounded-lg bg-teal-700"
		>
			<img
				src="{$page.data.cloudfront}/fit-in/1000x0/{item.url}?webp"
				alt=""
				class="h-full w-full object-cover object-center"
			/>
			<!-- <h1 class="text-5xl text-teal-400">{item.title}</h1> -->
		</div>
		<!-- {/if} -->
	{:else}
		<div
			class="flex h-full w-full items-center justify-center overflow-hidden rounded-lg bg-[#B0BCF4]"
		>
			<h1 class="text-5xl text-white">{i + 1}</h1>
		</div>
	{/if}
{/snippet}

<div
	data-path={path.join('.')}
	data-type="block"
	data-index={path.at(-1)}
	style="anchor-name: --{path.join('-')};"
	class:layout-3={block.layout === 3}
	class=" container mx-auto hidden flex-col"
>
	<div class="mx-auto my-10 grid max-w-screen-lg">
		<div class="caption">
			<!-- ATTENTION: Do not format the following lines, as whitespace will mess up contenteditable -->
			<Text class="heading2 text-center" path={[...path, 'title']} editable={block.editable} />
			<Text class="body text-center" path={[...path, 'description']} editable={block.editable} />
		</div>
	</div>
	<div class="mx-auto grid max-w-screen-lg grid-cols-2 gap-4 px-6 md:grid-cols-3">
		<!--  -->
		{#each block.images as item, i}
			{@render card(item, i)}
		{/each}
	</div>
</div>

{#snippet card(item, i)}
	<!--  -->
	<div
		role="article"
		onmouseenter={(e) => {
			clearTimeout(debouncer);
			debouncer = setTimeout(() => {
				onHover(i);
			}, 200);
		}}
		style:--tag={'g-image-' + item.id}
		class:hidden={lightbox?.selected !== -1}
		class="group card relative flex aspect-square w-full items-center justify-center overflow-hidden rounded-none bg-teal-700 md:w-full"
	>
		<img
			src="{$page.data.cloudfront}/fit-in/400x400/{item.url}?webp"
			alt={item.alt}
			class="relative z-0 h-full w-full object-cover object-center"
		/>
		{#if hovered === i}
			<div
				style="view-transition-name: product-image-overlay;"
				class="bg-opacity-90 absolute z-10 h-full w-full bg-green-800 text-white"
			>
				<div class="absolute bottom-0 p-4 md:p-8">
					<div class="mb-2 text-xl font-bold">{item.title}</div>
					<div class="text text-sm">{item.description}</div>
				</div>
			</div>
		{/if}
		<!-- <h1 class="text-5xl text-teal-400">{item.title}</h1> -->
	</div>
{/snippet}

<style>
	@reference '../../app.css';
	.card {
		view-transition-name: var(--tag);
	}

	.layout-1 {
		@apply md:flex md:flex-col;
	}
	.layout-1.stack {
		@apply inline-grid md:hidden;
	}

	.layout-2 {
		@apply block;
	}
	.layout-3 {
		@apply flex;
	}
</style>
