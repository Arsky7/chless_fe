import React from 'react';

const Newsletter: React.FC = () => {
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        alert('Thank you for subscribing!');
    };

    return (
        <section className="py-20 px-6 bg-[#f5f5f5] text-center">
            <div className="text-[12px] font-semibold tracking-[3px] uppercase text-[#ff4d6d] mb-3">
                Stay Updated
            </div>
            <h2 className="text-4xl font-extrabold text-black tracking-tight mb-4">
                Join the CHLESS Community
            </h2>
            <p className="text-[#666] max-w-xl mx-auto mb-10">
                Subscribe to get exclusive access to new drops, special promotions, and style inspiration.
            </p>
            <form onSubmit={handleSubmit} className="max-w-[600px] mx-auto flex flex-col sm:flex-row gap-3">
                <input
                    type="email"
                    placeholder="Enter your email address"
                    required
                    className="flex-1 px-6 py-4 border-2 border-[#e5e5e5] text-sm rounded-sm transition-all duration-300 focus:outline-none focus:border-black"
                />
                <button
                    type="submit"
                    className="px-12 py-4 bg-black text-white text-sm font-semibold tracking-wider uppercase transition-all duration-300 hover:bg-[#ff4d6d] rounded-sm"
                >
                    Subscribe
                </button>
            </form>
        </section>
    );
};

export default Newsletter;
