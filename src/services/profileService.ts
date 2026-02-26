import api from './api';
import { User } from '../store/slices/authSlice';

// ────────────────────────────────────────────
// Types
// ────────────────────────────────────────────

export interface Profile {
    phone?: string;
    gender?: string;
    birth_date?: string;
    avatar?: string;
}

export interface Address {
    id: number;
    label: string;
    receiver_name: string;
    receiver_phone: string;
    province: string;
    city: string;
    district: string;
    village?: string;
    postal_code: string;
    full_address: string;
    is_default: boolean;
    notes?: string;
}

export interface UserProfile extends User {
    profile?: Profile;
    addresses?: Address[];
}

export interface UpdateProfilePayload {
    name: string;
    phone?: string;
    gender?: string;
    birth_date?: string;
}

export interface ChangePasswordPayload {
    current_password: string;
    new_password: string;
    new_password_confirmation: string;
}

export interface AddressPayload {
    label: string;
    receiver_name: string;
    receiver_phone: string;
    province: string;
    province_code?: string;
    city: string;
    city_code?: string;
    district: string;
    district_code?: string;
    village?: string;
    postal_code: string;
    full_address: string;
    is_default?: boolean;
    notes?: string;
}

// ────────────────────────────────────────────
// Profile Service
// ────────────────────────────────────────────

export const profileService = {
    /** Get full profile with addresses */
    getProfile: async (): Promise<{ success: boolean; data: UserProfile }> => {
        const res = await api.get('/v1/profile');
        return res.data;
    },

    /** Update basic profile info */
    updateProfile: async (payload: UpdateProfilePayload): Promise<{ success: boolean; data: UserProfile; message: string }> => {
        const res = await api.put('/v1/profile', payload);
        return res.data;
    },

    /** Change password */
    changePassword: async (payload: ChangePasswordPayload): Promise<{ success: boolean; message: string }> => {
        const res = await api.post('/v1/profile/change-password', payload);
        return res.data;
    },

    /** Upload avatar */
    uploadAvatar: async (file: File): Promise<{ success: boolean; data: { avatar_url: string }; message: string }> => {
        const formData = new FormData();
        formData.append('avatar', file);
        const res = await api.post('/v1/profile/avatar', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return res.data;
    },

    // ── Addresses ──────────────────────────────

    /** List all addresses */
    getAddresses: async (): Promise<{ success: boolean; data: Address[] }> => {
        const res = await api.get('/v1/addresses');
        return res.data;
    },

    /** Create new address */
    createAddress: async (payload: AddressPayload): Promise<{ success: boolean; data: Address; message: string }> => {
        const res = await api.post('/v1/addresses', payload);
        return res.data;
    },

    /** Update address */
    updateAddress: async (id: number, payload: AddressPayload): Promise<{ success: boolean; data: Address; message: string }> => {
        const res = await api.put(`/v1/addresses/${id}`, payload);
        return res.data;
    },

    /** Delete address */
    deleteAddress: async (id: number): Promise<{ success: boolean; message: string }> => {
        const res = await api.delete(`/v1/addresses/${id}`);
        return res.data;
    },

    /** Set address as default */
    setDefaultAddress: async (id: number): Promise<{ success: boolean; message: string }> => {
        const res = await api.patch(`/v1/addresses/${id}/set-default`);
        return res.data;
    },
};
