<script lang="ts">
	import Nav from './Nav.svelte';
	let { children, data } = $props();
</script>

<Nav user={data.user} url={data.url} socials={data.socials}>
	{@render children()}
</Nav>
