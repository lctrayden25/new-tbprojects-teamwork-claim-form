<script lang="ts">
	import type { LoginResponse } from '#lib/type/Auth.ts';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';

	let username = $state('');
	let password = $state('');
	let showPassword = $state(false);

	const handleLogin = async (event: SubmitEvent) => {
		event.preventDefault();
		try {
			const res = await fetch('/api/login', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ username, password })
			});
			const data = (await res.json()) as LoginResponse;
			if (data?.token) {
				await goto(resolve('/(dashboard)/claim-list'));
			}
		} catch (error) {
			console.log(error);
		}
	};
</script>

<form class="flex w-full flex-col gap-6" onsubmit={handleLogin}>
	<h1 class="page-title text-center">Teamwork Claim Form Sign In</h1>
	<div class="flex flex-col gap-5">
		<div class="flex flex-col gap-2">
			<label class="label" for="username">Username</label>
			<input
				id="username"
				name="username"
				type="text"
				autocomplete="username"
				required
				placeholder="Enter your username"
				bind:value={username}
				class="control"
			/>
		</div>

		<div class="flex flex-col gap-2">
			<label class="label" for="password">Password</label>
			<div class="relative">
				<input
					id="password"
					name="password"
					type={showPassword ? 'text' : 'password'}
					autocomplete="current-password"
					required
					placeholder="Enter your password"
					bind:value={password}
					class="control control-icon"
				/>
				<button
					type="button"
					class="absolute top-1/2 right-3 -translate-y-1/2 rounded-lg p-1 text-muted hover:text-body"
					aria-label={showPassword ? 'Hide password' : 'Show password'}
					aria-pressed={showPassword}
					onclick={() => (showPassword = !showPassword)}
				>
					{#if showPassword}
						<svg
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="1.6"
							class="size-5"
							aria-hidden="true"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="M3.5 3.5 20.5 20.5M10.2 10.3a2.6 2.6 0 0 0 3.6 3.6"
							/>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="M7.1 7.3C4.9 8.7 3.2 11 2.3 12c1.6 3.2 5.2 6.2 9.7 6.2 1.5 0 2.9-.3 4.2-.9M9.4 5.9A10 10 0 0 1 12 5.5c4.5 0 8.1 3 9.7 6.2a16 16 0 0 1-2.2 3.3"
							/>
						</svg>
					{:else}
						<svg
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="1.6"
							class="size-5"
							aria-hidden="true"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="M2.25 12S5.6 6.75 12 6.75 21.75 12 21.75 12 18.4 17.25 12 17.25 2.25 12 2.25 12Z"
							/>
							<circle cx="12" cy="12" r="2.6" />
						</svg>
					{/if}
				</button>
			</div>
		</div>
	</div>

	<button type="submit" class="btn btn-primary w-full">Sign in</button>
</form>
