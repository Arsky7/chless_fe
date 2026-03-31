import api from './api';

export interface CheckoutPayload {
    items: {
        product_id: number;
        quantity: number;
        size: string;
    }[];
    customer_name: string;
    customer_email: string;
    customer_phone: string;
    country: string;
    sub_district_city: string;
    address_details: string;
    notes: string;
    district: string;
    postal_code: string;
    shipping_cost?: number;
    shipping_method?: string;
}

export interface CheckoutResponse {
    success: boolean;
    snap_token?: string;
    order?: any;
    message?: string;
}

export const checkoutService = {
    /**
     * Submit checkout payload to backend and receive Snap token.
     */
    processCheckout: async (payload: CheckoutPayload): Promise<CheckoutResponse> => {
        try {
            const response = await api.post('/checkout', payload);
            return response.data;
        } catch (error: any) {
            console.error('Checkout error:', error);
            if (error.response?.data) {
                return error.response.data;
            }
            return {
                success: false,
                message: error.message || 'An error occurred during checkout.'
            };
        }
    }
};
