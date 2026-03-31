import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Instagram, Play } from 'lucide-react';

const LookbookPage: React.FC = () => {
    // Scroll to top on mount
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const lookbookItems = [
        {
            id: 1,
            title: 'URBAN NOMAD',
            subtitle: 'Fall/Winter 2024',
            image: 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&q=80',
            size: 'large', // spanning full or half
        },
        {
            id: 2,
            title: 'ESSENTIALS',
            subtitle: 'Core Collection',
            image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80',
            size: 'normal',
        },
        {
            id: 3,
            title: 'NIGHTFALL',
            subtitle: 'Evening Wear',
            image: 'https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?auto=format&fit=crop&q=80',
            size: 'tall', // spanning 2 rows
        },
        {
            id: 4,
            title: 'MONOCHROME',
            subtitle: 'Classic Black & White',
            image: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&q=80',
            size: 'normal',
        },
        {
            id: 5,
            title: 'STREET WEAR',
            subtitle: 'Limited Drop',
            image: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&q=80',
            size: 'wide', // spanning 2 cols
        },
    ];

    return (
        <div className="w-full bg-white min-h-screen">
            {/* Hero Section */}
            <section className="relative w-full h-[70vh] lg:h-[90vh] bg-black overflow-hidden flex items-center justify-center">
                <div className="absolute inset-0">
                    <img
                        src="https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&q=80&w=1920"
                        alt="Lookbook Hero"
                        className="w-full h-full object-cover opacity-60"
                    />
                </div>

                {/* Hero Content */}
                <div className="relative z-10 text-center px-4 max-w-4xl mx-auto flex flex-col items-center">
                    <span className="text-white/80 uppercase tracking-[4px] text-xs font-semibold mb-4 block">
                        Campaign
                    </span>
                    <h1 className="text-5xl lg:text-7xl font-extrabold text-white tracking-[2px] leading-tight mb-6">
                        FALL / WINTER<br />2024
                    </h1>
                    <p className="text-white/90 text-sm lg:text-base font-medium max-w-xl mx-auto mb-8 font-['Inter']">
                        Discover the new aesthetic. Blending urban utilitarianism with minimalist sophistication.
                        A collection designed for the modern landscape.
                    </p>
                    <button className="flex items-center justify-center w-14 h-14 rounded-full bg-white/20 backdrop-blur-md border border-white/40 hover:bg-white hover:text-black hover:border-white transition-all duration-300 text-white group">
                        <Play className="w-5 h-5 ml-1 group-hover:scale-110 transition-transform" fill="currentColor" />
                    </button>
                </div>
            </section>

            {/* Campaign Video/Text CTA block */}
            <section className="py-20 lg:py-32 px-6 lg:px-12 bg-white">
                <div className="max-w-6xl mx-auto text-center">
                    <h2 className="text-2xl lg:text-4xl font-bold tracking-[2px] mb-8 text-black uppercase">
                        The Philosophy
                    </h2>
                    <p className="text-[#666] text-base lg:text-lg leading-relaxed max-w-3xl mx-auto font-['Inter']">
                        "CHLESS is born from the streets but refined for the gallery.
                        We believe that fashion should be effortless yet striking, utilizing premium textures,
                        monochromatic palettes, and structured silhouettes to create a timeless wardrobe."
                    </p>
                </div>
            </section>

            {/* Masonry / Grid Lookbook */}
            <section className="w-full px-4 lg:px-8 pb-32">
                <div className="max-w-[1600px] mx-auto">

                    {/* CSS Grid for masonry-style */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 auto-rows-[300px] lg:auto-rows-[400px]">

                        {lookbookItems.map((item) => {
                            // Determine grid spans based on size property
                            let gridClasses = "col-span-1 row-span-1";
                            if (item.size === 'large') gridClasses = "col-span-1 md:col-span-2 lg:col-span-2 row-span-1 lg:row-span-2";
                            if (item.size === 'tall') gridClasses = "col-span-1 row-span-1 lg:row-span-2";
                            if (item.size === 'wide') gridClasses = "col-span-1 md:col-span-2 lg:col-span-2 row-span-1";

                            return (
                                <div
                                    key={item.id}
                                    className={`relative group overflow-hidden bg-black ${gridClasses}`}
                                >
                                    <img
                                        src={item.image}
                                        alt={item.title}
                                        loading="lazy"
                                        decoding="async"
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-90 group-hover:opacity-100"
                                    />

                                    {/* Overlay Gradient */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />

                                    {/* Text Content */}
                                    <div className="absolute bottom-0 left-0 w-full p-8 lg:p-10 translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                        <div className="uppercase tracking-[2px] text-white/70 text-[11px] font-semibold mb-2">
                                            {item.subtitle}
                                        </div>
                                        <h3 className="text-2xl lg:text-3xl font-bold text-white tracking-[1px] mb-4">
                                            {item.title}
                                        </h3>
                                        <Link
                                            to="/shop"
                                            className="inline-flex items-center text-white text-xs font-bold uppercase tracking-[1px] group/btn"
                                        >
                                            <span className="border-b border-transparent group-hover/btn:border-white pb-0.5 transition-colors">
                                                Shop Collection
                                            </span>
                                            <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                                        </Link>
                                    </div>
                                </div>
                            );
                        })}

                    </div>
                </div>
            </section>

            {/* Social Block */}
            <section className="py-24 bg-[#fafafa] border-t border-[#e5e5e5]">
                <div className="max-w-4xl mx-auto text-center px-6">
                    <Instagram className="w-10 h-10 mx-auto text-black mb-6" />
                    <h2 className="text-2xl lg:text-3xl font-extrabold tracking-[2px] text-black uppercase mb-4">
                        Join the Movement
                    </h2>
                    <p className="text-[#666] text-sm lg:text-base font-['Inter'] mb-8">
                        Follow us on Instagram for daily styling inspiration and exclusive behind-the-scenes content.
                        Tag @chless_official to be featured.
                    </p>
                    <a
                        href="https://instagram.com"
                        target="_blank"
                        rel="noreferrer"
                        className="inline-block bg-black text-white px-8 py-4 text-xs font-bold uppercase tracking-[2px] hover:bg-[#ff4d6d] transition-colors rounded-sm"
                    >
                        @chless_official
                    </a>
                </div>
            </section>
        </div>
    );
};

export default LookbookPage;
