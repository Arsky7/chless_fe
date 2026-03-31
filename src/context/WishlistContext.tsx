import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { wishlistService, WishlistItem } from '../services/wishlistService';
import toast from 'react-hot-toast';

interface WishlistContextType {
    items: WishlistItem[];
    totalItems: number;
    isLoading: boolean;
    toggleItem: (productId: number) => Promise<boolean>;
    isInWishlist: (productId: number) => boolean;
    refreshWishlist: () => Promise<void>;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
    const [items, setItems] = useState<WishlistItem[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const refreshWishlist = useCallback(async () => {
        if (!isAuthenticated) {
            setItems([]);
            return;
        }

        try {
            setIsLoading(true);
            const response = await wishlistService.getWishlist();
            if (response.success) {
                setItems(response.data);
            }
        } catch (error) {
            console.error('Failed to fetch wishlist:', error);
        } finally {
            setIsLoading(false);
        }
    }, [isAuthenticated]);

    // Fetch wishlist on mount or when auth state changes
    useEffect(() => {
        refreshWishlist();
    }, [refreshWishlist]);

    const toggleItem = async (productId: number): Promise<boolean> => {
        if (!isAuthenticated) {
            toast.error('Please log in to manage your wishlist');
            return false;
        }

        try {
            // Optimistic update
            const inWishlist = items.some(item => item.product_id === productId);

            if (inWishlist) {
                setItems(prev => prev.filter(item => item.product_id !== productId));
            }

            const response = await wishlistService.toggleWishlist(productId);

            if (response.success) {
                if (response.action === 'added') {
                    toast.success('Added to wishlist');
                    // Need to refetch to get the full product details
                    refreshWishlist();
                } else {
                    toast.success('Removed from wishlist');
                }
                return true;
            }
            return false;
        } catch (error) {
            console.error('Toggle wishlist failed:', error);
            toast.error('Failed to update wishlist');

            // Revert optimistic update gracefully by refetching
            refreshWishlist();
            return false;
        }
    };

    const isInWishlist = (productId: number): boolean => {
        return items.some(item => item.product_id === productId);
    };

    return (
        <WishlistContext.Provider value={{
            items,
            totalItems: items.length,
            isLoading,
            toggleItem,
            isInWishlist,
            refreshWishlist
        }}>
            {children}
        </WishlistContext.Provider>
    );
};

export const useWishlist = () => {
    const context = useContext(WishlistContext);
    if (context === undefined) {
        throw new Error('useWishlist must be used within a WishlistProvider');
    }
    return context;
};
