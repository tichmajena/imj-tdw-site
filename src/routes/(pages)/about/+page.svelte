<script lang="ts">
	import type { PageData } from './$types';

	import Text from '$lib/Text.svelte';
	import StoryBlock from '$lib/StoryBlock.svelte';
	import ListBlock from '$lib/ListBlock.svelte';
	import UnknownBlock from '$lib/UnknownBlock.svelte';
	import Svedit from '$lib/Svedit.svelte';
	import Container from '$lib/Container.svelte';
	import EntrySession from '$lib/EntrySession.svelte';
	import TextToolBar from '$lib/TextToolBar.svelte';
	import { getContext } from 'svelte';
	import Icon from '$lib/Icon.svelte';
	import { slide } from 'svelte/transition';
	import ArtworkImage from '$lib/components/ArtworkImage.svelte';
	import Gallery from '$lib/components/Gallery.svelte';
	import SliderTest from '$lib/components/SliderTest.svelte';
	import BlockTest from '$lib/components/BlockTest.svelte';
	import ViewTransition from '$lib/components/ViewTransition.svelte';
	import BrandBlock from '$lib/BrandBlock.svelte';
	import StoryList from '$lib/StoryList.svelte';
	// import SEO from './SEO.svelte';
	import OpenGraph from '$lib/components/OpenGraph.svelte';
	import { dev } from '$app/environment';
	// import HeroSlide from '$lib/components/HeroSlide.svelte';
	import StoryVideo from '$lib/StoryVideo.svelte';
	import TeamCard from '$src/lib/cards/TeamCard.svelte';

	let { data }: { data: PageDate } = $props();
	let page_json = $state(data.entry);
	let showLightbox = $state(false);
	let lightboxStart = $state(-1);
	let Uploader;

	let entry_session = new EntrySession(page_json);
	let galleryTab = 'aws';

	let modals = $state(false);
	let row = $state(false);

	const siteUrl = 'https://troikadesignworkshop.com';
	const img1 = siteUrl + '/images/seo/logo-16x9.jpg';
	const img2 = siteUrl + '/images/seo/logo-4x3.jpg';
	const img3 = siteUrl + '/images/seo/logo-1x1.jpg';
	const siteTitle = 'Troika Design Workshop';
	const metaTitle = 'About Us';
	const metadescription = '';
</script>

<svelte:head>
	<meta charset="utf-8" />
	<meta name="description" content={metadescription} />
	<!-- <meta
		name="google-site-verification"
		content="+nxGUDJ4QpAZ5l9Bsjdi102tLVC21AIh5d1Nl23908vVuFHs34="
	/> -->
	<title>{metaTitle}</title>
	<!-- <meta name="robots" content="noindex,nofollow" /> -->
</svelte:head>

<OpenGraph
	{siteTitle}
	{metadescription}
	{siteUrl}
	pageTitle={metaTitle}
	image={{ url: img1, alt: '' }}
	squareImage={{ url: img3, alt: '' }}
	ogLanguage={'en-ZW'}
/>

<!-- <ViewTransition></ViewTransition> -->
{#if showLightbox}
	<SliderTest
		startAt={lightboxStart}
		close={() => {
			document.startViewTransition(() => {
				showLightbox = false;
				lightboxStart = -1;
			});
		}}
	/>
{/if}
<div class="demo-wrapper">
	{#if dev}
		<TextToolBar {entry_session} />
	{/if}

	<Svedit {entry_session} editable={dev} class="flex-column">
		<!-- <div class="flex-column container mx-auto w-full gap-y-10 p-10">
       
        <Text path={['subtitle']} class="heading3" />
      </div> -->
		<!-- NOTE: non-editable island must have contenteditable="false" and contain some text content, otherwise invalid selections occur. -->
		<div class="container mx-auto px-5 py-10">
			<div class="w-full md:w-2/3">
				<Text path={['title']} class="mb-4 text-3xl font-thin md:text-6xl" />
				<Text path={['subtitle']} class="text-xl font-thin md:text-4xl" />
			</div>
		</div>
		<Container class="body flex-column gap-y-10" path={['body']}>
			{#snippet block(block, path)}
				{#if block.type === 'story'}
					<StoryBlock {block} {path} />
				{:else if block.type === 'story_list'}
					<StoryList {block} {path} />
				{:else if block.type === 'story_video'}
					<StoryVideo {block} {path} />
				{:else if block.type === 'brand'}
					<BrandBlock {block} {path} />
				{:else if block.type === 'lightbox_grid'}
					<BlockTest {block} {path} />
				{:else if block.type === 'list'}
					<ListBlock {block} {path} />
				{:else if block.type === 'text'}
					<Text {path} class="heading1 m-0" />
				{/if}
			{/snippet}
		</Container>
	</Svedit>
	<div class=" grid-col-1 container mx-auto mb-20 grid gap-4 px-5 md:grid-cols-3 lg:grid-cols-4">
		{#each data.teamData as member}
			<TeamCard {member}></TeamCard>
		{/each}
	</div>
	<!-- <button onclick={test} class="btn">Test</button>
  
      <hr />
  
      <div class="flex-column mx-auto my-10 w-full max-w-screen-lg gap-y-2">
          <p>Selection:</p>
          <pre class="debug-info p-4">{JSON.stringify(entry_session.selection || {}, null, '  ')}</pre>
          <p>Entry:</p>
          <pre class="debug-info p-4">{JSON.stringify(entry_session.entry, null, '  ')}</pre>
      </div> -->
</div>

<style>
	.demo-wrapper {
		/* no paddings or margins here on the body, so Blocks can use the full width (edge to edge layouts) */
	}
	.debug-info {
		text-wrap: wrap;
		height: 12lh;
		overflow-y: auto;
		color: white;
		background: var(--primary-fill-color);
		font-size: 12px;
	}
</style>
