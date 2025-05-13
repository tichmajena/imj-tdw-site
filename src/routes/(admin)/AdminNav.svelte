<script>
	let { children } = $props();
</script>

<div class="drawer">
	<input id="my-drawer-3" type="checkbox" class="drawer-toggle" />
	<div class="drawer-content flex flex-col">
		<!-- Navbar -->
		<div class="bg-base-300 w-full">
			<div class="navbar container mx-auto w-full">
				<div class="flex-none lg:hidden">
					<label for="my-drawer-3" aria-label="open sidebar" class="btn btn-square btn-ghost">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							class="inline-block h-6 w-6 stroke-current"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M4 6h16M4 12h16M4 18h16"
							></path>
						</svg>
					</label>
				</div>
				<div class="mx-2 flex-1 px-2">Admin Dashboard</div>
				<div class="hidden flex-none lg:block">
					<ul class="menu menu-horizontal">
						<!-- Navbar menu content here -->
						<li>
							<a href="/admin/team-admin">Team</a>
						</li>
						<li>
							<a href="/admin/projects-admin">Projects</a>
						</li>
						<li>
							<a href="/admin/resources-admin">Resources</a>
						</li>
					</ul>
				</div>
			</div>
		</div>
		<!-- Page content here -->
		{@render children?.()}
	</div>
	<div class="drawer-side">
		<label for="my-drawer-3" aria-label="close sidebar" class="drawer-overlay"></label>
		<ul class="menu bg-base-200 min-h-full w-80 p-4">
			<!-- Sidebar content here -->
			<li>
				<a href="/admin/team-admin">Team</a>
			</li>
			<li>
				<a href="/admin/projects-admin">Projects</a>
			</li>
			<li>
				<a href="/admin/resources-admin">Resources</a>
			</li>
		</ul>
	</div>
</div>
