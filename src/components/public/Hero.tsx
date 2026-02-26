import React from 'react';

const Hero: React.FC = () => {
    return (
        <section className="relative h-[80vh] flex items-center justify-center overflow-hidden bg-black">
            {/* Background Image with Overlay */}
            <div
                className="absolute inset-0 z-0 bg-cover bg-center opacity-60 transition-transform duration-1000 hover:scale-105"
                style={{ backgroundImage: "url('https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070&auto=format&fit=crop')" }}
            >
                <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/60"></div>
            </div>

            <div className="relative z-10 text-center text-white max-w-4xl px-10 animate-fadeInUp">
                <div className="text-sm font-semibold tracking-[4px] uppercase text-[#ff4d6d] mb-4">
                    New Collection 2026
                </div>
                <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter mb-6 leading-[1.1]">
                    URBAN <span className="text-[#ff4d6d]">STREETWEAR</span>
                </h1>
                <p className="text-lg md:text-xl text-white/90 mb-10 leading-relaxed max-w-2xl mx-auto">
                    Define your style with our exclusive collection of contemporary streetwear.
                    Bold designs, premium quality, authentic attitude.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <a
                        href="#shop"
                        className="px-10 py-4 bg-[#ff4d6d] text-white text-sm font-semibold tracking-wider uppercase transition-all duration-300 hover:bg-[#e63955] hover:-translate-y-0.5 hover:shadow-[0_8px_20px_rgba(255,77,109,0.3)]"
                    >
                        Shop Now
                    </a>
                    <a
                        href="#new-arrivals"
                        className="px-10 py-4 bg-transparent border-2 border-white text-white text-sm font-semibold tracking-wider uppercase transition-all duration-300 hover:bg-white hover:text-black"
                    >
                        View Collection
                    </a>
                </div>
            </div>
        </section>
    );
};

export default Hero;
