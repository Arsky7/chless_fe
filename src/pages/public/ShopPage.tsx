import React, { useState, useEffect } from 'react';
import ProductCard from '../../components/public/ProductCard';
import ShopHeader from '../../components/public/ShopHeader';
import ShopToolbar from '../../components/public/ShopToolbar';
import { publicService, Product } from '../../services/publicService';

const ShopPage: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({
        total: 0,
        current_page: 1,
        per_page: 12
    });

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async (page = 1) => {
        try {
            setLoading(true);
            const response = await publicService.getProducts({ page, per_page: 16 });
            if (response.success) {
                setProducts(response.data.data);
                setPagination({
                    total: response.data.total,
                    current_page: response.data.current_page,
                    per_page: response.data.per_page
                });
            }
        } catch (error) {
            console.error('Failed to fetch products:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col w-full">
            <ShopHeader />

            <ShopToolbar
                total={pagination.total}
                currentCount={products.length}
            />

            <section className="px-6 py-10 md:px-16 flex-1">
                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 max-w-[1600px] mx-auto">
                        {Array.from({ length: 12 }).map((_, i) => (
                            <div key={i} className="animate-pulse flex flex-col gap-4">
                                <div className="bg-gray-200 rounded-md pt-[125%] w-full"></div>
                                <div className="h-4 bg-gray-200 rounded w-1/3 mt-2"></div>
                                <div className="h-5 bg-gray-200 rounded w-3/4"></div>
                                <div className="h-6 bg-gray-200 rounded w-1/4 mt-1"></div>
                            </div>
                        ))}
                    </div>
                ) : products.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 max-w-[1600px] mx-auto">
                        {products.map((product) => (
                            <ProductCard
                                key={product.id}
                                product={product}
                                badge={product.sale_price ? 'Sale' : undefined}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white rounded-lg border border-dashed border-[#e5e5e5]">
                        <p className="text-[#666]">No products found.</p>
                    </div>
                )}

                {/* Load More Placeholder */}
                {pagination.total > products.length && (
                    <div className="text-center mt-12 mb-20">
                        <button className="px-16 py-4 bg-transparent border-2 border-black text-black text-sm font-bold tracking-widest uppercase hover:bg-black hover:text-white transition-all duration-300 rounded-sm">
                            Load More Products
                        </button>
                    </div>
                )}
            </section>
        </div>);
};

export default ShopPage;
