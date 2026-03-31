import React, { useEffect } from 'react';
import { useWishlist } from '../../context/WishlistContext';
import ProductCard from '../../components/public/ProductCard';
import { Heart, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';

const WishlistPage: React.FC = () => {
    const { items, isLoading, refreshWishlist } = useWishlist();

    useEffect(() => {
        window.scrollTo(0, 0);
        refreshWishlist();
    }, [refreshWishlist]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <div className="w-8 h-8 border-4 border-gray-200 border-t-black rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="w-full min-h-screen bg-white pt-24 pb-32">
            <div className="max-w-[1600px] mx-auto px-4 lg:px-8">

                {/* Header Section */}
                <div className="mb-12 border-b border-[#eaeaea] pb-8 text-center lg:text-left">
                    <h1 className="text-3xl lg:text-4xl font-extrabold tracking-[2px] uppercase text-black mb-3">
                        My Wishlist
                    </h1>
                    <p className="text-[#666] text-sm lg:text-base font-['Inter']">
                        {items.length} {items.length === 1 ? 'Item' : 'Items'} saved for later.
                    </p>
                </div>

                {/* Empty State */}
                {items.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <div className="w-24 h-24 bg-[#f5f5f5] rounded-full flex items-center justify-center mb-6">
                            <Heart className="w-10 h-10 text-[#a0a0a0]" />
                        </div>
                        <h2 className="text-2xl font-bold text-black uppercase tracking-[1px] mb-4">
                            Your wishlist is empty
                        </h2>
                        <p className="text-[#666] font-['Inter'] max-w-md mx-auto mb-8">
                            Looks like you haven't saved any items yet. Discover our latest collections and find something you love.
                        </p>
                        <Link
                            to="/shop"
                            className="inline-flex items-center justify-center bg-black text-white px-8 py-4 text-xs font-bold uppercase tracking-[2px] hover:bg-[#ff4d6d] transition-colors"
                        >
                            <ShoppingBag className="w-4 h-4 mr-2" />
                            Continue Shopping
                        </Link>
                    </div>
                )}

                {/* Wishlist Grid */}
                {items.length > 0 && (
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-8">
                        {items.map((wishlistItem) => (
                            <ProductCard
                                key={wishlistItem.id}
                                product={wishlistItem.product}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default WishlistPage;
