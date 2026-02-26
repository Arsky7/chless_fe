import React from 'react';
import { Link } from 'react-router-dom';

const ArrivalsHeader: React.FC = () => {
    return (
        <section className="relative bg-gradient-to-br from-black to-[#333] px-10 py-20 md:px-16 md:py-24 text-white overflow-hidden">
            {/* Background Image Overlay */}
            <div
                className="absolute inset-0 opacity-20 bg-center bg-cover mix-blend-overlay z-0"
                style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1558769132-cb1c458e4222?q=80&w=2080&auto=format&fit=crop")' }}
            ></div>

            <div className="relative z-10 max-w-[1200px]">
                <div className="flex items-center gap-2 text-[13px] text-white/80 mb-6">
                    <Link to="/" className="hover:text-white transition-colors">Home</Link>
                    <span className="text-white/40">›</span>
                    <span className="font-medium text-white">New Arrivals</span>
                </div>

                <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-6 leading-[0.9]">
                    NEW <span className="text-[#ff4d6d]">ARRIVALS</span>
                </h1>

                <p className="text-lg md:text-xl text-white/90 font-normal max-w-xl mb-12 leading-relaxed">
                    Discover the latest drops from CHLESS. Fresh styles, bold designs, and premium quality streetwear that defines the urban aesthetic.
                </p>

                <div className="flex flex-wrap gap-10 md:gap-16 pt-10 border-t border-white/10">
                    <div className="flex flex-col items-start">
                        <span className="text-4xl md:text-5xl font-black text-[#ff4d6d] mb-1">12</span>
                        <span className="text-[10px] font-bold tracking-[2px] uppercase text-white/60">New Products</span>
                    </div>
                    <div className="flex flex-col items-start">
                        <span className="text-4xl md:text-5xl font-black text-[#ff4d6d] mb-1">24</span>
                        <span className="text-[10px] font-bold tracking-[2px] uppercase text-white/60">Hours Early Access</span>
                    </div>
                    <div className="flex flex-col items-start">
                        <span className="text-4xl md:text-5xl font-black text-[#ff4d6d] mb-1">7</span>
                        <span className="text-[10px] font-bold tracking-[2px] uppercase text-white/60">Days Only</span>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ArrivalsHeader;
