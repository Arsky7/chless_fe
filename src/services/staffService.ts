import api from './api';
import { Staff, StaffResponse, StaffStats, StaffFilters } from '../pages/admin/staff/types/staff.types';

const staffService = {
    getStaff: async (filters: StaffFilters): Promise<StaffResponse> => {
        const params = new URLSearchParams();
        if (filters.status && filters.status !== 'all') params.append('status', filters.status);
        if (filters.search) params.append('search', filters.search);
        if (filters.page) params.append('page', filters.page.toString());
        if (filters.per_page) params.append('per_page', filters.per_page.toString());

        const response = await api.get(`/admin/staff?${params.toString()}`);
        return response.data;
    },

    getStats: async (): Promise<StaffStats> => {
        const response = await api.get('/admin/staff/stats');
        return response.data;
    },

    createStaff: async (data: any): Promise<Staff> => {
        const response = await api.post('/admin/staff', data);
        return response.data.data;
    },

    updateStaff: async (id: number, data: any): Promise<Staff> => {
        const response = await api.put(`/admin/staff/${id}`, data);
        return response.data.data;
    },

    updateStatus: async (id: number, status: string): Promise<Staff> => {
        const response = await api.patch(`/admin/staff/${id}/status`, { status });
        return response.data.data;
    },

    deleteStaff: async (id: number): Promise<void> => {
        await api.delete(`/admin/staff/${id}`);
    }
};

export default staffService;
