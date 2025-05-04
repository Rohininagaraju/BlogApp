export interface User {
    id: number;
    email: string;
    name: string;
    role: string;
}

export interface Blog {
    id: number;
    title: string;
    content: string;
    author: User;
    createdAt: string;
    updatedAt: string;
}

export interface AuthResponse {
    token: string;
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterCredentials extends LoginCredentials {
    name: string;
}

export interface PaginatedResponse<T> {
    content: T[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
} 