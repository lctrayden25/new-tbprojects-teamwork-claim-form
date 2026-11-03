<script lang="ts">
	import { resolve } from '$app/paths';
	import { ClaimStatus } from '#lib/constants.ts';
	import type { PageProps } from './$types';
	import { amountFormat, dateFormat } from '#lib';

	let { data }: PageProps = $props();

	const statusClass = {
		[ClaimStatus.PENDING]: 'bg-[#f3f4f6] text-[#3d4c5f]',
		[ClaimStatus.APPROVED]: 'bg-[#f0fdf4] text-[#166534]',
		[ClaimStatus.REJECTED]: 'bg-[#fff7ed] text-[#c2410c]'
	} as const;
</script>

<svelte:head>
	<title>Claim List</title>
</svelte:head>

<section class="page">
	<header class="flex flex-wrap items-center justify-between gap-4">
		<div>
			<h1 class="page-title">Claim List</h1>
			<p class="mt-1 text-sm text-muted">{data.claims.length} claims</p>
		</div>
		<a href={resolve('/(dashboard)/claim-list/create')} class="btn btn-primary">New claim</a>
	</header>

	<div class="overflow-x-auto rounded-lg border border-line bg-white">
		<table class="w-full min-w-190 border-collapse text-left text-sm">
			<thead class="border-b border-line text-muted">
				<tr>
					<th class="px-4 py-3 font-medium">Claim ID</th>
					<th class="px-4 py-3 font-medium">Expense item</th>
					<th class="px-4 py-3 font-medium">Expense Date</th>
					<th class="px-4 py-3 font-medium">Amount</th>
					<th class="px-4 py-3 font-medium">Receipt</th>
					<th class="px-4 py-3 font-medium">Status</th>
					<th class="px-4 py-3 font-medium">Remarks</th>
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
						<td class="px-4 py-3 text-subtle">{claim.remarks || '—'}</td>
					</tr>
				{:else}
					<tr>
						<td class="px-4 py-10 text-center text-muted" colspan="7">No claims yet.</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</section>
