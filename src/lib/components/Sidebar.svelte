<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import type { RouteId } from '$app/types';

	const items: { href: RouteId; label: string }[] = [
		{ href: '/(dashboard)/claim-list', label: 'Claim List' },
		{ href: '/(dashboard)/admin', label: 'Admin' }
	];

	let loggingOut = $state(false);

	function isActive(href: RouteId) {
		return page.route.id === href || page.route.id?.startsWith(`${href}/`);
	}

	async function logout() {
		if (loggingOut) return;
		loggingOut = true;
		try {
			await fetch('/api/logout', { method: 'POST' });
			await goto(resolve('/'));
		} catch (error) {
			console.error(error);
			loggingOut = false;
		}
	}
</script>

<aside
	class="flex w-full shrink-0 flex-col border-b border-line bg-white md:sticky md:top-0 md:h-screen md:w-60 md:border-r md:border-b-0"
>
	<div class="px-4 pt-6 pb-3">
		<p class="text-sm font-semibold text-ink">Teamwork</p>
		<p class="text-xs text-muted">Claims</p>
	</div>

	<nav class="flex gap-1 px-4 pb-4 md:flex-col">
		{#each items as item (item.href)}
			<a
				href={resolve(item.href)}
				aria-current={isActive(item.href) ? 'page' : undefined}
				class="flex h-10 items-center rounded-lg px-3 text-sm font-medium {isActive(item.href)
					? 'bg-brand-soft text-brand'
					: 'text-body hover:bg-canvas'}"
			>
				{item.label}
			</a>
		{/each}
	</nav>

	<div class="border-t border-line px-4 py-4 md:mt-auto">
		<button type="button" class="btn btn-reject w-full" disabled={loggingOut} onclick={logout}>
			<svg
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="1.8"
				class="size-4"
				aria-hidden="true"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6A2.25 2.25 0 0 0 5.25 5.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15"
				/>
				<path stroke-linecap="round" stroke-linejoin="round" d="M18 15l3-3-3-3" />
				<path stroke-linecap="round" stroke-linejoin="round" d="M9 12h12" />
			</svg>
			{loggingOut ? 'Logging out…' : 'Log out'}
		</button>
	</div>
</aside>
