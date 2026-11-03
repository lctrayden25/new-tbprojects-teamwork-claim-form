export type TeamworkCustomField = {
    name: string;
    id: string;
    type: 'FIELD_PHONE' | 'FIELD_TEXT' | 'FIELD_ANNIVERSARY';
    value: string;
};

export type TeamworkUser = {
    displayName: string;
    customFields: TeamworkCustomField[];
    profilePic: string;
    roles: number[];
    permission: number;
    pId: number;
    lastLoginDate: number;
    properties: {
        clientID: string;
    };
    tbId: number;
    username: string;
};

export type TeamworkLoginResponse = {
    data: {
        user: TeamworkUser;
        token: string;
    };
    timestamp: number;
};