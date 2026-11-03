<script lang="ts">
	import LoginForm from '#lib/components/LoginForm.svelte';
</script>

<svelte:head>
	<title>Sign in</title>
</svelte:head>

<main class="flex min-h-screen items-center justify-center bg-canvas px-6 py-6">
	<div class="w-full max-w-120 rounded-lg border border-line bg-white p-6">
		<LoginForm />
	</div>
</main>
