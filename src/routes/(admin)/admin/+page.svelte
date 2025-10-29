<script lang="ts">
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	import { browser } from '$app/environment';
	import Field from '$src/lib/components/Field.svelte';
	import Password from '$src/lib/components/Password.svelte';
	import Email from '$src/lib/components/Email.svelte';
	import { slide } from 'svelte/transition';

	let email = $state('');
	let password = $state('');
	let confirmPassword = $state('');
	let username = $state('');
	let signupForm = $state(false);
	let error = $state(false);
	let errorMessage = $state('An error occured.');
	let loading = $state(false);

	async function login() {
		if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
			error = true;
			loading = false;
			errorMessage = 'Please enter a valid email address.';
			return;
		}
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

		if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
			error = true;
			loading = false;
			errorMessage = 'Please enter a valid email address.';
			return;
		}

		if (password.length < 8) {
			error = true;
			loading = false;
			errorMessage = 'Password should be 8 characters or more.';
			return;
		}

		if (confirmPassword !== password) {
			error = true;
			loading = false;
			errorMessage = 'Passwords do not match';
			return;
		}

		if (/\s/.test(username)) {
			error = true;
			loading = false;
			errorMessage = 'Spaces not allowed in "Username".';
			return;
		}

		if (!/^[a-zA-Z0-9]+$/.test(username)) {
			error = true;
			loading = false;
			errorMessage = 'Only letters and numbers allowed in "Username".';
			return;
		}

		const { auth } = await import('$lib/js/firebase');

		const { createUserWithEmailAndPassword, updateProfile, getIdToken } = await import(
			'firebase/auth'
		);

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
		<div class="mx-auto w-full max-w-screen-sm">
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
				<Password
					--label-bg-dark="#161515"
					--label-bg-light="white"
					bind:value={confirmPassword}
					id="confirmPassword"
					label="Confirm Password"
					name="confirmPassword"
					required
				/>
			{/if}
			{#if error}
				<div
					transition:slide
					class=" border-error content-error bg-error-content text-error my-4 rounded-lg border-2 p-4 text-center"
				>
					<span class="flex items-center justify-center"
						><svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							stroke-width="1.5"
							stroke="currentColor"
							class="-mt-1 mr-4 size-6"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"
							/>
						</svg>
						<span> {errorMessage} </span>
					</span>
				</div>
			{/if}
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
