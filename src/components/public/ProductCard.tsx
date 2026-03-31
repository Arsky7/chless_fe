import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../../services/publicService';
import { getImageUrl } from '../../config/api.config';
import { useWishlist } from '../../context/WishlistContext';
import { Heart } from 'lucide-react';

interface ProductCardProps {
    product: Product;
    badge?: string;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, badge }) => {
    const { toggleItem, isInWishlist } = useWishlist();
    const isWished = isInWishlist(product.id);

    const rawImage = product.images?.find(img => img.is_main) || product.images?.[0];
    const mainImage = getImageUrl(rawImage?.full_url || rawImage?.url || rawImage?.path);

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(price);
    };

    return (
        <Link
            to={`/product/${product.slug}`}
            className="block bg-white rounded overflow-hidden group transition-all duration-300 border border-transparent hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(0,0,0,0.08)] hover:border-[#e5e5e5] cursor-pointer"
        >
            <div className="relative pt-[125%] overflow-hidden bg-[#f9f9f9]">
                <img
                    src={mainImage}
                    alt={product.name}
                    loading="lazy"
                    decoding="async"
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.08]"
                />

                {/* Wishlist Button */}
                <button
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        toggleItem(product.id);
                    }}
                    className={`absolute top-3 right-3 w-9 h-9 bg-white border-none rounded-full flex items-center justify-center text-lg transition-all duration-300 z-10 shadow-sm ${isWished
                        ? 'opacity-100 text-[#ff4d6d]'
                        : 'opacity-0 group-hover:opacity-100 hover:bg-[#ff4d6d] hover:text-white text-gray-400'
                        } hover:scale-110`}
                    aria-label={isWished ? "Remove from wishlist" : "Add to wishlist"}
                >
                    <Heart className={`w-5 h-5 ${isWished ? 'fill-current' : ''}`} />
                </button>

                {/* Badge */}
                {(badge || product.is_featured) && (
                    <span className={`absolute top-3 left-3 text-white px-3 py-1.5 text-[10px] font-bold tracking-widest uppercase rounded-sm z-10 ${badge === 'Sale' ? 'bg-[#ff4d6d]' : 'bg-black'}`}>
                        {badge || 'Featured'}
                    </span>
                )}
            </div>

            <div className="p-5">
                <div className="text-[11px] font-semibold tracking-[2px] uppercase text-[#666] mb-2">
                    {product.category?.name || 'CHLESS'}
                </div>
                <h4 className="text-base font-semibold text-black mb-3 tracking-tight leading-relaxed truncate">
                    {product.name}
                </h4>

                <div className="flex items-center gap-3 mb-4">
                    <span className="text-xl font-bold text-black">
                        {formatPrice(product.sale_price || product.base_price)}
                    </span>
                    {product.sale_price && (
                        <span className="text-base text-[#666] line-through">
                            {formatPrice(product.base_price)}
                        </span>
                    )}
                </div>
            </div>
        </Link>
    );
};

export default ProductCard;
