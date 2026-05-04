<script lang="ts">
	import Analytics from '$lib/components/Analytics.svelte';
	import Nav from './Nav.svelte';
	let { children, data } = $props();
</script>

<Analytics />
<Nav url={data.url} socials={data.socials}>
	{@render children()}
</Nav>
