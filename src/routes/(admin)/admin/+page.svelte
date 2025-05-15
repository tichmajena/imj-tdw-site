<script lang="ts">
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	import { browser } from '$app/environment';
	import Field from '$src/lib/components/Field.svelte';
	import Password from '$src/lib/components/Password.svelte';
	import Email from '$src/lib/components/Email.svelte';

	let email = $state('');
	let password = $state('');
	let username = $state('');
	let error = $state(false);

	async function login() {
		const { auth } = await import('$lib/js/firebase');
		const { signInWithEmailAndPassword } = await import('firebase/auth');
		try {
			const userCredential = await signInWithEmailAndPassword(auth, email, password);
			const idToken = userCredential._tokenResponse.idToken;
			let res = await fetch('/auth', { method: 'POST', body: JSON.stringify({ idToken }) });
			if (browser) window.location.replace('/admin');
		} catch (error) {
			console.error(error);
		}
	}

	async function signup() {
		const { auth } = (await import('$lib/js/firebase')).default;

		const { createUserWithEmailAndPassword, updateProfile, getIdToken } = (
			await import('firebase/auth')
		).default;

		try {
			const userRecord = await createUserWithEmailAndPassword(auth, email, password);

			await updateProfile(userRecord.user, { displayName: username });

			const idToken = await getIdToken(userRecord.user, true);
			await fetch('/auth', {
				method: 'POST',
				body: JSON.stringify({ idToken })
			});
			if (browser) window.location.replace('/admin');
		} catch (error) {
			console.error(error);
		}
	}
</script>

<!-- <pre>{JSON.stringify(data, null, 2)}</pre> -->
<div class="flex min-h-[50vh] w-full items-center justify-center">
	{#if !data.user?.exists}
		<div class="mx-auto max-w-screen-md">
			<h2 class="mb-4 text-2xl">Login</h2>
			<Email
				--label-bg-dark="#161515"
				--label-bg-light="white"
				bind:value={email}
				id="email"
				label="Email"
				name="email"
				required
			/>
			<!-- <Field bind:value={username} id="username" label="Username" name="username" required /> -->
			<Password
				--label-bg-dark="#161515"
				--label-bg-light="white"
				bind:value={password}
				id="password"
				label="Password"
				name="password"
				required
			/>
			<button onclick={login} class="btn btn-primary">Login</button>
			<!-- <button onclick={signup} class="btn btn-primary">Register</button> -->
		</div>
	{:else}
		<div class="text-center text-2xl">Select Collection to edit from menu</div>
	{/if}
</div>
