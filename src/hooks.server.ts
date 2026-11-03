import type { Handle } from "@sveltejs/kit/hooks";

// middleware
export const handle: Handle = async ({ event, resolve }) => {
    // const teamwork_token = event.cookies.get('teamwork_token');;
    return resolve(event);
}