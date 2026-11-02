<script lang="ts">
	let email = $state('');
	let password = $state('');
	let showPassword = $state(false);

	const handleLogin = async (event: SubmitEvent) => {
		event.preventDefault();
		const res = await fetch('/api/login', {
			headers: {
				'Content-Type': 'application/json',
			},
			method: 'POST',
			body: JSON.stringify({ email, password }),
		});
		const data = await res.json();
		console.log(data);
	}
</script>

<form class="w-full max-w-120" onsubmit={handleLogin}>
	<h1 class="text-2xl font-bold text-center my-10">Teamwork Claim Form Sign In</h1>
	<div class="flex flex-col gap-6">
		<div class="flex flex-col gap-2">
			<label class="text-[15px] font-medium text-[#3d4c5f]" for="email">Email</label>
			<input
				id="email"
				name="email"
				type="email"
				autocomplete="email"
				required
				placeholder="Enter your email"
				bind:value={email}
				class="h-14 w-full rounded-2xl border border-[#d5dde8] bg-white px-4 text-[15px] text-[#243041] shadow-[0_1px_2px_rgba(16,24,40,0.05)] outline-none placeholder:text-[#9aa3b2] focus:border-[#3b6cff] focus:shadow-[0_0_0_3px_rgba(59,108,255,0.16)]"
			/>
		</div>

		<div class="flex flex-col gap-2">
			<label class="text-[15px] font-medium text-[#3d4c5f]" for="password">Password</label>
			<div class="relative">
				<input
					id="password"
					name="password"
					type={showPassword ? 'text' : 'password'}
					autocomplete="current-password"
					required
					placeholder="Enter your password"
					bind:value={password}
					class="h-14 w-full rounded-2xl border border-[#d5dde8] bg-white px-4 pr-12 text-[15px] text-[#243041] shadow-[0_1px_2px_rgba(16,24,40,0.05)] outline-none placeholder:text-[#9aa3b2] focus:border-[#3b6cff] focus:shadow-[0_0_0_3px_rgba(59,108,255,0.16)]"
				/>
				<button
					type="button"
					class="absolute top-1/2 right-4 -translate-y-1/2 text-[#8b97a6] hover:text-[#5d6b7c]"
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

	<button
		type="submit"
		class="mt-4 h-14 w-full rounded-2xl bg-[#3b6cff] text-base font-semibold text-white shadow-[0_2px_8px_rgba(59,108,255,0.22)] hover:bg-[#2f5ef0] active:bg-[#2854e0]"
	>
		Sign in
	</button>
</form>
