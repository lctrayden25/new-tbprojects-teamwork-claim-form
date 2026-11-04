<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { ClaimStatus, UserRole } from '#lib/constants.ts';
	import Modal from '#lib/components/Modal.svelte';
	import type { PageProps } from './$types';
	import { amountFormat, dateFormat } from '#lib';
	import { authStore } from '#lib/store/auth.svelte.ts';

	let { data }: PageProps = $props();
	let detailOpen = $state(false);
	let selected = $state<(typeof data.claims)[number] | null>(null);
	let menuClaim = $state<(typeof data.claims)[number] | null>(null);
	let menuTop = $state(0);
	let menuLeft = $state(0);
	let confirmOpen = $state(false);
	let confirmAction = $state<'approve' | 'reject' | null>(null);
	let confirmClaim = $state<(typeof data.claims)[number] | null>(null);

	function toggleMenu(event: MouseEvent, claim: (typeof data.claims)[number]) {
		if (menuClaim?.id === claim.id) {
			menuClaim = null;
			return;
		}

		const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
		const menuHeight = 168;
		const menuWidth = 160;
		menuTop =
			rect.bottom + 4 + menuHeight > window.innerHeight
				? Math.max(8, rect.top - menuHeight - 4)
				: rect.bottom + 4;
		menuLeft = Math.max(8, rect.right - menuWidth);
		menuClaim = claim;
	}

	function showDetail() {
		if (!menuClaim) return;
		selected = menuClaim;
		menuClaim = null;
		detailOpen = true;
	}

	function askConfirm(action: 'approve' | 'reject') {
		if (!menuClaim) return;
		confirmClaim = menuClaim;
		confirmAction = action;
		menuClaim = null;
		confirmOpen = true;
	}

	function statusLabel(status: string) {
		return status.charAt(0).toUpperCase() + status.slice(1);
	}

	const statusClass = {
		[ClaimStatus.PENDING]: 'bg-[#f3f4f6] text-[#3d4c5f]',
		[ClaimStatus.APPROVED]: 'bg-[#f0fdf4] text-[#166534]',
		[ClaimStatus.REJECTED]: 'bg-[#fff7ed] text-[#c2410c]'
	} as const;

	const role = $derived(authStore.user?.role);
	const rangeStart = $derived(data.total === 0 ? 0 : (data.page - 1) * data.limit + 1);
	const rangeEnd = $derived(Math.min(data.page * data.limit, data.total));
	const pages = $derived(pageItems(data.page, data.totalPages));

	function pageHref(page: number, limit: number = data.limit) {
		const params = new URLSearchParams({
			page: String(page),
			limit: String(limit)
		});
		return resolve(`/(dashboard)/claim-list?${params.toString()}`);
	}

	function pageItems(current: number, totalPages: number) {
		if (totalPages <= 7) return Array.from({ length: totalPages }, (_, index) => index + 1);

		const items: Array<number | 'gap'> = [1];
		const start = Math.max(2, current - 1);
		const end = Math.min(totalPages - 1, current + 1);
		if (start > 2) items.push('gap');
		for (let page = start; page <= end; page += 1) items.push(page);
		if (end < totalPages - 1) items.push('gap');
		items.push(totalPages);
		return items;
	}

	function onLimitChange(event: Event) {
		const nextLimit = Number((event.currentTarget as HTMLSelectElement).value);
		menuClaim = null;
		goto(pageHref(1, nextLimit), { reset: false });
	}
</script>

<svelte:head>
	<title>Claim List</title>
</svelte:head>

