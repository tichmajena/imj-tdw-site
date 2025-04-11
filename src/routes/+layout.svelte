<script lang="ts">
	import '$src/app.css';
	import '$lib/styles/spacing.css';
	import '$lib/styles/colors.css';
	import '$lib/styles/shadows.css';
	import '@fontsource/roboto/200.css';
	import '@fontsource/roboto/300.css';
	import '@fontsource/roboto/400.css';
	import '@fontsource/roboto/700.css';
	let { children, data } = $props();
</script>

{@render children()}
