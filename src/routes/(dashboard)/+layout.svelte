<script lang="ts">
	import Sidebar from '#lib/components/Sidebar.svelte';
	import type { LayoutProps } from './$types';

	let { children }: LayoutProps = $props();
</script>

<div class="flex min-h-screen flex-col bg-canvas md:flex-row">
	<Sidebar />
	<main class="min-w-0 flex-1">
		<div class="min-h-screen px-6 py-6 text-ink">
			{@render children()}
		</div>
	</main>
</div>
