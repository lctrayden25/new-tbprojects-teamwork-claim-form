import type { User } from "#lib/type/User.ts";

class AuthStore {
    #user = $state<User | null>(null);

    isLoggedIn = $derived(!!this.#user || this.#user !== null);

    get user() {
        return this.#user;
    }

    init(user: User | null) {
        this.#user = user;
    }

    updateUser(data: Partial<User>) {
        if (this.#user) {
            this.#user = { ...this.#user, ...data };
        }
    }


    async logout() {
        await fetch('/api/auth/logout', { method: 'POST' });
        this.#user = null;
    }
}

export const authStore = new AuthStore();