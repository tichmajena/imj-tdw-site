<script>
	import { page } from '$app/state';

	let { resource = { url: '/downloads', title: 'Sample Title' } } = $props();
	let url = resource.type === 'file' ? `/downloads/file/${resource.file}` : resource.url;
</script>

<a href={url}>
	{#if resource.type === 'image'}
		<div class="group relative aspect-[735/1000] w-full transition-all duration-400">
			<img
				src="{page.data.cloudfront}/fit-in/300x500/{resource.file}"
				alt=""
				class="absolute h-full bg-black object-contain object-left"
			/>
			<div
				class="absolute inset-0 flex items-center justify-center bg-black/0 transition-all duration-400 group-hover:bg-black/50"
			>
				<div
					class="absolute bottom-[10%] left-[10%] flex aspect-[735/1000] w-1/4 flex-col items-center justify-end border-b-2 border-white pb-4 text-white opacity-0 transition-all duration-400 group-hover:opacity-100"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="1.5"
						stroke="currentColor"
						class="size-12"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M19.5 13.5 12 21m0 0-7.5-7.5M12 21V3"
						/>
					</svg>
				</div>
			</div>
		</div>
	{:else if resource.featured_image.name}
		<div class="group relative aspect-square w-full transition-all duration-400">
			<img
				src="{page.data.cloudfront}/fit-in/600x0/{resource.featured_image.name}"
				alt={resource.title}
				class="absolute h-full bg-black object-contain object-left"
			/>
		</div>
	{:else}
		<div
			class="pdf group relative flex aspect-[3/3.6] w-full items-center justify-center border-2 border-slate-600 transition-all duration-400 hover:bg-stone-300"
		>
			<span class="pdf group-hover:pdf border-slate-600 pb-4 text-2xl text-slate-600"
				>.{resource.ext}</span
			>
			<div
				class="absolute bottom-[10%] left-[10%] flex aspect-[3/4] w-1/4 flex-col items-center justify-end border-b-2"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke-width="1.5"
					stroke="currentColor"
					class="size-12"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M19.5 13.5 12 21m0 0-7.5-7.5M12 21V3"
					/>
				</svg>
			</div>
		</div>
	{/if}
	<div class="mt-3">{resource.title}</div>
</a>

<style>
	@reference '../../app.css';

	.pdf:hover {
		@apply !border-red-700;
		@apply !text-red-700;
		@apply !bg-red-100;
	}
	.pdf:hover span {
		@apply !text-red-700;
	}
</style>
