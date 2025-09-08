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
	let signupForm = $state(false);
	let error = $state(true);
	let loading = $state(false);

	async function login() {
		loading = true;
		const { auth } = await import('$lib/js/firebase');
		const { signInWithEmailAndPassword } = await import('firebase/auth');
		try {
			const userCredential = await signInWithEmailAndPassword(auth, email, password);
			const idToken = userCredential._tokenResponse.idToken;
			let res = await fetch('/auth', { method: 'POST', body: JSON.stringify({ idToken }) });
			loading = false;
			if (browser) window.location.replace('/admin');
		} catch (err) {
			loading = false;
			console.error(err);
			error = true;
		}
	}

	async function signup() {
		loading = true;
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
			loading = false;
			if (browser) window.location.replace('/admin');
		} catch (err) {
			console.error(err);
			loading = false;
			error = true;
		}
	}
</script>

<!-- <pre>{JSON.stringify(data, null, 2)}</pre> -->
<div class="flex min-h-[50vh] w-full items-center justify-center">
	{#if !data.user?.exists || signupForm}
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
			{#if signupForm}
				<Field
					--label-bg-dark="#161515"
					--label-bg-light="white"
					bind:value={username}
					id="username"
					label="Username"
					name="username"
					required
				/>
			{/if}
			<Password
				--label-bg-dark="#161515"
				--label-bg-light="white"
				bind:value={password}
				id="password"
				label="Password"
				name="password"
				required
			/>
			{#if signupForm}
				<div class="flex flex-col">
					<button onclick={signup} class="btn btn-primary mb-4"
						>{#if loading}Registering...<span class="loading loading-spinner"
							></span>{:else}Register{/if}
					</button>
					<button onclick={() => (signupForm = false)} class="btn btn-sm btn-link btn-ghost"
						>Already have an Account? Login</button
					>
				</div>
			{:else}
				<div class="flex flex-col">
					<button onclick={login} class="btn btn-primary mb-4"
						>{#if loading}Logging in...<span class="loading loading-spinner"
							></span>{:else}Login{/if}</button
					>
				</div>
			{/if}
		</div>
	{:else}
		<div class="text-center text-2xl">
			<div>Select Collection to edit from Admin menu</div>

			<button onclick={() => (signupForm = true)} class="btn btn-sm btn-ghost btn-link"
				>Register new Account</button
			>
		</div>
	{/if}
</div>
