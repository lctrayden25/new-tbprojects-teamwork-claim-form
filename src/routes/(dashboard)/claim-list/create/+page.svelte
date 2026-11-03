<script lang="ts">
	import type { PageProps } from './$types';

	let { form }: PageProps = $props();
	let fileInput = $state<HTMLInputElement | null>(null);
	let dragging = $state(false);
	let receiptName = $state('');
	let previewUrl = $state('');
	let receiptError = $state('');

	const maxReceiptBytes = 1024 * 1024 * 1024;
	const today = new Date().toISOString().slice(0, 10);

	function setReceipt(file: File | undefined) {
		if (previewUrl) URL.revokeObjectURL(previewUrl);

		if (!file) {
			receiptName = '';
			previewUrl = '';
			receiptError = '';
			return;
		}

		if (file.size > maxReceiptBytes) {
			receiptName = '';
			previewUrl = '';
			receiptError = 'Receipt must be 1 GB or smaller.';
			if (fileInput) fileInput.value = '';
			return;
		}

		receiptError = '';
		receiptName = file.name;
		previewUrl = file.type.startsWith('image/') ? URL.createObjectURL(file) : '';
	}

	function onFileChange(event: Event) {
		const input = event.currentTarget as HTMLInputElement;
		setReceipt(input.files?.[0]);
	}

	function onDrop(event: DragEvent) {
		event.preventDefault();
		dragging = false;
		const file = event.dataTransfer?.files?.[0];
		if (!file || !fileInput) return;

		const transfer = new DataTransfer();
		transfer.items.add(file);
		fileInput.files = transfer.files;
		setReceipt(file);
	}
</script>

<svelte:head>
	<title>Expense Claim Form (A1)</title>
</svelte:head>

<form class="page" method="POST" enctype="multipart/form-data" action="?/create">
	<header>
		<h1 class="page-title">Expense Claim Form (A1)</h1>
	</header>

	<hr class="border-t border-dashed border-field" />

	{#if form?.success}
		<p class="rounded-lg border border-[#bbf7d0] bg-[#f0fdf4] px-4 py-3 text-sm text-[#166534]">
			Claim submitted{form.data?.expenseItem ? ` for ${form.data.expenseItem}` : ''}.
		</p>
	{/if}

	<label class="flex flex-col gap-2">
		<span class="label">
			<span class="text-danger">*</span> Expense Item (e.g. Transportation, Taxi, Medical Expenses)
		</span>
		<input name="expenseItem" required value={form?.data?.expenseItem ?? ''} class="control" />
	</label>

	<hr class="border-line" />

	<label class="flex flex-col gap-2">
		<span class="label"><span class="text-danger">*</span> Date of expense:</span>
		<input
			name="expenseDate"
			type="date"
			required
			value={form?.data?.expenseDate || today}
			class="control control-auto"
		/>
	</label>

	<label class="flex flex-col gap-2">
		<span class="label"><span class="text-danger">*</span> Total Amount - HKD (e.g. 100)</span>
		<input
			name="totalAmount"
			type="number"
			min="0"
			step="0.01"
			required
			value={form?.data?.totalAmount ?? ''}
			class="control"
		/>
	</label>

	<hr class="border-line" />

	<div class="flex flex-col gap-2">
		<span class="label">Original Receipt (Max. 1G)</span>
		<label
			class="relative flex min-h-128 cursor-pointer items-center justify-center rounded-lg border border-dashed bg-canvas {dragging
				? 'border-brand bg-brand-soft'
				: 'border-field'}"
			ondragover={(event) => {
				event.preventDefault();
				dragging = true;
			}}
			ondragleave={() => (dragging = false)}
			ondrop={onDrop}
		>
			<input
				bind:this={fileInput}
				name="receipt"
				type="file"
				accept="image/*"
				class="sr-only"
				onchange={onFileChange}
			/>
			{#if previewUrl}
				<img src={previewUrl} alt="Selected receipt" class="max-h-120 max-w-full object-contain" />
			{:else}
				<span class="flex flex-col items-center gap-2 text-placeholder">
					<svg
						viewBox="0 0 24 24"
						class="size-5"
						fill="none"
						stroke="currentColor"
						stroke-width="1.5"
						aria-hidden="true"
					>
						<path stroke-linecap="round" d="M12 5v14M5 12h14" />
					</svg>
					<span>{receiptName || 'Drag or select a picture'}</span>
				</span>
			{/if}
		</label>
		{#if receiptError}
			<p class="text-sm text-danger">{receiptError}</p>
		{/if}
	</div>

	<label class="flex flex-col gap-2">
		<span class="label">Remarks:</span>
		<textarea name="remarks" rows="3" class="control-area">{form?.data?.remarks ?? ''}</textarea>
	</label>

	<label class="flex flex-col gap-2">
		<span class="label">Remarks (For Approver)</span>
		<textarea name="approverRemarks" rows="3" class="control-area"
			>{form?.data?.approverRemarks ?? ''}</textarea
		>
	</label>

	<button type="submit" class="btn btn-primary w-fit">Continue</button>
</form>
