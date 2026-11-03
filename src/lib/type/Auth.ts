export type LoginResponse = {
    token: string;
    user: {
        displayName: string;
        username: string;
        profilePic: string;
        tbId: string;
    },
    id: string; // this id from mongoose
}