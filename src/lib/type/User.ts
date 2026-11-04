import type { UserRole } from "#lib/constants.ts";

export type User = {
    id: string;
    displayName: string;
    username: string;
    tbId: string;
    role: UserRole;
    profilePic?: string;
}