<section class="page">
	<header class="flex flex-wrap items-center justify-between gap-4">
		<div>
			<h1 class="page-title">Claim List</h1>
			<p class="mt-1 text-sm text-muted">{data.total} claims</p>
		</div>
		<a href={resolve('/(dashboard)/claim-list/create')} class="btn btn-primary">New claim</a>
	</header>

	<div class="rounded-lg border border-line bg-white">
		<div class="overflow-x-auto">
			<table class="w-full min-w-190 border-collapse text-left text-sm">
				<thead class="border-b border-line text-muted">
					<tr>
						<th class="px-4 py-3 font-medium">Claim ID</th>
						<th class="px-4 py-3 font-medium">Expense item</th>
						<th class="px-4 py-3 font-medium">Expense Date</th>
						<th class="px-4 py-3 font-medium">Amount</th>
						<th class="px-4 py-3 font-medium">Receipt</th>
						<th class="px-4 py-3 font-medium">Status</th>
						<th class="px-4 py-3 font-medium">Submitted By</th>
						<th class="px-4 py-3 font-medium">Remarks</th>
						<th class="px-4 py-3 font-medium">Action</th>
					</tr>
				</thead>
				<tbody>
					{#each data.claims as claim (claim.id)}
						<tr class="border-b border-canvas last:border-b-0">
							<td class="px-4 py-3 font-medium whitespace-nowrap text-ink">{claim.id}</td>
							<td class="px-4 py-3">{claim.expenseItem}</td>
							<td class="px-4 py-3 whitespace-nowrap">{dateFormat(claim.expenseDate)}</td>
							<td class="px-4 py-3 whitespace-nowrap">{amountFormat(claim.totalAmount)}</td>
							<td class="px-4 py-3 text-subtle">{claim.receiptName || '—'}</td>
							<td class="px-4 py-3">
								<span
									class="inline-flex rounded-full px-2.5 py-1 text-xs font-medium {statusClass[
										claim.status as ClaimStatus
									]}"
								>
									{claim.status.charAt(0).toUpperCase() + claim.status.slice(1)}
								</span>
							</td>
							<td class="px-4 py-3 text-subtle">{claim.submittedBy || '—'}</td>
							<td class="px-4 py-3 text-subtle">{claim.remarks || '—'}</td>
							<td class="px-4 py-3">
								<button
									type="button"
									class="btn btn-secondary relative {menuClaim?.id === claim.id ? 'z-20' : ''}"
									aria-haspopup="menu"
									aria-expanded={menuClaim?.id === claim.id}
									onclick={(event) => toggleMenu(event, claim)}
								>
									Action
								</button>
							</td>
						</tr>
					{:else}
						<tr>
							<td class="px-4 py-10 text-center text-muted" colspan="9">No claims yet.</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>

		<nav
			class="flex flex-wrap items-center justify-between gap-3 border-t border-line px-4 py-3"
			aria-label="Claim pages"
		>
			<p class="text-sm text-muted">
				{#if data.total === 0}
					No claims
				{:else}
					Showing {rangeStart}–{rangeEnd} of {data.total}
				{/if}
			</p>
			<div class="flex flex-wrap items-center gap-2">
				<label class="flex items-center gap-2 text-sm text-muted">
					Rows
					<select class="control control-auto" value={data.limit} onchange={onLimitChange}>
						<option value={10}>10</option>
						<option value={20}>20</option>
						<option value={50}>50</option>
					</select>
				</label>
				{#if data.page > 1}
					<a href={pageHref(data.page - 1)} class="btn btn-secondary" data-sveltekit-reset="false"
						>Previous</a
					>
				{:else}
					<button type="button" class="btn btn-secondary" disabled>Previous</button>
				{/if}
				{#each pages as item, index (`${item}-${index}`)}
					{#if item === 'gap'}
						<span class="px-1 text-muted" aria-hidden="true">…</span>
					{:else}
						<a
							href={pageHref(item)}
							class="btn min-w-10 px-3 {item === data.page ? 'btn-primary' : 'btn-secondary'}"
							aria-current={item === data.page ? 'page' : undefined}
							data-sveltekit-reset="false"
						>
							{item}
						</a>
					{/if}
				{/each}
				{#if data.page < data.totalPages}
					<a href={pageHref(data.page + 1)} class="btn btn-secondary" data-sveltekit-reset="false"
						>Next</a
					>
				{:else}
					<button type="button" class="btn btn-secondary" disabled>Next</button>
				{/if}
			</div>
		</nav>
	</div>

	{#if menuClaim}
		<button
			type="button"
			class="fixed inset-0 z-10 cursor-default bg-transparent"
			aria-label="Close actions"
			onclick={() => (menuClaim = null)}
		></button>
		<div
			class="fixed z-20 flex w-40 flex-col gap-2 rounded-lg border border-line bg-white p-2 shadow-[0_8px_24px_rgba(16,24,40,0.12)]"
			style="top: {menuTop}px; left: {menuLeft}px"
			role="menu"
		>
			<button type="button" class="btn btn-secondary w-full" role="menuitem" onclick={showDetail}>
				Detail
			</button>

			{#if role === UserRole.ADMIN && menuClaim?.status === ClaimStatus.PENDING}
				<button
					type="button"
					class="btn btn-approve w-full"
					role="menuitem"
					onclick={() => askConfirm('approve')}
				>
					Approve
				</button>
				<button
					type="button"
					class="btn btn-reject w-full"
					role="menuitem"
					onclick={() => askConfirm('reject')}
				>
					Reject
				</button>
			{/if}
		</div>
	{/if}

	<Modal
		bind:open={confirmOpen}
		title={confirmAction === 'reject' ? 'Reject this claim?' : 'Approve this claim?'}
		titleId="confirm-title"
	>
		{#if confirmClaim}
			<p>
				{confirmAction === 'reject'
					? 'This will mark the claim as rejected.'
					: 'This will mark the claim as approved.'}
			</p>
			<dl class="mt-4 grid grid-cols-[8rem_1fr] gap-y-2">
				<dt class="text-muted">Expense item</dt>
				<dd class="text-ink">{confirmClaim.expenseItem}</dd>
				<dt class="text-muted">Amount</dt>
				<dd class="text-ink">{amountFormat(confirmClaim.totalAmount)}</dd>
			</dl>
		{/if}
		{#snippet footer()}
			<button type="button" class="btn btn-secondary" onclick={() => (confirmOpen = false)}>
				Cancel
			</button>
			{#if confirmClaim}
				<form
					method="POST"
					action={confirmAction === 'reject' ? '?/reject' : '?/approve'}
					use:enhance={() => {
						return async ({ result, update }) => {
							await update();
							if (result.type === 'success') {
								confirmOpen = false;
							} else {
								console.log(result);
								alert((result as { data?: { error: string } }).data?.error || 'An error occurred');
							}
						};
					}}
				>
					<input type="hidden" name="id" value={confirmClaim.id} />
					<button
						type="submit"
						class="btn {confirmAction === 'reject' ? 'btn-reject' : 'btn-approve'}"
					>
						{confirmAction === 'reject' ? 'Reject' : 'Approve'}
					</button>
				</form>
			{/if}
		{/snippet}
	</Modal>

	<Modal bind:open={detailOpen} title="Claim details" titleId="detail-title">
		{#if selected}
			<div class="flex flex-col gap-3">
				<div class="flex items-center justify-between gap-3 rounded-lg bg-canvas px-4 py-3">
					<div class="min-w-0">
						<p class="text-xs text-muted">Claim ID</p>
						<p class="mt-1 truncate font-semibold text-ink">{selected.id}</p>
					</div>
					<span
						class="inline-flex shrink-0 rounded-full px-2.5 py-1 text-xs font-medium {statusClass[
							selected.status
						]}"
					>
						{statusLabel(selected.status)}
					</span>
				</div>

				<dl class="overflow-hidden rounded-lg border border-line">
					<div class="grid grid-cols-2 divide-x divide-line border-b border-line">
						<div class="px-4 py-3">
							<dt class="text-xs text-muted">Expense item</dt>
							<dd class="mt-1 font-medium text-ink">{selected.expenseItem}</dd>
						</div>
						<div class="px-4 py-3">
							<dt class="text-xs text-muted">Expense date</dt>
							<dd class="mt-1 font-medium text-ink">{dateFormat(selected.expenseDate)}</dd>
						</div>
					</div>
					<div class="grid grid-cols-2 divide-x divide-line border-b border-line">
						<div class="px-4 py-3">
							<dt class="text-xs text-muted">Amount</dt>
							<dd class="mt-1 font-medium text-ink">{amountFormat(selected.totalAmount)}</dd>
						</div>
						<div class="px-4 py-3">
							<dt class="text-xs text-muted">Submitted by</dt>
							<dd class="mt-1 font-medium text-ink">{selected.submittedBy || '—'}</dd>
						</div>
					</div>
					<div class="px-4 py-3">
						<dt class="text-xs text-muted">Remarks</dt>
						<dd class="mt-1 text-ink">{selected.remarks || '—'}</dd>
					</div>
				</dl>
			</div>
		{/if}
		{#snippet footer()}
			<button type="button" class="btn btn-secondary" onclick={() => (detailOpen = false)}>
				Close
			</button>
		{/snippet}
	</Modal>
</section>
