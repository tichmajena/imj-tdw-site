<script lang="ts">
	import Text from '$lib/Text.svelte';
	import StoryBlock from '$lib/StoryBlock.svelte';
	import ListBlock from '$lib/ListBlock.svelte';
	import UnknownBlock from '$lib/UnknownBlock.svelte';
	import Container from '$lib/Container.svelte';
	import Svedit from '$lib/Svedit.svelte';
	import EntrySession from '$lib/EntrySession.svelte';
	import TextToolBar from '$lib/TextToolBar.svelte';
	import { getContext } from 'svelte';
	import Icon from '$lib/Icon.svelte';
	import { fade, slide } from 'svelte/transition';
	import ArtworkImage from '$lib/components/ArtworkImage.svelte';
	import Gallery from '$lib/components/Gallery.svelte';
	import SliderTest from '$lib/components/SliderTest.svelte';
	import BlockTest from '$lib/components/BlockTest.svelte';
	import ViewTransition from '$lib/components/ViewTransition.svelte';
	import BrandBlock from '$lib/BrandBlock.svelte';
	import StoryList from '$lib/StoryList.svelte';
	import SEO from './SEO.svelte';
	import OpenGraph from '$lib/components/OpenGraph.svelte';
	import { dev } from '$app/environment';
	// import HeroSlide from '$lib/components/HeroSlide.svelte';
	import StoryVideo from '$lib/StoryVideo.svelte';
	import ProjectCard from '$lib/cards/ProjectCard.svelte';
	import heroImage from '$lib/assets/tdw-landing.jpg?enhanced';

	let { data } = $props();
	let page_json = $state(data.entry);
	let showLightbox = $state(false);
	let lightboxStart = $state(-1);
	let Uploader: UploaderClass = $state();

	let entry_session = new EntrySession(page_json);
	let galleryTab = 'aws';

	let modals = $state(false);
	let row = $state(false);

	const siteUrl = 'https://www.troikadesignworkshop.net';
	const img1 = siteUrl + '/images/seo/logo-16x9.jpg';
	const img2 = siteUrl + '/images/seo/logo-4x3.jpg';
	const img3 = siteUrl + '/images/seo/logo-1x1.jpg';
	const siteTitle = 'Troika Design Workshop';
	const metaTitle = 'Troika Design Workshop - Delivering the future of the built environment';
	const metadescription =
		'We are a collective of diverse paths imbued with rich architectural perspectives. Everything we design and bring to life is greatly informed by our relentless pursuit of delivering the futur of the built environment. It is this desire and drive that anchors TDW to excell.';
	const telephone = '+263 8677 111 484';
	const facebookPage = data.socials.facebook;
	const twitterHandle = data.socials.x;
	const linkedinProfile = data.socials.linkedin;
	const address = {
		street: '1 Princess Drive',
		city: 'Newlands',
		region: 'Harare',
		country: 'Zimbabwe'
	};
</script>

<OpenGraph
	{siteTitle}
	{metadescription}
	{siteUrl}
	pageTitle={metaTitle}
	image={{ url: img1, alt: '' }}
	squareImage={{ url: img3, alt: '' }}
	ogLanguage={'en-ZW'}
