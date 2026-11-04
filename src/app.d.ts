// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		import type { UserRole } from "#lib/constants.ts";
		// interface Error {}
		interface Locals {
			user: {
				id: string,
				displayName: string,
				username: string,
				tbId: string,
				role: UserRole
			} | null;
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export { };
