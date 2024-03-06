export type UserCredentials = {
    username: string;
    password: string;
}

export type UserCreate = UserCredentials & {
    email: string;
}