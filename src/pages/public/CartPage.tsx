import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { getImageUrl } from '../../config/api.config';
import { ShoppingBag, Minus, Plus, Trash2, ArrowRight } from 'lucide-react';

const CartPage: React.FC = () => {
    const navigate = useNavigate();
    const { items, updateQuantity, removeFromCart, totalPrice, totalItems } = useCart();

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(price);
    };

    if (items.length === 0) {
        return (
            <div className="w-full flex flex-col items-center justify-center py-20 px-6 min-h-[50vh]">
                <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-sm mb-6">
                    <ShoppingBag className="w-10 h-10 text-[#d1d5db]" />
                </div>
                <h1 className="text-3xl font-bold text-black mb-4 tracking-tight">Your Cart is Empty</h1>
                <p className="text-[#666] text-center max-w-md mb-8">
                    Looks like you haven't added anything to your cart yet. Browse our collections and find something you love.
                </p>
                <Link
                    to="/shop"
                    className="h-14 px-8 bg-black text-white flex items-center justify-center gap-2 text-sm font-bold tracking-[1.5px] uppercase rounded-sm transition-all duration-300 hover:bg-[#ff4d6d]"
                >
                    Continue Shopping
                    <ArrowRight className="w-4 h-4" />
                </Link>
            </div>
        );
    }

    return (
        <div className="w-full flex flex-col pb-24">
            <div className="bg-white border-b border-[#e5e5e5] px-6 py-8 md:px-16 text-center">
                <h1 className="text-3xl font-bold text-black tracking-tight uppercase">Your Shopping Cart</h1>
                <p className="text-[#666] mt-2 text-sm tracking-widest uppercase">
                    {totalItems} {totalItems === 1 ? 'Item' : 'Items'} in Bag
                </p>
            </div>

            <div className="max-w-[1400px] w-full mx-auto px-6 md:px-16 pt-12">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">

                    {/* Cart Items List */}
                    <div className="lg:col-span-8 space-y-6">
                        {/* Table Header (Desktop Only) */}
                        <div className="hidden lg:grid grid-cols-12 gap-4 pb-4 border-b border-[#e5e5e5] text-xs font-bold tracking-widest uppercase text-[#9ca3af]">
                            <div className="col-span-6">Product Details</div>
                            <div className="col-span-3 text-center">Quantity</div>
                            <div className="col-span-2 text-right">Price</div>
                            <div className="col-span-1 text-right">Remove</div>
                        </div>

                        {/* Items */}
                        <div className="space-y-8 lg:space-y-6">
                            {items.map((item) => {
                                const activePrice = item.product.sale_price || item.product.base_price;
                                const mainImg = item.product.images?.find((img: any) => img.is_main) || item.product.images?.[0];
                                const imgUrl = mainImg ? getImageUrl(mainImg.full_url || mainImg.url || mainImg.path) : 'https://placehold.co/100x120/f3f4f6/a1a1aa?text=Image';

                                return (
                                    <div key={item.id} className="group flex flex-col sm:flex-row items-start lg:grid lg:grid-cols-12 gap-6 pb-6 border-b border-[#e5e5e5] last:border-0 relative">

                                        {/* Product Info */}
                                        <div className="sm:w-full lg:col-span-6 flex gap-6">
                                            <Link to={`/product/${item.product.slug}`} className="shrink-0 w-24 h-32 md:w-28 md:h-36 bg-gray-100 rounded overflow-hidden">
                                                <img src={imgUrl} alt={item.product.name} loading="lazy" decoding="async" className="w-full h-full object-cover" />
                                            </Link>
                                            <div className="flex flex-col justify-center">
                                                <div className="text-[10px] sm:text-xs font-bold tracking-[2px] uppercase text-[#666] mb-1.5">
                                                    {item.product.category?.name || 'CHLESS'}
                                                </div>
                                                <Link to={`/product/${item.product.slug}`} className="text-sm sm:text-base font-bold text-black hover:text-[#ff4d6d] transition-colors line-clamp-2 leading-tight mb-2">
                                                    {item.product.name}
                                                </Link>
                                                <p className="text-[#666] text-xs font-medium bg-gray-100 px-2 py-1 inline-block rounded self-start">
                                                    Size: <span className="text-black font-bold ml-1">{item.sizeName}</span>
                                                </p>
                                                {/* Mobile Price */}
                                                <div className="lg:hidden mt-3 text-sm font-bold">
                                                    {formatPrice(activePrice)}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Quantity */}
                                        <div className="w-full sm:w-auto lg:col-span-3 flex items-center lg:justify-center">
                                            <div className="flex items-center border border-[#e5e5e5] rounded-sm bg-white h-10 sm:h-12 lg:mx-auto">
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                    className="w-10 sm:w-12 h-full flex items-center justify-center text-[#666] hover:text-black transition-colors"
                                                    disabled={item.quantity <= 1}
                                                >
                                                    <Minus className="w-3.5 h-3.5" />
                                                </button>
                                                <span className="w-8 sm:w-10 text-center text-xs sm:text-sm font-semibold">{item.quantity}</span>
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                    className="w-10 sm:w-12 h-full flex items-center justify-center text-[#666] hover:text-black transition-colors"
                                                >
                                                    <Plus className="w-3.5 h-3.5" />
                                                </button>
                                            </div>
                                        </div>

                                        {/* Desktop Price */}
                                        <div className="hidden lg:flex lg:col-span-2 items-center justify-end flex-col group/price">
                                            <span className="text-sm font-bold text-black mt-16 lg:mt-0">
                                                {formatPrice(activePrice * item.quantity)}
                                            </span>
                                        </div>

                                        {/* Mobile Remove Button (Absolute top right) */}
                                        <button
                                            onClick={() => removeFromCart(item.id)}
                                            className="absolute top-0 right-0 lg:hidden p-2 text-[#9ca3af] hover:text-[#ff4d6d] transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>

                                        {/* Desktop Remove Button */}
                                        <div className="hidden lg:flex lg:col-span-1 items-center justify-end">
                                            <button
                                                onClick={() => removeFromCart(item.id)}
                                                className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-50 text-[#9ca3af] hover:bg-[#ffe4e6] hover:text-[#ff4d6d] transition-colors group-hover:opacity-100 lg:opacity-0"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-4">
                        <div className="bg-white border border-[#e5e5e5] rounded-md p-6 lg:p-8 sticky top-24">
                            <h2 className="text-lg font-bold text-black mb-6 uppercase tracking-wider">Order Summary</h2>

                            <div className="space-y-4 text-sm mb-6 border-b border-[#e5e5e5] pb-6">
                                <div className="flex justify-between text-[#666]">
                                    <span>Subtotal</span>
                                    <span className="font-semibold text-black">{formatPrice(totalPrice)}</span>
                                </div>
                                <div className="flex justify-between text-[#666]">
                                    <span>Shipping</span>
                                    <span className="text-black">Calculated at checkout</span>
                                </div>
                            </div>

                            <div className="flex justify-between items-center mb-8">
                                <span className="text-base font-bold uppercase tracking-wider">Total</span>
                                <span className="text-xl font-bold text-black">{formatPrice(totalPrice)}</span>
                            </div>

                            <button
                                onClick={() => navigate('/checkout')}
                                className="w-full h-14 bg-black text-white flex items-center justify-center text-sm font-bold tracking-[1.5px] uppercase rounded-sm transition-all duration-300 hover:bg-[#ff4d6d] hover:shadow-lg"
                            >
                                Proceed to Checkout
                            </button>

                            <p className="text-center text-xs text-[#999] mt-6 flex items-center justify-center gap-2">
                                <ShoppingBag className="w-3.5 h-3.5" />
                                Secure Checkout Provided
                            </p>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default CartPage;
