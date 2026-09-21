export interface User {
    id: string;
    name: string;
    username: string;
    email: string;
    avatar: string | null;
    createdAt: string;
}

export interface RegisterUserInput {
    name: string;
    username: string;
    email: string;
    password: string;
}

export interface LoginUserInput {
    email: string;
    password: string;
}