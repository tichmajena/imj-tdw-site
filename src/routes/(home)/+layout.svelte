<script lang="ts">
	import Nav from './Nav.svelte';
	let { children, data } = $props();
</script>

<Nav url={data.url} socials={data.socials}>
	{@render children()}
</Nav>