/>
<SEO
	{siteUrl}
	{siteTitle}
	services={[]}
	branches={[]}
	{metadescription}
	{metaTitle}
	images={[img1, img2, img3]}
	{telephone}
	{facebookPage}
	{twitterHandle}
	{address}
	{linkedinProfile}
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
	<h1 class="sr-only">Troika Design Workshop</h1>
	{#if data.user.exists}
		<TextToolBar {entry_session} />
	{/if}

	<div class="relative mx-auto h-screen w-full overflow-hidden">
		<!-- <img
			src="{data.cloudfront}/fit-in/1920x0/tdw-landing.jpg?webp"
			class="h-full w-full object-cover object-top"
			alt=""
		/> -->
		<picture class="h-full w-full object-center">
			<source
				srcset="
			{data.cloudfront}/fit-in/1920x0/tdw-landing.jpg?webp 1920w,
			{data.cloudfront}/fit-in/1440x0/tdw-landing.jpg?webp 1440w,
			{data.cloudfront}/fit-in/1024x0/tdw-landing.jpg?webp 1024w"
				media="(min-width: 1024px)"
			/>
			<source
				srcset="
			{data.cloudfront}/fit-in/768x0/tdw-landing.jpg?webp 768w,
			{data.cloudfront}/fit-in/480x0/tdw-landing.jpg?webp 480w"
				media="(max-width: 1023px)"
			/>
			<img
				class="h-full w-full object-cover object-[65%_100%] md:object-center"
				src="{data.cloudfront}/fit-in/768x0/tdw-landing.jpg?webp"
				alt="Troika Design Workshop"
			/>
		</picture>
		<div class="absolute inset-0 bg-black/60"></div>
		<div class="absolute bottom-0 w-full">
			<h2 class="container mx-auto mb-40 px-5 text-4xl font-thin text-white md:text-6xl">
				committed to delivering<br />the <span transition:fade class="font-bold">futur</span> of the
				built<br />environment
			</h2>
		</div>
	</div>

	<!-- <div class="container mx-auto flex w-full justify-center overflow-hidden">
		<video muted autoplay loop disablepictureinpicture>
			<source
				src="https://sdcdc213s.cloudfront.net/video-bg-1_10-720.mp4"
				type="video/mp4"
			/>
		</video>
	</div> -->

	<!-- <HeroSlide
		slides={[
			{
				title: 'Fresh Produce',
				description: 'Certified healthy fruits and vegetables in quality packaging.',
				slug: 'duravit',
				image: packhouse_img
			},
			{
				title: 'Packhouse',
				description: 'Certified healthy fruits and vegetables in quality packaging.',
				slug: 'about',
				image: packhouse_img
			},
			{
				title: 'Outgrower Programs',
				description: 'Great stuff',
				slug: 'about',
				image: packhouse_img
			},
			{
				title: 'Development Programs Programs',
				description: 'Great stuff',
				slug: 'about',
				image: packhouse_img
			}
		]}
	/> -->

	<!-- <pre class="text-xs text-lime-500">
  
          {JSON.stringify(page_json, null, 2)}
      </pre> -->

	<Svedit {entry_session} editable={data.user.exists === true} class="flex-column">
		<!-- <div class="flex-column container mx-auto w-full gap-y-10 p-10">
        <div class="flex-row flex-wrap items-center gap-5">
          <Text path={['title']} class="heading1 m-0" />
          <a
            class="github-button"
            href="https://github.com/michael/svedit"
            data-color-scheme="no-preference: light; light: light; dark: dark;"
            data-size="large"
            data-show-count="true"
            aria-label="Star michael/svedit on GitHub">Star</a
          >
        </div>
        <Text path={['subtitle']} class="heading3" />
      </div> -->
		<!-- NOTE: non-editable island must have contenteditable="false" and contain some text content, otherwise invalid selections occur. -->
		<div class="container mx-auto px-5 py-10">
			<div class="w-full md:w-2/3">
				<Text
					editable={data.user.exists === true}
					element="h2"
					path={['title']}
					class="mb-4 text-3xl font-thin md:text-4xl"
				/>
				<!-- <Text path={['subtitle']} class="text-xl md:text-2xl" />-->
			</div>
		</div>
		<!-- <Container class="body flex-column gap-y-10" path={['body']}>
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
				{:else}
					<UnknownBlock {block} {path} />
				{/if}
			{/snippet}
		</Container>-->
		<!--<div contenteditable="false" class="container mx-auto pt-20">

			<div class="mx-auto w-2/3">
				<div class="mb-4 text-center text-3xl font-bold text-green-800 md:text-4xl">Heading</div>
				<div path={['subtitle']} class="text-center text-xl text-green-800 md:text-2xl">
					This is text under the heading
				</div>
			</div>
		</div>-->
	</Svedit>
	<!-- <div class="relative container mx-auto mb-20 overflow-hidden px-5">
		<div class="grid w-full grid-cols-1 gap-6 md:grid-cols-2">
			{#await data.projects}
				{#each { length: 3 } as _}
					<div class="aspect-[4/3] w-full animate-pulse bg-gray-600"></div>
				{/each}
			{:then projects_}
				{#each projects_ as project}
					<ProjectCard {project}></ProjectCard>
				{/each}
			{/await}
		</div>
	</div> -->
	<div class="relative container mx-auto mb-20 overflow-hidden px-5">
		<div class="grid w-full grid-cols-1 gap-6 md:grid-cols-2">
			{#each data.projects as project}
				<ProjectCard {project}></ProjectCard>
			{/each}
		</div>
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
