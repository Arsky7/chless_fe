import React from 'react';

interface ShopToolbarProps {
    total: number;
    currentCount: number;
}

const ShopToolbar: React.FC<ShopToolbarProps> = ({ total, currentCount }) => {
    return (
        <div className="bg-white px-10 py-6 md:px-16 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-[#e5e5e5] sticky top-0 z-40 bg-opacity-90 backdrop-blur-sm">
            <div className="text-sm text-[#666] font-medium">
                Showing <strong>1-{currentCount}</strong> of <strong>{total}</strong> products
            </div>

            <div className="flex items-center gap-4 w-full md:w-auto">
                <div className="hidden md:flex gap-2">
                    <button className="w-9 h-9 flex items-center justify-center bg-black text-white rounded-[4px] text-lg" title="Grid View">
                        ◫
                    </button>
                    <button className="w-9 h-9 flex items-center justify-center border border-[#e5e5e5] text-black rounded-[4px] text-lg hover:bg-black hover:text-white transition-all" title="List View">
                        ☰
                    </button>
                </div>

                <select className="flex-1 md:flex-none px-4 py-2.5 border border-[#e5e5e5] text-[13px] font-medium text-black rounded-[4px] bg-white cursor-pointer focus:outline-none focus:border-black transition-all appearance-none pr-10"
                    style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'12\' height=\'8\'%3E%3Cpath fill=\'%23000\' d=\'M6 8L0 0h12z\'/%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center' }}>
                    <option>Sort by: Featured</option>
                    <option>Price: Low to High</option>
                    <option>Price: High to Low</option>
                    <option>Newest First</option>
                    <option>Best Selling</option>
                </select>
            </div>
        </div>
    );
};

export default ShopToolbar;
