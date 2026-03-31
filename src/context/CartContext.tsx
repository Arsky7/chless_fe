import React, { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Product } from '../services/publicService';

export interface CartItem {
    id: string; // Unique ID combining product id and size id
    product: Product;
    quantity: number;
    sizeId: number;
    sizeName: string;
}

interface CartContextType {
    items: CartItem[];
    addToCart: (product: Product, quantity: number, sizeId: number, sizeName: string) => void;
    removeFromCart: (id: string) => void;
    updateQuantity: (id: string, quantity: number) => void;
    clearCart: () => void;
    totalItems: number;
    totalPrice: number;
    isCartOpen: boolean;
    setCartOpen: (isOpen: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [items, setItems] = useState<CartItem[]>(() => {
        const saved = localStorage.getItem('chless_cart');
        if (saved) {
            try {
                return JSON.parse(saved);
            } catch (e) {
                return [];
            }
        }
        return [];
    });

    const [isCartOpen, setCartOpen] = useState(false);

    useEffect(() => {
        localStorage.setItem('chless_cart', JSON.stringify(items));
    }, [items]);

    const addToCart = (product: Product, quantity: number, sizeId: number, sizeName: string) => {
        setItems(prev => {
            const uniqueId = `${product.id}-${sizeId}`;
            const existing = prev.find(item => item.id === uniqueId);

            if (existing) {
                toast.success(`Updated ${product.name} quantity.`);
                return prev.map(item =>
                    item.id === uniqueId
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                );
            }

            toast.success(`Added ${product.name} to cart!`);
            return [...prev, {
                id: uniqueId,
                product,
                quantity,
                sizeId,
                sizeName
            }];
        });
        setCartOpen(true);
    };

    const removeFromCart = (id: string) => {
        setItems(prev => prev.filter(item => item.id !== id));
        toast.success("Item removed from cart.");
    };

    const updateQuantity = (id: string, quantity: number) => {
        if (quantity < 1) return;
        setItems(prev => prev.map(item =>
            item.id === id ? { ...item, quantity } : item
        ));
    };

    const clearCart = () => {
        setItems([]);
        toast.success("Cart cleared.");
    };

    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

    const totalPrice = items.reduce((sum, item) => {
        const currentPrice = item.product.sale_price ?? item.product.base_price;
        return sum + (currentPrice * item.quantity);
    }, 0);

    return (
        <CartContext.Provider value={{
            items,
            addToCart,
            removeFromCart,
            updateQuantity,
            clearCart,
            totalItems,
            totalPrice,
            isCartOpen,
            setCartOpen
        }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};
