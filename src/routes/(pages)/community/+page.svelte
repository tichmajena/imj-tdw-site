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

	let projects = data.projectData.sort((a, b) => b.year - a.year);
</script>

<svelte:head>
	<meta charset="utf-8" />
	<meta name="description" content={entry_session.get(['subtitle'])} />
	<!-- <meta
		name="google-site-verification"
		content="+nxGUDJ4QpAZ5l9Bsjdi102tLVC21AIh5d1Nl23908vVuFHs34="
	/> -->
	<title>{entry_session.get(['title'])}</title>
	<!-- <meta name="robots" content="noindex,nofollow" /> -->
</svelte:head>

<!-- <OpenGraph
	{siteTitle}
	{metadescription}
	{siteUrl}
	pageTitle={metaTitle}
	image={{ url: img1, alt: '' }}
	squareImage={{ url: img3, alt: '' }}
	ogLanguage={'en-ZW'}
/> -->

<div class="demo-wrapper">
	{#if data.user.exists === true}
		<TextToolBar {entry_session} />
	{/if}
	<Svedit {entry_session} editable={data.user.exists === true} class="flex-column">
		<div class="container mx-auto px-5 py-10">
			<div class="w-full md:w-2/3">
				<Text
					editable={data.user.exists === true}
					element="h1"
					path={['title']}
					class="mb-4 text-3xl font-thin md:text-6xl"
				/>
				<Text
					editable={data.user.exists === true}
					path={['subtitle']}
					element="p"
					class="text-xl font-thin md:text-4xl"
				/>
			</div>
		</div>
	</Svedit>

	<div class="w-full pt-6 pb-20">
		<div class="container mx-auto grid w-full grid-cols-1 gap-6 px-5 md:grid-cols-2">
			{#each projects as project}
				<ProjectCard {project}></ProjectCard>
			{/each}
		</div>
	</div>
</div>
