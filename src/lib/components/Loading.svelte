<script lang="ts">
	let { size = 5 }: { size?: number } = $props();
</script>

<div
	class="size-{size} animate-spin rounded-full border-2 border-current border-t-transparent"
></div>
