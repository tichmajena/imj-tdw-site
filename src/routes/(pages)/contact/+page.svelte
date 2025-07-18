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
	import Field from '$src/lib/components/Field.svelte';
	import TextArea from '$src/lib/components/TextArea.svelte';
	import Socials from '$src/routes/Socials.svelte';
	import Mail from '$icons/IconMail.svelte';
	import Telephone from '$icons/IconPhone.svelte';
	import Location from '$icons/IconMap.svelte';
	import Clock from '$icons/IconClock.svelte';
	import { slide } from 'svelte/transition';
	import { onMount, tick } from 'svelte';
	import { enhance } from '$app/forms';
	import Email from '$src/lib/components/Email.svelte';

	let { data, form }: { data: PageData; form: any } = $props();
	let entry_session = new EntrySession(data.entry);

	const siteUrl = 'https://troikadesignworkshop.com';
	const img1 = siteUrl + '/images/seo/logo-16x9.jpg';
	const img2 = siteUrl + '/images/seo/logo-4x3.jpg';
	const img3 = siteUrl + '/images/seo/logo-1x1.jpg';
	const siteTitle = 'Troika Design Workshop';
	const metaTitle = 'Contact Us';
	const metadescription = '';

	let sending = $state(false);

	async function handleSend() {
		sending = true;
		return async ({ update }) => {
			await update();
			sending = false;
		};
	}
</script>

<!-- <OpenGraph
	{siteTitle}
	{metadescription}
	{siteUrl}
	pageTitle={metaTitle}
	image={{ url: img1, alt: '' }}
	squareImage={{ url: img3, alt: '' }}
	ogLanguage={'en-ZW'}
/> -->
<svelte:head>
	<meta charset="utf-8" />
	<meta name="description" content="Get in touch with us for business." />
	<!-- <meta
		name="google-site-verification"
		content="+nxGUDJ4QpAZ5l9Bsjdi102tLVC21AIh5d1Nl23908vVuFHs34="
	/> -->
	<title>{entry_session.get(['title'])}</title>
	<!-- <meta name="robots" content="noindex,nofollow" /> -->
</svelte:head>
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
					element="p"
					path={['subtitle']}
					class="text-xl font-thin md:text-4xl"
				/>
			</div>
		</div>
	</Svedit>

	<div class="w-full pt-6 pb-20">
		<div
			class="container mx-auto flex flex-col-reverse space-y-6 px-5 md:flex-row md:space-y-0 md:space-x-12 lg:space-x-20"
		>
			<div class="w-full md:w-2/3">
				{#key form}
					<form use:enhance={handleSend} method="POST">
						<Field
							--label-bg-dark="#161515"
							--label-bg-light="white"
							required
							{form}
							value={form?.fields?.['name'] || ''}
							label="Your Name"
							name="name"
							id="name"
						></Field>
						<Email
							--label-bg-dark="#161515"
							--label-bg-light="white"
							required
							{form}
							value={form?.fields?.['email'] || ''}
							label="Email Address"
							name="email"
							id="email"
						></Email>
						<TextArea
							--label-bg-dark="#161515"
							--label-bg-light="white"
							required
							{form}
							value={form?.fields?.['message'] || ''}
							label="Message"
							name="message"
							id="message"
						></TextArea>
						{#if form && form.success === true}
							<div
								transition:slide
								class=" border-success content-success bg-success-content text-success my-6 rounded-lg border-2 p-8 text-center text-xl"
							>
								Message sent successfully!
							</div>
						{:else if form && form.success === false}
							<div
								transition:slide
								class=" border-error content-error bg-error-content text-error my-6 rounded-lg border-2 p-8 text-center text-xl"
							>
								<span class="flex items-center justify-center"
									><svg
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
										stroke-width="1.5"
										stroke="currentColor"
										class="-mt-1 mr-4 size-8"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"
										/>
									</svg>
									<span> An error has occurred. </span>
								</span>
							</div>
						{/if}
						<button
							class="btn btn-xl btn-primary btn-outline rounded-none font-thin hover:bg-stone-900"
						>
							<span>Send</span>
							{#if sending}
								<span class="loading loading-spinner"></span>
							{:else}
								<svg
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									stroke-width="1.5"
									stroke="currentColor"
									class="size-6"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
									/>
								</svg>
							{/if}
						</button>
					</form>
				{/key}
			</div>

			<div class="flex w-full flex-col md:w-1/3 lg:w-1/2">
				<div class="flex w-fit flex-row space-x-4">
					<div class="w-6">
						<Location />
					</div>
					<div class="mx-2 text-lg">
						<a
							href="https://maps.app.goo.gl/9y9DfyKFjgNxtzbdA"
							target="_blank"
							class="text-base-content no-underline"
							rel="noreferrer"
						>
							9 Maiden Drive,<br />Newlands,<br /> Harare, Zimbabwe
						</a>
					</div>
				</div>
				<div class="flex w-fit flex-row space-x-4">
					<div class="w-6">
						<Telephone />
					</div>
					<div class="mx-2 text-lg">
						<a class="text-base-content no-underline" href="tel:+263 8677 008 490">
							+263 8677 008 490
						</a><br />
					</div>
				</div>
				<div class="flex w-fit flex-row space-x-4">
					<div class="w-6">
						<Mail />
					</div>
					<div class="mx-2 text-lg">
						<a class="text-base-content no-underline" href="mailto:info@troikadesignworkshop.com">
							info@troikadesignworkshop.com
						</a>
					</div>
				</div>
				<div class="flex w-fit flex-row space-x-4">
					<div class="w-6">
						<Clock />
					</div>
					<div class="mx-2 text-lg">
						<div class="text-base-content">Mon-Fri 8:00 AM - 5:00 PM</div>
						<div class="text-base-content">Closed on public holidays.</div>
					</div>
				</div>
				<div class="mt-6 flex">
					<Socials></Socials>
				</div>
			</div>
		</div>
	</div>
</div>
