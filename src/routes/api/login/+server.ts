import { json, type RequestEvent } from '@sveltejs/kit';
import { connectDB } from '../../../lib/server/db';

export const POST = async ({ request }: RequestEvent) => {
    await connectDB();
    const data = await request.json();
    console.log(data);
    return json({ data });
};
