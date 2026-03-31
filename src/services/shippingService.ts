import api from './api';

export interface Province {
    province_id: string;
    province: string;
}

export interface City {
    city_id: string;
    province_id: string;
    province: string;
    type: string;
    city_name: string;
    postal_code: string;
}

export interface ShippingService {
    service: string;
    description: string;
    cost: {
        value: number;
        etd: string;
        note: string;
    }[];
}

export interface ShippingResult {
    code: string;
    name: string;
    costs: ShippingService[];
}

export interface ShippingStats {
    ready_to_ship: number;
    shipped: number;
    delivered: number;
    total_shipping_cost: number;
}

export const shippingService = {
    // Admin features
    getStats: async (): Promise<ShippingStats> => {
        const res = await api.get('/admin/shipping/stats');
        // The backend returns the object directly, not wrapped in a data property
        return res.data;
    },

    getShipments: async (params?: any) => {
        const res = await api.get('/admin/shipping', { params });
        // The backend uses OrderResource::collection which returns a paginated structure with a data property
        return res.data;
    },

    updateTracking: async (orderId: number, trackingNumber: string, courierName?: string) => {
        const res = await api.patch(`/admin/shipping/${orderId}/tracking`, {
            tracking_number: trackingNumber,
            courier: courierName
        });
        // The backend returns new OrderResource(...) which unwraps to an object with a data property
        return res.data;
    },

    markDelivered: async (orderId: number) => {
        const res = await api.patch(`/admin/shipping/${orderId}/delivered`);
        return res.data;
    },

    // Public features
    getProvinces: async (): Promise<Province[]> => {
        const res = await api.get('/v1/shipping/provinces');
        return res.data.data || [];
    },

    getCities: async (provinceId: string): Promise<City[]> => {
        const res = await api.get(`/v1/shipping/cities?province_id=${provinceId}`);
        return res.data.data || [];
    },

    calculateCost: async (
        destinationCityId: string,
        weight: number,
        courier: string
    ): Promise<ShippingResult[]> => {
        const res = await api.post('/v1/shipping/calculate', {
            destination: parseInt(destinationCityId),
            weight,
            courier
        });
        return res.data.data || [];
    }
};
