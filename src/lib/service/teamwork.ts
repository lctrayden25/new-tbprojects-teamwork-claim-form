import type { TeamworkLoginResponse } from '#lib/type/Teamwork.ts';
import { TEAMWORK_API_URL } from '$app/env/private';

export class TeamworkService {

    static async checkLoginMethodAndLogin({
        username,
        password
    }: {
        username: string;
        password: string;
    }): Promise<TeamworkLoginResponse> {
        const checkLoginBody = new URLSearchParams();
        checkLoginBody.append('username', username);
        checkLoginBody.append('suppress_response_codes', 'true');


        await fetch(`${TEAMWORK_API_URL}/api/login/checkLoginMethod`, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
            },
            method: 'POST',
            body: checkLoginBody.toString()
        });

        const loginBody = new URLSearchParams();
        loginBody.append('username', username);
        loginBody.append('password', password);
        loginBody.append('rememberMe', 'false');
        loginBody.append('version', '');
        loginBody.append('lang', 'en_US');

        const loginResponse = await fetch(`${TEAMWORK_API_URL}/form/api/app/user/login`, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
            },
            method: 'POST',
            body: loginBody.toString()
        });

        const loginResponseData: TeamworkLoginResponse = await loginResponse.json();
        return loginResponseData;
    }
}
