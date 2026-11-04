import { UserRole } from "#lib/constants.ts";
import { User } from "#lib/server/models/users.ts";
// import type { RequestEvent } from "@sveltejs/kit";

export const POST = async (): Promise<Response> => {
    const newUser = {
        displayName: "Admin",
        username: "admin@talkboxapp.com",
        tbId: "0000",
        role: UserRole.ADMIN
    }

    await User.create(newUser);
    return new Response(JSON.stringify({ message: "User created successfully" }), { status: 200 });
}