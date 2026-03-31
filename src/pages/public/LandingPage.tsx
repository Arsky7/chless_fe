import React, { useEffect, useState } from 'react';
import Hero from '../../components/public/Hero';
import ProductCard from '../../components/public/ProductCard';
import BrandStory from '../../components/public/BrandStory';
import Newsletter from '../../components/public/Newsletter';
import { publicService, Product } from '../../services/publicService';

const LandingPage: React.FC = () => {
    const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
    const [newArrivals, setNewArrivals] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [featuredRes, arrivalsRes] = await Promise.all([
                    publicService.getFeaturedProducts(),
                    publicService.getNewArrivals()
                ]);

                if (featuredRes.success) setFeaturedProducts(featuredRes.data);
                if (arrivalsRes.success) setNewArrivals(arrivalsRes.data);
            } catch (error) {
                console.error('Failed to fetch landing page data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="bg-white font-['Inter'] w-full">
            <div className="w-full">
                {/* Hero Section */}
                <Hero />

                {/* Best Seller Section */}
                <section id="shop" className="py-24 px-6 md:px-12 bg-white">
                    <div className="text-center mb-16">
                        <div className="text-[12px] font-semibold tracking-[3px] uppercase text-[#ff4d6d] mb-3">
                            Top Picks
                        </div>
                        <h2 className="text-4xl md:text-5xl font-extrabold text-black tracking-tighter">
                            Best Seller Products
                        </h2>
                    </div>

                    {loading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 max-w-[1400px] mx-auto">
                            {Array.from({ length: 4 }).map((_, i) => (
                                <div key={i} className="animate-pulse flex flex-col gap-4">
                                    <div className="bg-gray-200 rounded-md pt-[125%] w-full"></div>
                                    <div className="h-4 bg-gray-200 rounded w-1/3 mt-2"></div>
                                    <div className="h-5 bg-gray-200 rounded w-3/4"></div>
                                    <div className="h-6 bg-gray-200 rounded w-1/4 mt-1"></div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 max-w-[1400px] mx-auto">
                            {featuredProducts.map((product) => (
                                <ProductCard key={product.id} product={product} badge="Best Seller" />
                            ))}
                        </div>
                    )}
                </section>

                {/* New Arrivals Section */}
                <section id="new-arrivals" className="py-24 px-6 md:px-12 bg-[#f5f5f5]">
                    <div className="text-center mb-16">
                        <div className="text-[12px] font-semibold tracking-[3px] uppercase text-[#ff4d6d] mb-3">
                            Latest
                        </div>
                        <h2 className="text-4xl md:text-5xl font-extrabold text-black tracking-tighter">
                            New Arrivals
                        </h2>
                    </div>

                    {loading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 max-w-[1400px] mx-auto">
                            {Array.from({ length: 4 }).map((_, i) => (
                                <div key={i} className="animate-pulse flex flex-col gap-4">
                                    <div className="bg-gray-200 rounded-md pt-[125%] w-full"></div>
                                    <div className="h-4 bg-gray-200 rounded w-1/3 mt-2"></div>
                                    <div className="h-5 bg-gray-200 rounded w-3/4"></div>
                                    <div className="h-6 bg-gray-200 rounded w-1/4 mt-1"></div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 max-w-[1400px] mx-auto">
                            {newArrivals.map((product) => (
                                <ProductCard key={product.id} product={product} badge="New" />
                            ))}
                        </div>
                    )}
                </section>

                {/* Special CTA */}
                <section className="relative py-28 px-6 md:px-12 text-center text-white overflow-hidden">
                    <div
                        className="absolute inset-0 z-0 bg-cover bg-center brightness-[0.3]"
                        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070&auto=format&fit=crop')" }}
                    ></div>

                    <div className="relative z-10 max-w-3xl mx-auto">
                        <div className="text-sm font-bold tracking-[2px] uppercase mb-4 text-[#ff4d6d]">Limited Time Offer</div>
                        <h2 className="text-4xl md:text-5xl font-extrabold mb-6 tracking-tight">
                            GET <span className="text-[#ff4d6d]">50% OFF</span> ON YOUR FIRST ORDER
                        </h2>
                        <p className="text-lg md:text-xl text-white/90 mb-10 leading-relaxed">
                            Join thousands of streetwear enthusiasts who trust CHLESS for premium quality and bold designs.
                            Sign up today and elevate your style game.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button className="px-12 py-5 bg-[#ff4d6d] text-white text-base font-bold tracking-wider uppercase transition-all duration-300 hover:bg-[#e63955] hover:-translate-y-1 rounded-sm">
                                Claim Your Discount
                            </button>
                            <a href="#shop" className="px-12 py-5 bg-transparent border-2 border-white text-white text-base font-bold tracking-wider uppercase transition-all duration-300 hover:bg-white hover:text-black rounded-sm">
                                Browse Collection
                            </a>
                        </div>

                        <div className="flex justify-center flex-wrap gap-8 md:gap-16 mt-16 pt-12 border-t border-white/10">
                            <div className="text-center">
                                <div className="text-4xl font-extrabold text-[#ff4d6d] mb-1">10K+</div>
                                <div className="text-[11px] font-bold tracking-[2px] uppercase text-white/60">Happy Customers</div>
                            </div>
                            <div className="text-center">
                                <div className="text-4xl font-extrabold text-[#ff4d6d] mb-1">500+</div>
                                <div className="text-[11px] font-bold tracking-[2px] uppercase text-white/60">Unique Designs</div>
                            </div>
                            <div className="text-center">
                                <div className="text-4xl font-extrabold text-[#ff4d6d] mb-1">50+</div>
                                <div className="text-[11px] font-bold tracking-[2px] uppercase text-white/60">Countries</div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Brand Story */}
                <BrandStory />

                {/* Newsletter */}
                <Newsletter />

            </div>
        </div>
    );
};

export default LandingPage;
