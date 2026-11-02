<script lang="ts">
	import Sidebar from '#lib/components/Sidebar.svelte';
	import type { LayoutProps } from './$types';

	let { children }: LayoutProps = $props();
</script>

<div class="flex min-h-screen flex-col bg-[#f3f4f6] md:flex-row">
	<Sidebar />
	<main class="min-w-0 flex-1">
		<div class="min-h-screen bg-[#f3f4f6] px-6 py-6 text-[#1f2937]">
			{@render children()}
		</div>
	</main>
</div>
