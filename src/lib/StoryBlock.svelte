<script>
	import { getContext } from 'svelte';
	import Text from '$lib/Text.svelte';
	import IconValues from '../icons/IconValues.svelte';
	import IconMission from '../icons/IconMission.svelte';
	import IconVision from '../icons/IconVision.svelte';
	const svedit = getContext('svedit');

	let { path } = $props();

	let block = $derived(svedit.entry_session.get(path));
</script>

<div
	class:hidden={block.classes.includes('icon')}
	class:grid={!block.classes.includes('icon')}
	class="story-block layout-{block.layout} {block.classes} container mx-auto w-full"
	data-path={path.join('.')}
	data-type="block"
	data-index={path.at(-1)}
	style="anchor-name: --{path.join('-')};"
>
	<div class="non-text-content overflow-hidden" contenteditable="false">
		<!-- svelte-ignore a11y_img_redundant_alt -->
		<img src={block.image} alt={svedit.entry_session.get([...path, 'title'])[0]} />
	</div>
	<div class="caption">
		<!-- ATTENTION: Do not format the following lines, as whitespace will mess up contenteditable -->
		<Text class="heading2" path={[...path, 'title']} editable={block.editable} />
		<Text class="body" path={[...path, 'description']} editable={block.editable} />
	</div>
</div>

<div
	class:hidden={!block.classes.includes('icon')}
	class:grid={block.classes.includes('icon')}
	class="story-block layout-{block.layout} {block.classes} svg-icon mx-auto w-full max-w-screen-md border-b-2 border-green-700 px-6"
	data-path={path.join('.')}
	data-type="block"
	data-index={path.at(-1)}
	style="anchor-name: --{path.join('-')};"
>
	<div class="non-text-content w-1/2 overflow-hidden text-green-800" contenteditable="false">
		<!-- svelte-ignore a11y_img_redundant_alt -->
		<div class="w-1/2">
			{#if block.image.indexOf('values') > -1}
				<IconValues />
			{:else if block.image.indexOf('mission') > -1}
				<IconMission />
			{:else if block.image.indexOf('vision') > -1}
				<IconVision />
			{:else}
				<svg fill="currentColor">
					<use href={block.image}></use>
				</svg>
			{/if}
		</div>
	</div>
	<div class="caption">
		<!-- ATTENTION: Do not format the following lines, as whitespace will mess up contenteditable -->
		<Text class="heading2" path={[...path, 'title']} editable={block.editable} />
		<Text class="body" path={[...path, 'description']} editable={block.editable} />
	</div>
</div>

<style>
	@reference '../app.css'
	.story-block {
		container-type: inline-size;
		grid-template-columns: 1fr;
		/* Apply padding on the sides of the block, but only on devices that need it, e.g. iPhone with notch */
		/* Learn more about this technique here: https://kulturbanause.de/blog/websites-fuer-das-iphone-x-optimieren-weisse-balken-entfernen-viewport-anpassen-safe-area-festlegen/ */
		/* padding-inline-start: max(var(--s-10), env(safe-area-inset-left, 0px));
    padding-inline-end: max(var(--s-10), env(safe-area-inset-right, 0px)); */
		padding-block-start: max(var(--s-10), env(safe-area-inset-top, 0px));
		padding-block-end: max(var(--s-10), env(safe-area-inset-bottom, 0px));
		@media (min-width: 768px) {
			grid-template-columns: 1fr 1fr;
		}
		gap: var(--s-10);
	}
	.story-block img {
		width: 100%;
		height: auto;
	}
	.story-block svg {
		width: 100%;
		height: auto;
	}
	/* Don't crop SVGs */
	.story-block img[src*='.svg'] {
		object-fit: contain;
		object-position: center;
	}

	.non-text-content {
		/* for now ignore clicks on the image, until we have non-text selections */
		pointer-events: none;
		display: flex;
		align-items: center;
		justify-content: center;
		min-width: 340px;
		@media (max-width: 768px) {
			min-width: 100%;
		}
	}

	/* Layout styles */
	.story-block.layout-2,
	.story-block.layout-1 {
		align-items: center;
	}

	@container (min-width: 768px) {
		/* on mobile display image on top of text */
		.story-block.layout-2 > div:first-child {
			order: 2;
		}
		.story-block.layout-2 > div:last-child {
			order: 1;
		}
	}

	.story-block.layout-3 > div:first-child {
		grid-column: 1 / 3;
		grid-row: 1 / 2;
	}

	.story-block.layout-3 > div:last-child {
		grid-column: 1 / 3;
		grid-row: 2 / 3;
	}

	.accented {
		@apply bg-[--accented] px-8;
	}

	/* svg {
		//color: var(--icon-color, var(--primary-text-color));
		fill: red;
		user-select: none;
		object-fit: contain;
		object-position: center;
		width: var(--icon-size, 20px);
		height: var(--icon-size, 20px);
	} */
</style>
