import type { Actions, RequestEvent } from './$types';

export const actions = {
    testing: async ({ request }: RequestEvent) => {
        const formData = await request.formData();
        const email = formData.get('email');
        const password = formData.get('password');
        console.log({ email, password });
        return { success: true };
    }
} satisfies Actions