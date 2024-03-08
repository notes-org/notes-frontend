export type User = {
    uuid: string,
    username: string,
    email: string,
    is_active: true,
    created_at: string
}

export type UserCredentials = {
    username: string;
    password: string;
}

export type UserCreate = UserCredentials & {
    email: string;
}