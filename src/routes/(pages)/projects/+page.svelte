<script lang="ts">
	import ProjectCard from '$src/lib/cards/ProjectCard.svelte';
	import type { PageData } from './$types';
	//import Container from '$lib/Container.svelte';
	import Svedit from '$lib/Svedit.svelte';
	import EntrySession from '$lib/EntrySession.svelte';
	import TextToolBar from '$lib/TextToolBar.svelte';
	import { dev } from '$app/environment';
	import Text from '$src/lib/Text.svelte';

	let { data }: { data: PageData } = $props();
	let entry_session = new EntrySession(data.entry);
</script>

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

	<div class="w-full px-5 pt-6 pb-20">
		<div class="container mx-auto grid w-full grid-cols-1 gap-6 md:grid-cols-3">
			{#each data.projectData as project}
				<ProjectCard {project}></ProjectCard>
			{/each}
		</div>
	</div>
</div>
