import { type RequestEvent } from "@sveltejs/kit";

export const load = async ({ locals, cookies }: RequestEvent) => {
    const userId = cookies.get('user_id') ?? null;
    const user = locals.user ?? null

    if (!userId && !user) {
        locals.user = null
    }

    return { user }
}