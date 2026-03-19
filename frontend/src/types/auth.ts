export interface RegisterPayload {
    firstName: string;
    lastName: string;
    username: string;
    password: string;
    adminSecret?: string; // Optional field for admin registration
}

export interface LoginPayload {
    username: string;
    password: string;
}

export interface AuthResponse {
    token: string;
    user: {
        id: string;
        username: string;
        role: 'user' | 'admin';
        firstName: string;
        lastName: string;
        followedVacations?: string[];
    };
}


