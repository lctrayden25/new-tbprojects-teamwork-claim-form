import type { RequestEvent } from "@sveltejs/kit";

export const POST = async ({ cookies }: RequestEvent) => {
    const teamwork_token = cookies.get('teamwork_token');
    if (!teamwork_token) {
        return new Response(JSON.stringify({ error: 'No teamwork token' }), { status: 401 });
    }

    cookies.delete('teamwork_token', { path: '/' });
    cookies.delete('user_id', { path: '/' });
    return new Response(JSON.stringify({ message: 'Logged out successfully' }), { status: 200 });
}