<script lang="ts">
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<div class="w-full">
	<div class="container mx-auto">
		<h1 class="my-6 text-3xl font-bold">
			{data.project.title}
		</h1>
		<p>
			{data.project.description}
		</p>
	</div>
</div>
