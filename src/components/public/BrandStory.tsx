import React from 'react';

const BrandStory: React.FC = () => {
    return (
        <section className="py-24 px-10 bg-black text-white text-center">
            <div className="text-[12px] font-semibold tracking-[3px] uppercase text-[#ff4d6d] mb-4">
                About CHLESS
            </div>
            <h2 className="text-5xl font-extrabold text-white tracking-tight mb-8">
                Define Your Style
            </h2>
            <p className="max-w-2xl mx-auto text-lg leading-relaxed text-white/80 mb-16">
                CHLESS is more than just clothing—it's a statement. Born from the streets,
                crafted for those who dare to stand out. We blend contemporary design with
                timeless quality to create pieces that speak to your authentic self.
            </p>

            <div className="flex flex-col md:flex-row justify-center gap-20">
                <div className="text-center">
                    <div className="text-5xl mb-4">⚡</div>
                    <h4 className="text-xl font-bold tracking-wider mb-2">Authentic</h4>
                    <p className="text-sm text-white/70 leading-relaxed">True to streetwear culture</p>
                </div>
                <div className="text-center">
                    <div className="text-5xl mb-4">✨</div>
                    <h4 className="text-xl font-bold tracking-wider mb-2">Quality</h4>
                    <p className="text-sm text-white/70 leading-relaxed">Premium materials only</p>
                </div>
                <div className="text-center">
                    <div className="text-5xl mb-4">🎯</div>
                    <h4 className="text-xl font-bold tracking-wider mb-2">Bold</h4>
                    <p className="text-sm text-white/70 leading-relaxed">Designs that make a statement</p>
                </div>
            </div>
        </section>
    );
};

export default BrandStory;
