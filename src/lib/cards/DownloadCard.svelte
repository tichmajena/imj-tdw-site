<script>
	let { resource } = $props();
</script>

<a href={resource.url}>
	<div
		class="relative aspect-[3/3.6] w-full border-2 border-slate-600 transition-all duration-400 hover:bg-stone-300"
	>
		<div
			class="absolute bottom-[10%] left-[10%] flex aspect-[3/4] w-1/4 flex-col items-center justify-end border-b-2 border-slate-600 pb-4 text-slate-600"
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
	<div class="mt-3">{resource.title}</div>
</a>
