import type { User } from "./User.ts";

export type LoginResponse = {
    token: string;
    user: User;
}