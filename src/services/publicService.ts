import api from './api';

export interface Product {
    id: number;
    name: string;
    slug: string;
    category_id: number;
    short_description: string;
    description: string;
    base_price: number;
    sale_price: number | null;
    is_featured: boolean;
    images: {
        id: number;
        url: string;
        path: string;
        full_url: string;
        is_main: boolean;
    }[];
    category: {
        id: number;
        name: string;
        slug: string;
    };
}

export const publicService = {
    getFeaturedProducts: async () => {
        const response = await api.get('/v1/products/featured');
        return response.data;
    },
    getNewArrivals: async () => {
        const response = await api.get('/v1/products/new-arrivals');
        return response.data;
    },
    getCategories: async () => {
        const response = await api.get('/v1/categories');
        return response.data;
    },
    getProducts: async (params?: any) => {
        const response = await api.get('/v1/products', { params });
        return response.data;
    },
    getProductBySlug: async (slug: string) => {
        const response = await api.get(`/v1/products/${slug}`);
        return response.data;
    }
};
