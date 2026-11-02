<script lang="ts">
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import type { RouteId } from '$app/types';

	const items: { href: RouteId; label: string }[] = [
		{ href: '/(dashboard)/claim-form', label: 'Claim List' },
		// { href: '/(dashboard)/claim-form/create', label: 'New claim' },
		{ href: '/(dashboard)/admin', label: 'Admin' }
	];

	function isActive(href: RouteId) {
		return page.route.id === href || page.route.id?.startsWith(`${href}/`);
	}
</script>

<aside
	class="flex w-full shrink-0 flex-col border-b border-[#e5e7eb] bg-white md:sticky md:top-0 md:h-screen md:w-60 md:border-r md:border-b-0"
>
	<div class="px-5 py-5">
		<p class="text-sm font-semibold text-[#1f2937]">Teamwork</p>
		<p class="text-xs text-[#6b7280]">Claims</p>
	</div>

	<nav class="flex gap-1 px-3 pb-4 md:flex-col">
		{#each items as item (item.href)}
			<a
				href={resolve(item.href)}
				aria-current={isActive(item.href) ? 'page' : undefined}
				class="rounded-lg px-3 py-2 text-sm font-medium {isActive(item.href)
					? 'bg-[#eef3ff] text-[#3b6cff]'
					: 'text-[#3d4c5f] hover:bg-[#f3f4f6]'}"
			>
				{item.label}
			</a>
		{/each}
	</nav>
</aside>
