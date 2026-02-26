import api from './api';
import { User } from '../store/slices/authSlice';

export interface LoginPayload {
    email: string;
    password: string;
}

export interface RegisterPayload {
    name: string;
    email: string;
    password: string;
    password_confirmation?: string;
    birthday_day?: string;
    birthday_month?: string;
    birthday_year?: string;
}

export interface AuthResponse {
    success: boolean;
    message: string;
    data: {
        user: User;
        token: string;
        token_type: string;
    };
}

export const authService = {
    /**
     * Login with email and password
     */
    login: async (payload: LoginPayload): Promise<AuthResponse> => {
        const response = await api.post<AuthResponse>('/v1/login', payload);
        return response.data;
    },

    /**
     * Register a new customer account
     */
    register: async (payload: RegisterPayload): Promise<AuthResponse> => {
        const data: Record<string, string> = {
            name: payload.name,
            email: payload.email,
            password: payload.password,
            password_confirmation: payload.password_confirmation || payload.password,
        };

        // Optional birthday
        if (payload.birthday_day && payload.birthday_month && payload.birthday_year) {
            // Send as ISO date string if backend expects it, else separate fields
            data.birthday = `${payload.birthday_year}-${payload.birthday_month.padStart(2, '0')}-${payload.birthday_day.padStart(2, '0')}`;
        }

        const response = await api.post<AuthResponse>('/v1/register', data);
        return response.data;
    },

    /**
     * Logout and revoke current token
     */
    logout: async (): Promise<void> => {
        await api.post('/v1/logout');
    },

    /**
     * Get current authenticated user
     */
    me: async (): Promise<{ success: boolean; data: { user: User } }> => {
        const response = await api.get('/v1/me');
        return response.data;
    },
};
