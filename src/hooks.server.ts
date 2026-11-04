import type { UserRole } from "#lib/constants.ts";
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
        const user = await User.findById(userId).select('_id displayName username tbId role').lean();
        if (user) {
            event.locals.user = {
                id: user._id.toString(),
                displayName: user.displayName,
                username: user.username,
                tbId: user.tbId,
                role: user.role as UserRole
            };
        }
    }

    if (!teamworkToken && !isPublic) {
        console.log('no teamwork_token')
    }


    const response = resolve(event);
    return response;
}