import { connectDB } from '#lib/server/db.ts';
import { User } from '#lib/server/models/users.ts';
import { TeamworkService } from '#lib/service/teamwork.ts';
import type { LoginResponse } from '#lib/type/Auth.ts';
import type { TeamworkLoginResponse } from '#lib/type/Teamwork.ts';
import type { RequestEvent } from '@sveltejs/kit';

export const POST = async ({ request, cookies }: RequestEvent): Promise<Response> => {
    await connectDB();
    const { username, password } = await request.json();
    const data: TeamworkLoginResponse = await TeamworkService.checkLoginMethodAndLogin({ username, password });

    if (!data?.data?.token) {
        return new Response(JSON.stringify({ error: 'Invalid credentials' }), { status: 401 });
    }


    const { user, token } = data.data;
    const existingUser = await User.findOne({ username: user?.username })
        .select('tbId displayName username')
        .lean();

    const isExistingUser = existingUser
        ? {
            tbId: existingUser.tbId,
            id: existingUser._id,
            displayName: existingUser.displayName,
            username: existingUser.username
        } : null;

    if (!isExistingUser) {
        await User.create({
            displayName: user?.displayName,
            username: user?.username,
            tbId: user?.tbId.toString(),
        })
    }

    cookies.set('teamwork_token', token, {
        path: '/',
        httpOnly: false,
        secure: true,
        maxAge: 60 * 60 * 24 * 30 // 30 days
    })

    cookies.set('user_id', existingUser?._id.toString(), {
        path: '/',
        httpOnly: false,
        secure: true,
        maxAge: 60 * 60 * 24 * 30 // 30 days
    })


    const res = {
        token,
        user: {
            displayName: user?.displayName,
            username: user?.username,
            profilePic: user?.profilePic,
            tbId: user?.tbId.toString(),
        },
        id: existingUser?._id,
    } satisfies LoginResponse;

    return new Response(JSON.stringify(res), { status: 200 });
};
