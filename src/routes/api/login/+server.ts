import { json, type RequestEvent } from '@sveltejs/kit';

export const POST = async ({ request }: RequestEvent) => {
    const data = await request.json();
    console.log(data);
    return json({ data })
}