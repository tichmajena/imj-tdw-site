<script lang="ts">
	import ProjectCard from '$lib/cards/ProjectCard.svelte';
	import type { PageData } from './$types';
	//import Container from '$lib/Container.svelte';
	import Svedit from '$lib/Svedit.svelte';
	import EntrySession from '$lib/EntrySession.svelte';
	import TextToolBar from '$lib/TextToolBar.svelte';
	import { dev } from '$app/environment';
	import Text from '$src/lib/Text.svelte';
	import OpenGraph from '$src/lib/components/OpenGraph.svelte';

	let { data }: { data: PageData } = $props();
	let entry_session = new EntrySession(data.entry);

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

<div class="demo-wrapper">
	{#if dev}
		<TextToolBar {entry_session} />
	{/if}
	<Svedit {entry_session} editable={dev} class="flex-column">
		<div class="container mx-auto px-5 py-10">
			<div class="w-full md:w-2/3">
				<Text path={['title']} class="mb-4 text-3xl font-thin md:text-6xl" />
				<Text path={['subtitle']} class="text-xl font-thin md:text-4xl" />
			</div>
		</div>
	</Svedit>

	<div class="w-full pt-6 pb-20">
		<div class="container mx-auto flex flex-col space-x-6 md:flex-row">
			<!-- {#each data.projectData as project}
				<ProjectCard {project}></ProjectCard>
			{/each} -->
		</div>
	</div>
</div>
