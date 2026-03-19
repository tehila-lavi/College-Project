import httpClient from '../api/httpClient';
import { storage } from '../utils/storage';
import type { RegisterPayload, LoginPayload, AuthResponse } from '../types/auth';

export interface UserInfo {
    role: 'user' | 'admin' | null;
    isAdmin: boolean;
    id: string | null;
    firstName: string;
    lastName: string;
}

class AuthService {
    async register(userData: RegisterPayload): Promise<AuthResponse> {
        try {
            const response = await httpClient.post<AuthResponse>('/auth/register', userData);
            const data = response.data;
            // Note: register in backend returns just the user, no token!
            // But if it does return a token + user, we handle it:
            if ((data as any).token) storage.setToken((data as any).token);
            if ((data as any).user) storage.setUserInfo((data as any).user);
            return response.data;
        } catch (error: any) {
            this.handleError(error);
        }
    }

    async login(credentials: LoginPayload): Promise<AuthResponse> {
        try {
            const response = await httpClient.post<AuthResponse>('/auth/login', credentials);
            storage.setToken(response.data.token);
            if (response.data.user) {
                storage.setUserInfo(response.data.user);
                if (response.data.user.followedVacations) {
                    storage.setFollowedVacations(response.data.user.followedVacations as any);
                }
            }
            return response.data;
        } catch (error: any) {
            this.handleError(error);
        }
    }

    async logout(): Promise<void> {
        storage.removeToken();
    }

    getUserInfo(): UserInfo {
        const token = storage.getToken();
        if (!token) return { role: null, isAdmin: false, id: null, firstName: '', lastName: '' };

        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            const savedUserInfo = storage.getUserInfo();

            return {
                role: payload.role || 'user',
                isAdmin: payload.role === 'admin',
                id: payload.id || null,
                // Fallback to saved storage since token might not have names
                firstName: payload.firstName || savedUserInfo?.firstName || '',
                lastName: payload.lastName || savedUserInfo?.lastName || ''
            };
        } catch (e) {
            return { role: null, isAdmin: false, id: null, firstName: '', lastName: '' };
        }
    }

    private handleError(error: any): never {
        let errorMessage = 'An unexpected error occurred. Please try again later.';

        if (error.response) {
            errorMessage = error.response.data?.message || `Server error: ${error.response.status}`;
        } else if (error.request) {
            errorMessage = 'No response from server. Please check your connection.';
        } else {
            errorMessage = error.message;
        }

        throw new Error(errorMessage);
    }
}

export const authService = new AuthService();
