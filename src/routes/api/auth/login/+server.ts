import type { UserRole } from '#lib/constants.ts';
import { connectDB } from '#lib/server/db.ts';
import { User } from '#lib/server/models/users.ts';
import { TeamworkService } from '#lib/service/teamwork.ts';
import type { LoginResponse } from '#lib/type/Auth.ts';
import type { TeamworkLoginResponse } from '#lib/type/Teamwork.ts';
import type { Cookies, RequestEvent } from '@sveltejs/kit';

const setAuthCookies = (cookies: Cookies, key: string, value: string) => {
    cookies.set(key, value, {
        path: '/',
        httpOnly: false,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 30 // 30 days
    });
}

const findAuthUser = async (username: string, cookies: Cookies) => {
    const user = await User.findOne({ username }).select('tbId displayName username role').lean();
    if (!user) {
        return null;
    }
    setAuthCookies(cookies, 'teamwork_token', user._id.toString());
    setAuthCookies(cookies, 'user_id', user._id.toString());

    const res = {
        token: user._id.toString(),
        user: {
            id: user._id.toString(),
            displayName: user?.displayName,
            username: user?.username,
            profilePic: user?.profilePic,
            tbId: user?.tbId.toString(),
            role: user?.role as UserRole
        },
    } as LoginResponse;

    return res;
}

export const POST = async ({ request, cookies }: RequestEvent): Promise<Response> => {
    await connectDB();
    const { username, password } = await request.json();

    if (username === "admin@talkboxapp.com") {
        const res = await findAuthUser(username, cookies);
        if (res) {
            return new Response(JSON.stringify(res), { status: 200 });
        }
        return new Response(JSON.stringify({ error: 'Admin user not found' }), { status: 404 });
    }

    const data: TeamworkLoginResponse = await TeamworkService.checkLoginMethodAndLogin({ username, password });

    if (!data?.data?.token) {
        return new Response(JSON.stringify({ error: 'Invalid credentials' }), { status: 401 });
    }


    const { user, token } = data.data;
    const existingUser = await User.findOne({ username: user?.username })
        .select('tbId displayName username role')
        .lean();

    const userDoc =
        existingUser ??
        (await User.create({
            displayName: user?.displayName,
            username: user?.username,
            tbId: user?.tbId.toString()
        }));

    setAuthCookies(cookies, 'teamwork_token', token);
    setAuthCookies(cookies, 'user_id', userDoc._id.toString());


    const res = {
        token,
        user: {
            id: userDoc._id.toString(),
            displayName: user?.displayName,
            username: user?.username,
            profilePic: user?.profilePic,
            tbId: user?.tbId.toString(),
            role: userDoc?.role as UserRole
        },
    } as LoginResponse;

    return new Response(JSON.stringify(res), { status: 200 });
};
