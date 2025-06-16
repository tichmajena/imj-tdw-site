<script lang="ts">
	import { formatFileSize } from '$src/lib/js/utils';
	import { slide } from 'svelte/transition';
	import type { PageData } from './$types';
	import placeholder from '$lib/assets/placeholder-3.png';
	import Field from '$src/lib/components/Field.svelte';
	import TextArea from '$src/lib/components/TextArea.svelte';

	let { data, form }: { data: PageData; form: any } = $props();

	let members = $state(data.members.map((eachMember: Team) => ({ ...eachMember, edit: false })));
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

				<label for="image">Image</label><input
					id="image"
					name="image"
					class="file-input file-input-primary mb-3 w-full rounded-none"
					type="file"
				/>

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

		<div class="grid-col-1 grid h-screen w-full gap-4 overflow-auto p-3 md:w-1/2 lg:grid-cols-2">
			{#each members as team, i}
				{@render memberCard(team, i)}
			{:else}
				Database is empty
			{/each}
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
						class="flex flex-col"
						action="?/update"
						method="POST"
						enctype="multipart/form-data"
					>
						<h2 class="mb-4 text-2xl">Edit Member</h2>

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
						<label for="image">Image</label><input
							id="image"
							name="image"
							class="file-input file-input-primary mb-3 w-full"
							type="file"
						/>
						<label for="bio">Bio</label><textarea
							id="bio"
							name="bio"
							class="textarea textarea-primary mb-3 w-full"
							placeholder="Bio"
							value={team.content}
						></textarea>
						<button class="btn btn-secondary">Update</button>
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
