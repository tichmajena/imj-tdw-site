<script lang="ts">
	import { formatFileSize } from '$src/lib/js/utils';
	import { slide } from 'svelte/transition';
	import type { PageData } from './$types';
	import placeholder from '$lib/assets/placeholder-3.png';
	import Field from '$src/lib/components/Field.svelte';
	import TextArea from '$src/lib/components/TextArea.svelte';
	import ArtworkImage from '$src/lib/components/ArtworkImage.svelte';
	import { flip } from 'svelte/animate';
	import { enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';

	let { data, form }: { data: PageData; form: any } = $props();

	let picBlobs = $state([]);
	let picComponent = $state();
	let currentIndex = $state();
	let currentPost = $state();

	let members = $state(
		data.members
			.sort((a, b) => a.order - b.order)
			.map((eachMember: Team) => ({
				...eachMember,
				edit: false,
				featuredBlobs: [],
				featuredComponent: undefined
			}))
	);
	let reorderList = $state([]);
	let reorder = $state(false);
	let reordering = $state(false);
	let creating = $state(false);

	async function handleEditForm({ formData, cancel }) {
		const formData_ = Object.fromEntries(formData);
		creating = true;
		console.log({ currentPost, formData_ });
		let body = {
			name: formData_.fullname,
			position: formData_.position,
			department: formData_.department,
			content: formData_.bio,
			order: formData_.order
		} as Team;

		if (currentPost.featuredBlobs.length) {
			const file = $state.snapshot(currentPost.featuredBlobs)[0];
			body = { ...body, image: file.name };

			await currentPost.featuredComponent.handleCreate();
		}
		console.log(body);

		const res = await fetch(`/api/members?id=${formData_.id}`, {
			method: 'PUT',
			body: JSON.stringify(body)
		});
		let result = await res.json();
		console.log({ result });
		cancel();
		await invalidateAll();
		return;
		return async ({ update }) => {
			await update({ reset: false });
			creating = false;
		};
	}
</script>

<div class="w-full">
	<div class="flex-co container mx-auto flex flex-col px-5 py-10 md:flex-row">
		<div class="w-full md:w-1/2">
			<form class="flex flex-col" action="?/create" method="POST" enctype="multipart/form-data">
				<h2 class="mb-4 text-2xl">Add Member</h2>
				<Field
					--label-bg-dark="#161515"
					--label-bg-light="white"
					name="fullname"
					label="Full name"
					id="fullname"
					{form}
					required
				/>
				<Field
					--label-bg-dark="#161515"
					--label-bg-light="white"
					name="position"
					label="Position"
					id="position"
					{form}
					required
				/>
				<Field
					--label-bg-dark="#161515"
					--label-bg-light="white"
					name="department"
					label="Department"
					id="department"
					{form}
				/>

				<div class="mb-8 aspect-square w-1/2 md:w-1/4">
					<ArtworkImage
						bind:blobs={picBlobs}
						maxWidth={1600}
						bind:this={picComponent}
						name="image"
						upload={false}
						label="Profile Image"
					/>
				</div>

				<TextArea
					--label-bg-dark="#161515"
					--label-bg-light="white"
					id="bio"
					name="bio"
					label="Bio"
					{form}
				/>
				<button class="btn btn-primary">Submit</button>
			</form>
		</div>
		<div class="w-full md:w-1/2">
			{#if !reorder}
				<button
					onclick={() => {
						reorderList = members;
						reorder = true;
					}}
					class="btn btn-primary btn-wide mb-4 block"
					>Reorder
				</button>
			{:else}
				<button
					onclick={() => {
						members = reorderList;
						reorder = false;
					}}
					class="btn btn-success btn-wide mb-4 block"
					>Finish Reorder
				</button>
			{/if}

			{#if reorder}
				<div class="flex flex-col space-y-3">
					{#each reorderList as team, ii (team.id)}
						<div animate:flip={{ duration: 300 }} class="">
							{@render memberCardSmall(team, ii)}
						</div>{/each}
					<button
						onclick={async () => {
							reordering = true;
							const batchSize = 10;
							const batches = [];
							for (let i = 0; i < reorderList.length; i += batchSize) {
								batches.push(reorderList.slice(i, i + batchSize));
							}
							for (const batch of batches) {
								await Promise.all(
									batch.map((member, idx) =>
										fetch(`/api/members?id=${member.id}`, {
											method: 'PUT',
											headers: { 'Content-Type': 'application/json' },
											body: JSON.stringify({ order: reorderList.indexOf(member) })
										})
									)
								);
							}

							reordering = false;
						}}
						class="btn btn-primary"
					>
						Save Order <span class:hidden={!reordering} class="loading loading-spinner"></span>
					</button>
				</div>
			{:else}<div class="grid-col-1 grid h-screen w-full gap-4 overflow-auto p-3 lg:grid-cols-2">
					{#each members as team, i}
						{@render memberCard(team, i)}
					{:else}
						Database is empty
					{/each}
				</div>
			{/if}
		</div>
	</div>
</div>

{#snippet memberCard(team: Team, i: number)}
	<div>
		<div class="card bg-base-300 w-96 shadow-sm lg:w-full">
			<figure>
				{#if team.image}
					<img src="{data.cloudfront}/{team.image}" alt={team.name} />
				{:else}
					<img src={placeholder} alt={team.name} />
				{/if}
			</figure>
			<div class="card-body">
				{#if members[i].edit === false}
					<h2 class="card-title">{team.name}</h2>
					<p>{team.position}</p>
					<p>{team.department}</p>
				{:else}
					<form
						transition:slide
						use:enhance={handleEditForm}
						class="flex flex-col"
						action="?/update"
						method="POST"
						enctype="multipart/form-data"
					>
						<h2 class="mb-4 text-2xl">Edit Member</h2>
						<input name="order" hidden type="text" value={team.order ?? i} />
						<input type="text" hidden name="id" value={team.id} />
						<label for="fullName"></label><input
							id="fullName"
							name="fullname"
							class="input input-primary mb-3 w-full"
							type="text"
							value={team.name}
							required
						/>
						<label for="position">Position</label><input
							id="position"
							name="position"
							class="input input-primary mb-3 w-full"
							type="text"
							value={team.position}
							required
						/>
						<label for="department">Department</label><input
							id="department"
							name="department"
							class="input input-primary mb-3 w-full"
							type="text"
							value={team.department}
						/>

						<div class="mb-4 aspect-square md:w-1/4">
							<ArtworkImage
								bind:blobs={team.featuredBlobs}
								maxWidth={1600}
								bind:this={team.featuredComponent}
								name="image"
								upload={false}
								label="Profile Image"
							/>
						</div>
						<label for="bio">Bio</label><textarea
							id="bio"
							name="bio"
							class="textarea textarea-primary mb-3 w-full"
							placeholder="Bio"
							value={team.content}
						></textarea>
						<button onclick={() => (currentPost = team)} class="btn btn-secondary"
							>Update <span class:hidden={creating === false} class="loading loading-spinner"
							></span>
						</button>
					</form>
				{/if}
				<div class="card-actions justify-end">
					<button onclick={() => (members[i].edit = !members[i].edit)} class="btn btn-primary">
						{members[i].edit ? 'Cancel' : 'Edit'}</button
					>
					<form action="?/deleteMember" method="POST">
						<input type="text" name="id" class="hidden" value={team.id} />
						<button class="btn btn-error">Delete</button>
					</form>
				</div>
			</div>
		</div>
	</div>
{/snippet}

{#snippet memberCardSmall(team: Team, ii: number)}
	<div class="flex items-center space-x-4">
		<div class="flex flex-col">
			<button
				type="button"
				onclick={() => {
					[reorderList[ii], reorderList[ii - 1]] = [reorderList[ii - 1], reorderList[ii]];
				}}
				aria-label="Move"
				disabled={reorderList.length === 1 || ii === 0}
				class="btn btn-info btn-xs btn-ghost"
				><svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke-width="1.5"
					stroke="currentColor"
					class="size-4"
				>
					<path stroke-linecap="round" stroke-linejoin="round" d="m4.5 15.75 7.5-7.5 7.5 7.5" />
				</svg>
			</button><button
				type="button"
				onclick={() => {
					[reorderList[ii], reorderList[ii + 1]] = [reorderList[ii + 1], reorderList[ii]];
				}}
				aria-label="Move"
				disabled={reorderList.length === 1 || ii === reorderList.length - 1}
				class="btn btn-info btn-xs btn-ghost"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke-width="1.5"
					stroke="currentColor"
					class="size-4"
				>
					<path stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
				</svg>
			</button>
		</div>
		<figure class="h-32 w-32 overflow-hidden">
			{#if team.image}
				<img src="{data.cloudfront}/fit-in/300x0/{team.image}" alt={team.name} />
			{:else}
				<img src={placeholder} alt={team.name} />
			{/if}
		</figure>
		<div>
			<h2 class="card-title">{team.name}</h2>
			<p>{team.position}</p>
			<p>{team.department}</p>
		</div>
	</div>
{/snippet}
