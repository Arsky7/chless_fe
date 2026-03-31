import React, { useState, useEffect } from 'react';
import ProductCard from '../../components/public/ProductCard';
import ArrivalsHeader from '../../components/public/ArrivalsHeader';
import { publicService, Product } from '../../services/publicService';

const NewArrivalsPage: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeFilter, setActiveFilter] = useState('All New');

    const filters = ['All New', 'Tops', 'Bottoms', 'Outerwear', 'Footwear', 'Accessories'];

    useEffect(() => {
        fetchNewArrivals();
    }, []);

    const fetchNewArrivals = async () => {
        try {
            setLoading(true);
            const response = await publicService.getNewArrivals();
            if (response.success) {
                // In a real app, the filter might be handled by the backend
                // For now, we fetch all new arrivals
                setProducts(response.data);
            }
        } catch (error) {
            console.error('Failed to fetch new arrivals:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full flex flex-col">
            <ArrivalsHeader />

            {/* Filter Section */}
            <section className="bg-white border-b border-[#e5e5e5] px-6 py-6 md:px-16 sticky top-0 z-40 bg-opacity-90 backdrop-blur-sm">
                <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row items-center gap-6">
                    <span className="text-sm font-bold text-black whitespace-nowrap uppercase tracking-wider">Filter by:</span>
                    <div className="flex flex-wrap gap-2 justify-center">
                        {filters.map((filter) => (
                            <button
                                key={filter}
                                onClick={() => setActiveFilter(filter)}
                                className={`px-5 py-2 text-xs font-semibold rounded-full transition-all duration-300 border ${activeFilter === filter
                                    ? 'bg-black text-white border-black shadow-md'
                                    : 'bg-transparent text-[#666] border-[#e5e5e5] hover:border-black hover:text-black'
                                    }`}
                            >
                                {filter}
                            </button>
                        ))}
                    </div>
                    <div className="ml-auto flex items-center gap-4">
                        <select className="px-4 py-2 border border-[#e5e5e5] text-xs font-semibold text-black rounded bg-white cursor-pointer focus:outline-none focus:border-black appearance-none pr-10"
                            style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'12\' height=\'8\'%3E%3Cpath fill=\'%23000\' d=\'M6 8L0 0h12z\'/%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center' }}>
                            <option>Sort: Newest First</option>
                            <option>Price: Low to High</option>
                            <option>Price: High to Low</option>
                            <option>Most Popular</option>
                        </select>
                    </div>
                </div>
            </section>

            {/* Products Grid */}
            <section className="px-6 py-12 md:px-16 flex-1">
                <div className="max-w-[1600px] mx-auto">
                    {loading ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#ff4d6d]"></div>
                        </div>
                    ) : products.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                            {products.map((product) => (
                                <ProductCard
                                    key={product.id}
                                    product={product}
                                    badge="New"
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-24 bg-white rounded-lg border-2 border-dashed border-[#e5e5e5]">
                            <p className="text-[#666] font-medium">No new arrivals at the moment.</p>
                            <button className="mt-4 text-black font-bold underline">Discover the Shop</button>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
};

export default NewArrivalsPage;
