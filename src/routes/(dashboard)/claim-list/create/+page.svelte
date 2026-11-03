<script lang="ts">
	import type { PageProps } from './$types';

	let { form }: PageProps = $props();

	const maxReceiptBytes = 1024 * 1024 * 1024;
	const today = new Date().toISOString().slice(0, 10);

	let fileInput = $state<HTMLInputElement | null>(null);
	let dragging = $state(false);
	let receiptName = $state('');
	let previewUrl = $state('');
	let receiptError = $state('');

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

<form
	class="mx-auto flex w-full max-w-6xl flex-col gap-5"
	method="POST"
	enctype="multipart/form-data"
>
	<header class="flex flex-col gap-3">
		<h1 class="text-lg font-semibold">Expense Claim Form (A1)</h1>
	</header>

	<hr class="border-t border-dashed border-[#c5cad3]" />

	{#if form?.success}
		<p class="rounded-md border border-[#bbf7d0] bg-[#f0fdf4] px-3 py-2 text-sm text-[#166534]">
			Claim submitted{form.expenseItem ? ` for ${form.expenseItem}` : ''}.
		</p>
	{/if}

	<label class="flex flex-col gap-2 text-sm">
		<span
			><span class="text-[#dc2626]">*</span> Expense Item (e.g. Transportation, Taxi, Medical Expenses)</span
		>
		<input
			name="expenseItem"
			required
			value={form?.expenseItem ?? ''}
			class="h-9 w-full border border-[#d0d5dd] bg-white px-3 outline-none focus:border-[#3b6cff]"
		/>
	</label>

	<hr class="border-[#e5e7eb]" />

	<label class="flex flex-col gap-2 text-sm">
		<span><span class="text-[#dc2626]">*</span> Date of expense:</span>
		<input
			name="expenseDate"
			type="date"
			required
			value={form?.expenseDate || today}
			class="h-9 w-fit border border-[#d0d5dd] bg-white px-2 outline-none focus:border-[#3b6cff]"
		/>
	</label>

	<label class="flex flex-col gap-2 text-sm">
		<span><span class="text-[#dc2626]">*</span> Total Amount - HKD (e.g. 100)</span>
		<input
			name="totalAmount"
			type="number"
			min="0"
			step="0.01"
			required
			value={form?.totalAmount ?? ''}
			class="h-9 w-full border border-[#d0d5dd] bg-white px-3 outline-none focus:border-[#3b6cff]"
		/>
	</label>

	<hr class="border-[#e5e7eb]" />

	<div class="flex flex-col gap-2 text-sm">
		<span>Original Receipt (Max. 1G)</span>
		<label
			class="relative flex min-h-128 cursor-pointer items-center justify-center border border-dashed bg-[#f7f7f8] {dragging
				? 'border-[#3b6cff] bg-[#eef3ff]'
				: 'border-[#c5cad3]'}"
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
				<span class="flex flex-col items-center gap-2 text-[#9ca3af]">
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
			<p class="text-sm text-[#dc2626]">{receiptError}</p>
		{/if}
	</div>

	<label class="flex flex-col gap-2 text-sm">
		<span>Remarks:</span>
		<textarea
			name="remarks"
			rows="3"
			class="w-full resize-y border border-[#d0d5dd] bg-white px-3 py-2 outline-none focus:border-[#3b6cff]"
			>{form?.remarks ?? ''}</textarea
		>
	</label>

	<label class="flex flex-col gap-2 text-sm">
		<span>Remarks (For Approver)</span>
		<textarea
			name="approverRemarks"
			rows="3"
			class="w-full resize-y border border-[#d0d5dd] bg-white px-3 py-2 outline-none focus:border-[#3b6cff]"
			>{form?.approverRemarks ?? ''}</textarea
		>
	</label>

	<button
		type="submit"
		class="h-9 w-fit rounded bg-[#3b6cff] px-4 text-sm font-medium text-white hover:bg-[#2f5ef0]"
	>
		Continue
	</button>
</form>
