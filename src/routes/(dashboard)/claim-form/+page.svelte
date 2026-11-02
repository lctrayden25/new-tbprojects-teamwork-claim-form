<script lang="ts">
	import { resolve } from '$app/paths';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const statusClass = {
		'Applicant confirm': 'bg-[#f3f4f6] text-[#3d4c5f]',
		'Waiting for supervisor': 'bg-[#fff7ed] text-[#c2410c]',
		'Finance review': 'bg-[#eef3ff] text-[#3b6cff]',
		Paid: 'bg-[#f0fdf4] text-[#166534]'
	} as const;

	const amountFormat = new Intl.NumberFormat('en-HK', {
		style: 'currency',
		currency: 'HKD'
	});
	const dateFormat = new Intl.DateTimeFormat('en-GB', {
		day: '2-digit',
		month: '2-digit',
		year: 'numeric'
	});

	function formatDate(value: string) {
		return dateFormat.format(new Date(`${value}T00:00:00`));
	}
</script>

<svelte:head>
	<title>Claim List</title>
</svelte:head>

<section class="mx-auto flex w-full max-w-6xl flex-col gap-5">
	<header class="flex flex-wrap items-center justify-between gap-3">
		<div>
			<h1 class="text-lg font-semibold">Claim List</h1>
			<p class="mt-1 text-sm text-[#6b7280]">{data.claims.length} claims</p>
		</div>
		<a
			href={resolve('/(dashboard)/claim-form/create')}
			class="inline-flex h-9 items-center rounded bg-[#3b6cff] px-4 text-sm font-medium text-white hover:bg-[#2f5ef0]"
		>
			New claim
		</a>
	</header>

	<div class="overflow-x-auto rounded-lg border border-[#e5e7eb] bg-white">
		<table class="w-full min-w-[760px] border-collapse text-left text-sm">
			<thead class="border-b border-[#e5e7eb] text-[#6b7280]">
				<tr>
					<th class="px-4 py-3 font-medium">Claim</th>
					<th class="px-4 py-3 font-medium">Expense item</th>
					<th class="px-4 py-3 font-medium">Date</th>
					<th class="px-4 py-3 font-medium">Amount</th>
					<th class="px-4 py-3 font-medium">Receipt</th>
					<th class="px-4 py-3 font-medium">Status</th>
					<th class="px-4 py-3 font-medium">Remarks</th>
				</tr>
			</thead>
			<tbody>
				{#each data.claims as claim (claim.id)}
					<tr class="border-b border-[#f3f4f6] last:border-b-0">
						<td class="px-4 py-3 font-medium whitespace-nowrap text-[#1f2937]">{claim.id}</td>
						<td class="px-4 py-3">{claim.expenseItem}</td>
						<td class="px-4 py-3 whitespace-nowrap">{formatDate(claim.expenseDate)}</td>
						<td class="px-4 py-3 whitespace-nowrap">{amountFormat.format(claim.totalAmount)}</td>
						<td class="px-4 py-3 text-[#4b5563]">{claim.receiptName || '—'}</td>
						<td class="px-4 py-3">
							<span
								class="inline-flex rounded-full px-2.5 py-1 text-xs font-medium {statusClass[
									claim.status
								]}"
							>
								{claim.status}
							</span>
						</td>
						<td class="px-4 py-3 text-[#4b5563]">{claim.remarks || '—'}</td>
					</tr>
				{:else}
					<tr>
						<td class="px-4 py-10 text-center text-[#6b7280]" colspan="7">No claims yet.</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</section>
