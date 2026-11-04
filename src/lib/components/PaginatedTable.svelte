<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { page as appPage } from '$app/state';
	import { PAGE_SIZES } from '#lib/pagination.ts';
	import type { Snippet } from 'svelte';

	let {
		page,
		limit,
		total,
		totalPages,
		itemLabel = 'results',
		tableClass = 'min-w-190',
		header,
		body,
		onNavigate
	}: {
		page: number;
		limit: number;
		total: number;
		totalPages: number;
		itemLabel?: string;
		tableClass?: string;
		header: Snippet;
		body: Snippet;
		onNavigate?: () => void;
	} = $props();

	const rangeStart = $derived(total === 0 ? 0 : (page - 1) * limit + 1);
	const rangeEnd = $derived(Math.min(page * limit, total));
	const pages = $derived(pageItems(page, totalPages));

	function pageHref(nextPage: number, nextLimit = limit) {
		const params = new URLSearchParams({
			page: String(nextPage),
			limit: String(nextLimit)
		});
		const id = appPage.route.id ?? '/';
		return resolve(`${id}?${params.toString()}`);
	}

	function pageItems(current: number, total: number) {
		if (total <= 7) return Array.from({ length: total }, (_, index) => index + 1);

		const items: Array<number | 'gap'> = [1];
		const start = Math.max(2, current - 1);
		const end = Math.min(total - 1, current + 1);
		if (start > 2) items.push('gap');
		for (let next = start; next <= end; next += 1) items.push(next);
		if (end < total - 1) items.push('gap');
		items.push(total);
		return items;
	}

	function onLimitChange(event: Event) {
		const nextLimit = Number((event.currentTarget as HTMLSelectElement).value);
		onNavigate?.();
		goto(pageHref(1, nextLimit), { reset: false });
	}
</script>

<div class="rounded-lg border border-line bg-white">
	<div class="overflow-x-auto">
		<table class="w-full {tableClass} border-collapse text-left text-sm">
			<thead class="border-b border-line text-muted">
				{@render header()}
			</thead>
			<tbody>
				{@render body()}
			</tbody>
		</table>
	</div>

	<nav
		class="flex flex-wrap items-center justify-between gap-3 border-t border-line px-4 py-3"
		aria-label="Pagination"
	>
		<p class="text-sm text-muted">
			{#if total === 0}
				No {itemLabel}
			{:else}
				Showing {rangeStart}–{rangeEnd} of {total}
			{/if}
		</p>
		<div class="flex flex-wrap items-center gap-2">
			<label class="flex items-center gap-2 text-sm text-muted">
				Rows
				<select class="control control-auto" value={limit} onchange={onLimitChange}>
					{#each PAGE_SIZES as size (size)}
						<option value={size}>{size}</option>
					{/each}
				</select>
			</label>
			{#if page > 1}
				<a
					href={pageHref(page - 1)}
					class="btn btn-secondary"
					data-sveltekit-reset="false"
					onclick={onNavigate}
				>
					Previous
				</a>
			{:else}
				<button type="button" class="btn btn-secondary" disabled>Previous</button>
			{/if}
			{#each pages as item, index (`${item}-${index}`)}
				{#if item === 'gap'}
					<span class="px-1 text-muted" aria-hidden="true">…</span>
				{:else}
					<a
						href={pageHref(item)}
						class="btn min-w-10 px-3 {item === page ? 'btn-primary' : 'btn-secondary'}"
						aria-current={item === page ? 'page' : undefined}
						data-sveltekit-reset="false"
						onclick={onNavigate}
					>
						{item}
					</a>
				{/if}
			{/each}
			{#if page < totalPages}
				<a
					href={pageHref(page + 1)}
					class="btn btn-secondary"
					data-sveltekit-reset="false"
					onclick={onNavigate}
				>
					Next
				</a>
			{:else}
				<button type="button" class="btn btn-secondary" disabled>Next</button>
			{/if}
		</div>
	</nav>
</div>
