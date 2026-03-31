import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { publicService, Product } from '../../services/publicService';
import { getImageUrl } from '../../config/api.config';
import { ChevronRight, Heart, Loader2, ShoppingBag, Minus, Plus } from 'lucide-react';
import ProductCard from '../../components/public/ProductCard';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import toast from 'react-hot-toast';

const ProductDetailsPage: React.FC = () => {
    const { slug } = useParams<{ slug: string }>();
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const { toggleItem, isInWishlist } = useWishlist();
    const [product, setProduct] = useState<Product | null>(null);
    const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeImage, setActiveImage] = useState<string>('');
    const [selectedSize, setSelectedSize] = useState<number | null>(null);
    const [quantity, setQuantity] = useState(1);

    const handleQuantityChange = (type: 'inc' | 'dec') => {
        if (type === 'inc') setQuantity(prev => prev + 1);
        if (type === 'dec' && quantity > 1) setQuantity(prev => prev - 1);
    };

    const handleAddToCart = () => {
        if (!product) return;
        if (!selectedSize) {
            toast.error('Please select a size first.');
            return;
        }

        const sizeObj = (product as any).sizes.find((s: any) => s.id === selectedSize);
        addToCart(product, quantity, selectedSize, sizeObj?.size || 'Standard');
    };

    useEffect(() => {
        if (slug) {
            fetchProduct(slug);
        }
    }, [slug]);

    const fetchProduct = async (productSlug: string) => {
        try {
            setLoading(true);
            const response = await publicService.getProductBySlug(productSlug);

            if (response.success && response.data) {
                // Backend returns data: { product: ..., related: ... }
                const productData = response.data.product || response.data;
                const relatedData = response.data.related || [];

                setProduct(productData);
                setRelatedProducts(relatedData);

                // Set initial active image
                const mainImg = productData.images?.find((img: any) => img.is_main) || productData.images?.[0];
                if (mainImg) {
                    setActiveImage(getImageUrl(mainImg.full_url || mainImg.url || mainImg.path));
                }
            } else {
                navigate('/shop');
            }
        } catch (error) {
            console.error('Failed to fetch product:', error);
            navigate('/shop');
        } finally {
            setLoading(false);
        }
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(price);
    };

    if (loading) {
        return (
            <div className="w-full flex items-center justify-center min-h-[50vh]">
                <Loader2 className="w-10 h-10 animate-spin text-black" />
            </div>
        );
    }

    if (!product) return null;

    return (
        <div className="w-full flex flex-col">
            {/* Breadcrumb */}
            <div className="bg-white border-b border-[#e5e5e5] px-6 py-4 md:px-16 flex items-center gap-2 text-[11px] font-semibold tracking-[1px] uppercase text-[#666]">
                <Link to="/" className="hover:text-black transition-colors">Home</Link>
                <ChevronRight className="w-3 h-3" />
                <Link to="/shop" className="hover:text-black transition-colors">Shop</Link>
                <ChevronRight className="w-3 h-3" />
                <span className="text-black">{product.name}</span>
            </div>

            <div className="max-w-[1400px] mx-auto px-6 md:px-16 pt-12">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">

                    {/* Left: Image Gallery */}
                    <div className="space-y-4">
                        {/* Main Image */}
                        <div className="relative bg-white aspect-[4/5] overflow-hidden rounded-md border border-[#e5e5e5]">
                            {activeImage ? (
                                <img
                                    src={activeImage}
                                    alt={product.name}
                                    className="w-full h-full object-cover object-center"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
                                    No Image Available
                                </div>
                            )}

                            {/* Badge */}
                            {(product.sale_price || product.is_featured) && (
                                <span className={`absolute top - 4 left - 4 text - white px - 3 py - 1.5 text - [10px] font - bold tracking - widest uppercase rounded - sm z - 10 ${product.sale_price ? 'bg-[#ff4d6d]' : 'bg-black'} `}>
                                    {product.sale_price ? 'Sale' : 'Featured'}
                                </span>
                            )}
                        </div>

                        {/* Thumbnails */}
                        {product.images && product.images.length > 1 && (
                            <div className="grid grid-cols-4 gap-4">
                                {product.images.map((img) => {
                                    const imgUrl = getImageUrl(img.full_url || img.url || img.path);
                                    const isActive = activeImage === imgUrl;
                                    return (
                                        <button
                                            key={img.id}
                                            onClick={() => setActiveImage(imgUrl)}
                                            className={`relative aspect - [4 / 5] overflow - hidden rounded - md border - 2 transition - all duration - 200 ${isActive ? 'border-black' : 'border-transparent hover:border-[#e5e5e5]'} `}
                                        >
                                            <img src={imgUrl} alt="Thumbnail" loading="lazy" decoding="async" className="w-full h-full object-cover" />
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* Right: Product Info */}
                    <div className="flex flex-col pt-4">
                        <div className="text-[11px] font-semibold tracking-[2px] uppercase text-[#666] mb-3">
                            {product.category?.name || 'CHLESS COLLECTION'}
                        </div>

                        <h1 className="text-3xl md:text-4xl font-bold text-black mb-4 tracking-tight leading-tight">
                            {product.name}
                        </h1>

                        <div className="flex items-center gap-4 mb-8">
                            <span className="text-2xl font-bold text-black">
                                {formatPrice(product.sale_price || product.base_price)}
                            </span>
                            {product.sale_price && (
                                <span className="text-lg text-[#666] line-through">
                                    {formatPrice(product.base_price)}
                                </span>
                            )}
                        </div>

                        {/* Short Description */}
                        {product.short_description && (
                            <p className="text-[#666] text-sm leading-relaxed mb-10 pb-10 border-b border-[#e5e5e5]">
                                {product.short_description}
                            </p>
                        )}

                        {/* Sizes */}
                        {(product as any).sizes && (product as any).sizes.length > 0 && (
                            <div className="mb-8">
                                <div className="flex items-center justify-between mb-4">
                                    <span className="text-xs font-bold tracking-widest uppercase text-black">Select Size</span>
                                </div>
                                <div className="flex flex-wrap gap-3">
                                    {(product as any).sizes.map((sizeObj: any) => {
                                        const isOutOfStock = sizeObj.available_stock === 0;
                                        return (
                                            <button
                                                key={sizeObj.id}
                                                disabled={isOutOfStock}
                                                onClick={() => setSelectedSize(sizeObj.id)}
                                                className={`h-12 px-6 flex items-center justify-center text-sm font-semibold border transition-all duration-300 ${selectedSize === sizeObj.id
                                                    ? 'border-black bg-black text-white'
                                                    : isOutOfStock
                                                        ? 'border-[#e5e5e5] bg-gray-50 text-gray-400 cursor-not-allowed'
                                                        : 'border-[#e5e5e5] bg-white text-black hover:border-black'
                                                    }`}
                                            >
                                                {sizeObj.size}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Actions */}
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-bold tracking-widest uppercase text-black">Quantity</span>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="flex items-center border border-[#e5e5e5] rounded-sm bg-white h-14">
                                    <button
                                        onClick={() => handleQuantityChange('dec')}
                                        className="w-14 h-full flex items-center justify-center text-[#666] hover:text-black transition-colors"
                                    >
                                        <Minus className="w-4 h-4" />
                                    </button>
                                    <span className="w-12 text-center text-sm font-semibold">{quantity}</span>
                                    <button
                                        onClick={() => handleQuantityChange('inc')}
                                        className="w-14 h-full flex items-center justify-center text-[#666] hover:text-black transition-colors"
                                    >
                                        <Plus className="w-4 h-4" />
                                    </button>
                                </div>

                                <button
                                    onClick={handleAddToCart}
                                    className="flex-1 h-14 bg-black text-white flex items-center justify-center gap-3 text-sm font-bold tracking-[1.5px] uppercase rounded-sm transition-all duration-300 hover:bg-[#ff4d6d]"
                                >
                                    <ShoppingBag className="w-4 h-4" />
                                    Add to Cart
                                </button>

                                <button
                                    onClick={() => toggleItem(product.id)}
                                    className={`w-14 h-14 flex items-center justify-center border rounded-sm transition-all duration-300 ${isInWishlist(product.id)
                                        ? 'border-[#ff4d6d] text-[#ff4d6d] bg-[#fff0f3]'
                                        : 'border-[#e5e5e5] bg-white text-black hover:text-[#ff4d6d] hover:border-[#ff4d6d]'
                                        }`}
                                >
                                    <Heart className={`w-5 h-5 ${isInWishlist(product.id) ? 'fill-current' : ''}`} />
                                </button>
                            </div>
                        </div>

                        {/* Full Description Details */}
                        {product.description && (
                            <div className="mt-16 pt-10 border-t border-[#e5e5e5]">
                                <h3 className="text-sm font-bold tracking-widest uppercase text-black mb-6">Product Description</h3>
                                <div
                                    className="prose prose-sm text-[#555] max-w-none leading-relaxed prose-p:mb-4"
                                    dangerouslySetInnerHTML={{ __html: product.description }}
                                />
                            </div>
                        )}
                    </div>
                </div>

                {/* Related Products */}
                {relatedProducts.length > 0 && (
                    <div className="mt-32 pt-16 border-t border-[#e5e5e5]">
                        <div className="flex items-center justify-between mb-12">
                            <h2 className="text-2xl font-bold tracking-tight text-black">You May Also Like</h2>
                            <Link to="/shop" className="text-sm font-bold tracking-widest uppercase text-black hover:text-[#ff4d6d] transition-colors">
                                View All
                            </Link>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                            {relatedProducts.map(related => (
                                <ProductCard
                                    key={related.id}
                                    product={related}
                                    badge={related.sale_price ? 'Sale' : undefined}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductDetailsPage;
