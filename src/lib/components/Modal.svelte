<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		open = $bindable(false),
		title,
		titleId = 'modal-title',
		children,
		footer
	}: {
		open?: boolean;
		title: string;
		titleId?: string;
		children: Snippet;
		footer?: Snippet;
	} = $props();

	let dialog = $state<HTMLDialogElement | null>(null);

	$effect(() => {
		if (!dialog) return;
		if (open && !dialog.open) dialog.showModal();
		else if (!open && dialog.open) dialog.close();
	});

	function onClose() {
		open = false;
	}

	function onBackdropClick(event: MouseEvent) {
		if (event.target === dialog) open = false;
	}
</script>

<dialog
	bind:this={dialog}
	aria-labelledby={titleId}
	class="m-auto w-[calc(100%-3rem)] max-w-md rounded-lg border border-line bg-white p-6 text-ink shadow-[0_8px_24px_rgba(16,24,40,0.12)] backdrop:bg-ink/40"
	onclose={onClose}
	onclick={onBackdropClick}
>
	<h2 id={titleId} class="page-title">{title}</h2>
	<div class="mt-4 text-sm text-body">
		{@render children()}
	</div>
	{#if footer}
		<div class="mt-6 flex justify-end gap-3">
			{@render footer()}
		</div>
	{/if}
</dialog>
