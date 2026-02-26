import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { logout } from '../../store/slices/authSlice';
import { authService } from '../../services/authService';
import AuthModal from './AuthModal';

type AuthTab = 'login' | 'register';

const Sidebar: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const currentPath = location.pathname;
    const dispatch = useDispatch();

    const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);

    const [modalOpen, setModalOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<AuthTab>('login');

    const isActive = (path: string) => currentPath === path;

    const openModal = (tab: AuthTab = 'login') => {
        setActiveTab(tab);
        setModalOpen(true);
    };

    const handleLogout = async () => {
        try {
            await authService.logout();
        } catch {
            // Ignore logout errors — clear state regardless
        }
        dispatch(logout());
    };

    const userInitial = user?.name?.charAt(0).toUpperCase() ?? '?';

    return (
        <>
            <aside className="w-[240px] h-screen bg-white fixed left-0 top-0 flex flex-col border-r border-[#e5e5e5] z-[1000] hidden lg:flex">
                <div className="py-12 px-6 text-center border-b border-[#e5e5e5]">
                    <Link
                        to="/"
                        className="text-2xl font-extrabold tracking-[4px] text-black transition-all duration-300 hover:tracking-[6px]"
                    >
                        CH<span className="text-[#ff4d6d]">LES</span>
                    </Link>
                </div>

                <div className="mx-5 my-6 bg-black p-4 text-center transition-all duration-250 cursor-pointer hover:scale-[0.98]">
                    <div className="text-[9px] font-semibold tracking-[2px] uppercase text-white/80 mb-1">Sale</div>
                    <div className="text-2xl font-bold tracking-[1px] text-white">75%</div>
                </div>

                <nav className="flex-1 overflow-y-auto px-5">
                    <div className="mb-8">
                        <ul className="space-y-1">
                            <li>
                                <Link
                                    to="/"
                                    className={`flex items-center justify-between p-3.5 text-[13px] tracking-[0.3px] rounded transition-all ${isActive('/') ? 'text-black bg-[#f0f0f0] font-semibold' : 'text-[#888888] font-medium hover:text-black hover:bg-[#f5f5f5]'}`}
                                >
                                    <span>Home</span>
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/new-arrivals"
                                    className={`flex items-center justify-between p-3.5 text-[13px] tracking-[0.3px] rounded transition-all ${isActive('/new-arrivals') ? 'text-black bg-[#f0f0f0] font-semibold' : 'text-[#888888] font-medium hover:text-black hover:bg-[#f5f5f5]'}`}
                                >
                                    <span>New Arrivals</span>
                                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded min-w-[18px] text-center ${isActive('/new-arrivals') ? 'bg-pink-500 text-white' : 'text-black bg-[#f0f0f0]'}`}>12</span>
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/shop"
                                    className={`flex items-center justify-between p-3.5 text-[13px] tracking-[0.3px] rounded transition-all ${isActive('/shop') ? 'text-black bg-[#f0f0f0] font-semibold' : 'text-[#888888] font-medium hover:text-black hover:bg-[#f5f5f5]'}`}
                                >
                                    <span>Shop</span>
                                </Link>
                            </li>
                            <li>
                                <a
                                    href="#"
                                    className="flex items-center justify-between p-3.5 text-[#888888] font-medium text-[13px] tracking-[0.3px] rounded transition-all hover:text-black hover:bg-[#f5f5f5]"
                                >
                                    <span>Lookbooks</span>
                                </a>
                            </li>
                        </ul>
                    </div>

                    <div className="mb-8 border-t border-[#f0f0f0] pt-6">
                        <ul className="space-y-1">
                            <li>
                                <a
                                    href="#"
                                    className="flex items-center justify-between p-3.5 text-[#888888] font-medium text-[13px] tracking-[0.3px] rounded transition-all hover:text-black hover:bg-[#f5f5f5]"
                                >
                                    <span>Wishlist</span>
                                    <span className="text-[9px] font-bold text-black bg-[#f0f0f0] px-1.5 py-0.5 rounded min-w-[18px] text-center">3</span>
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#"
                                    className="flex items-center justify-between p-3.5 text-[#888888] font-medium text-[13px] tracking-[0.3px] rounded transition-all hover:text-black hover:bg-[#f5f5f5]"
                                >
                                    <span>Cart</span>
                                    <span className="text-[9px] font-bold text-black bg-[#f0f0f0] px-1.5 py-0.5 rounded min-w-[18px] text-center">5</span>
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#"
                                    className="flex items-center justify-between p-3.5 text-[#888888] font-medium text-[13px] tracking-[0.3px] rounded transition-all hover:text-black hover:bg-[#f5f5f5]"
                                >
                                    <span>Orders</span>
                                </a>
                            </li>
                        </ul>
                    </div>
                </nav>

                {/* Sidebar Footer — Auth-aware */}
                <div className="p-5 pb-7 border-t border-[#f0f0f0]">
                    {isAuthenticated && user ? (
                        /* Logged-in user card */
                        <div className="bg-[#fafafa] rounded-lg p-4">
                            <div className="flex items-center mb-3">
                                <div className="w-9 h-9 rounded-full bg-black text-white flex items-center justify-center text-sm font-bold mr-2.5 flex-shrink-0">
                                    {userInitial}
                                </div>
                                <div className="min-w-0">
                                    <div className="text-[13px] font-semibold text-black truncate">{user.name}</div>
                                    <div className="text-[10px] text-[#999999] truncate">{user.email}</div>
                                </div>
                            </div>
                            <div className="flex gap-1.5">
                                <button
                                    onClick={() => navigate('/profile')}
                                    className="flex-1 p-2 bg-transparent border border-[#e5e5e5] text-[#666666] rounded text-[11px] font-medium transition-all hover:bg-white hover:text-black hover:border-black"
                                >
                                    Profile
                                </button>
                                <button
                                    onClick={handleLogout}
                                    className="flex-1 p-2 bg-transparent border border-[#ff4d6d] text-[#ff4d6d] rounded text-[11px] font-medium transition-all hover:bg-[#ff4d6d] hover:text-white"
                                >
                                    Logout
                                </button>
                            </div>
                        </div>
                    ) : (
                        /* Guest card */
                        <div className="bg-[#fafafa] rounded-lg p-4 text-center">
                            <button
                                onClick={() => openModal('login')}
                                className="w-12 h-12 rounded-full bg-[#f0f0f0] flex items-center justify-center mx-auto mb-3 text-xl transition-all hover:bg-[#e0e0e0] hover:scale-105 cursor-pointer"
                                title="Sign in to access your profile"
                            >
                                👤
                            </button>
                            <div className="text-[13px] font-semibold text-black mb-1.5">Guest User</div>
                            <div className="text-[11px] text-[#999999] mb-4 leading-[1.4]">
                                Sign in to access your account, orders, and wishlist
                            </div>
                            <div className="flex flex-col gap-2">
                                <button
                                    onClick={() => openModal('login')}
                                    className="w-full py-2.5 bg-black text-white text-[12px] font-medium rounded transition-all hover:bg-[#FF3A3A]"
                                >
                                    Sign In
                                </button>
                                <button
                                    onClick={() => openModal('register')}
                                    className="w-full py-2.5 bg-transparent border border-[#e5e5e5] text-[#666666] text-[12px] font-medium rounded transition-all hover:bg-white hover:text-black hover:border-black"
                                >
                                    Create Account
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </aside>

            {/* Auth Modal */}
            <AuthModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                activeTab={activeTab}
                onTabChange={setActiveTab}
            />
        </>
    );
};

export default Sidebar;
