import { apiService } from './api';

export type SettingsMap = Record<string, any>;

export interface SettingsResponse {
    data: SettingsMap;
}

export const settingService = {
    getSettings: async (): Promise<SettingsResponse> => {
        return await apiService.get<SettingsResponse>('/admin/settings');
    },

    updateSettings: async (settings: SettingsMap): Promise<SettingsResponse> => {
        return await apiService.put<SettingsResponse>('/admin/settings', settings);
    },
};
