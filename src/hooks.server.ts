import { connectDB } from "#lib/server/db.ts";
import { User } from "#lib/server/models/users.ts";
import type { Handle } from "@sveltejs/kit/hooks";

// middleware
export const handle: Handle = async ({ event, resolve }) => {
    event.locals.user = null;
    const teamworkToken = event.cookies.get('teamwork_token');
    const userId = event.cookies.get('user_id');
    const pathname = event.url.pathname;

    const isPublic = pathname === "/";

    if (userId) {
        await connectDB();
        const user = await User.findById(userId).select('_id');
        if (user) event.locals.user = { id: user._id.toString() };
    }

    if (!teamworkToken && !isPublic) {
        console.log('no teamwork_token')
    }


    const response = resolve(event);
    return response;
}