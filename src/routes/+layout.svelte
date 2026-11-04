<script lang="ts">
	import './layout.css';
	import favicon from '#lib/assets/favicon.svg';
	import type { LayoutProps } from './$types';
	import { authStore } from '#lib/store/auth.svelte.ts';
	import type { User } from '#lib/type/User.ts';

	let { children, data }: LayoutProps = $props();

	$effect(() => {
		if (data.user) {
			authStore.init(data.user as unknown as User);
		}
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

{@render children()}
