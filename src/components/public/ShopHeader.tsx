import React from 'react';
import { Link } from 'react-router-dom';

const ShopHeader: React.FC = () => {
    return (
        <section className="bg-white px-10 py-10 md:px-16 md:py-12 border-b border-[#e5e5e5]">
            <div className="flex items-center gap-2 text-[13px] text-[#666] mb-4">
                <Link to="/" className="text-[#666] hover:text-black transition-colors">Home</Link>
                <span className="text-[#ccc]">›</span>
                <span className="text-black font-medium">All Products</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-black tracking-tight mb-4">
                All Products
            </h1>
            <p className="text-base text-[#666] font-normal">
                Discover our complete collection of urban streetwear
            </p>
        </section>
    );
};

export default ShopHeader;
