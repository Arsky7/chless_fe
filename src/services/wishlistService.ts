import api from './api';
import { Product } from './publicService';

export interface WishlistItem {
    id: number;
    user_id: number;
    product_id: number;
    created_at: string;
    updated_at: string;
    product: Product;
}

export const wishlistService = {
    /**
     * Get all wishlist items for the authenticated user
     */
    getWishlist: async () => {
        const response = await api.get('/wishlists');
        return response.data;
    },

    /**
     * Toggle a product in the wishlist
     */
    toggleWishlist: async (productId: number) => {
        const response = await api.post('/wishlists/toggle', { product_id: productId });
        return response.data;
    }
};
