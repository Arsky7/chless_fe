import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/public/Sidebar';
import ProductCard from '../../components/public/ProductCard';
import ShopHeader from '../../components/public/ShopHeader';
import ShopToolbar from '../../components/public/ShopToolbar';
import Footer from '../../components/public/Footer';
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
        <div className="flex bg-[#fafafa] min-h-screen">
            {/* Sidebar */}
            <Sidebar />

            {/* Main Content */}
            <main className="flex-1 ml-0 md:ml-60 flex flex-col min-h-screen">
                <ShopHeader />

                <ShopToolbar
                    total={pagination.total}
                    currentCount={products.length}
                />

                <section className="px-6 py-10 md:px-16 flex-1">
                    {loading ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
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

                <Footer />
            </main>
        </div>
    );
};

export default ShopPage;
