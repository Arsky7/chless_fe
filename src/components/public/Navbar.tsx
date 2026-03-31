import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { logout } from '../../store/slices/authSlice';
import { authService } from '../../services/authService';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { Menu, ShoppingBag, User, Heart } from 'lucide-react';
import AuthModal from './AuthModal';

type AuthTab = 'login' | 'register';

interface NavbarProps {
    onOpenSidebar: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onOpenSidebar }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const currentPath = location.pathname;
    const dispatch = useDispatch();

    const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
    const { totalItems } = useCart();
    const { totalItems: wishlistCount } = useWishlist();

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
            // Ignore logout errors
        }
        dispatch(logout());
        navigate('/');
    };

    const userInitial = user?.name?.charAt(0).toUpperCase() ?? '?';

    return (
        <>
            <header className="fixed top-0 left-0 right-0 h-16 lg:h-20 bg-white border-b border-[#e5e5e5] z-[90] flex items-center px-6 lg:px-12 transition-all duration-300">

                {/* Mobile Menu Button - Left */}
                <button
                    onClick={onOpenSidebar}
                    className="lg:hidden p-2 -ml-2 text-black hover:text-[#ff4d6d] transition-colors"
                >
                    <Menu className="w-6 h-6" />
                </button>

                {/* Logo - Center (Mobile) / Left (Desktop) */}
                <Link to="/" className="text-xl lg:text-2xl font-extrabold tracking-[3px] text-black mx-auto lg:mx-0 transition-transform hover:scale-105">
                    CH<span className="text-[#ff4d6d]">LES</span>
                </Link>

                {/* Desktop Navigation - Center */}
                <nav className="hidden lg:flex items-center justify-center flex-1 space-x-8">
                    <Link
                        to="/"
                        className={`text-[13px] font-bold tracking-[1px] uppercase transition-colors ${isActive('/') ? 'text-black' : 'text-[#888888] hover:text-black'}`}
                    >
                        Home
                    </Link>
                    <Link
                        to="/new-arrivals"
                        className={`text-[13px] font-bold tracking-[1px] uppercase transition-colors flex items-center gap-1.5 ${isActive('/new-arrivals') ? 'text-black' : 'text-[#888888] hover:text-black'}`}
                    >
                        New Arrivals
                        {isActive('/new-arrivals') && <span className="w-1.5 h-1.5 rounded-full bg-[#ff4d6d]"></span>}
                    </Link>
                    <Link
                        to="/shop"
                        className={`text-[13px] font-bold tracking-[1px] uppercase transition-colors flex items-center gap-1.5 ${isActive('/shop') ? 'text-black' : 'text-[#888888] hover:text-black'}`}
                    >
                        Shop
                        {isActive('/shop') && <span className="w-1.5 h-1.5 rounded-full bg-[#ff4d6d]"></span>}
                    </Link>
                    <Link
                        to="/lookbook"
                        className={`text-[13px] font-bold tracking-[1px] uppercase transition-colors flex items-center gap-1.5 ${isActive('/lookbook') ? 'text-black' : 'text-[#888888] hover:text-black'}`}
                    >
                        Lookbook
                        {isActive('/lookbook') && <span className="w-1.5 h-1.5 rounded-full bg-[#ff4d6d]"></span>}
                    </Link>
                </nav>

                {/* Icons - Right */}
                <div className="flex items-center justify-end gap-1 lg:gap-4 lg:w-auto">
                    {/* Desktop Auth */}
                    <div className="hidden lg:block relative group">
                        {isAuthenticated ? (
                            <Link to="/profile" className="w-10 h-10 rounded-full flex items-center justify-center bg-transparent border border-transparent hover:border-[#e5e5e5] transition-all">
                                <div className="w-7 h-7 rounded-full bg-black text-white flex items-center justify-center text-[11px] font-bold">
                                    {userInitial}
                                </div>
                            </Link>
                        ) : (
                            <button
                                onClick={() => openModal('login')}
                                className="w-10 h-10 rounded-full flex items-center justify-center text-black hover:text-[#ff4d6d] hover:bg-gray-50 transition-all"
                            >
                                <User className="w-5 h-5" />
                            </button>
                        )}

                        {/* Dropdown Menu for Logged In Destkop */}
                        {isAuthenticated && (
                            <div className="absolute top-full right-0 mt-2 w-48 bg-white border border-[#e5e5e5] rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-right z-50 overflow-hidden text-left">
                                <div className="p-4 border-b border-[#f0f0f0] bg-[#fafafa]">
                                    <p className="text-sm font-bold text-black truncate">{user?.name}</p>
                                    <p className="text-[11px] text-[#999] truncate">{user?.email}</p>
                                </div>
                                <div className="py-2">
                                    <Link to="/profile" className="block px-4 py-2 text-[13px] font-medium text-[#666] hover:text-black hover:bg-[#f5f5f5]">
                                        My Profile
                                    </Link>
                                    <a href="#" className="block px-4 py-2 text-[13px] font-medium text-[#666] hover:text-black hover:bg-[#f5f5f5]">
                                        My Orders
                                    </a>
                                </div>
                                <div className="border-t border-[#f0f0f0]">
                                    <button
                                        onClick={handleLogout}
                                        className="w-full text-left px-4 py-3 text-[13px] font-medium text-red-500 hover:bg-red-50 transition-colors"
                                    >
                                        Log Out
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Wishlist Icon */}
                    <Link to="/wishlist" className="p-2 text-black relative hover:text-[#ff4d6d] transition-colors rounded-full hover:bg-gray-50">
                        <Heart className="w-5 h-5 lg:w-6 lg:h-6" />
                        {wishlistCount > 0 && (
                            <span className="absolute top-1 right-1 lg:top-0 lg:right-0 w-4 h-4 bg-[#ff4d6d] text-white text-[9px] font-bold rounded-full flex items-center justify-center shadow-sm">
                                {wishlistCount}
                            </span>
                        )}
                    </Link>

                    {/* Cart Icon */}
                    <Link to="/cart" className="p-2 -mr-2 lg:mr-0 text-black relative hover:text-[#ff4d6d] transition-colors rounded-full hover:bg-gray-50">
                        <ShoppingBag className="w-5 h-5 lg:w-6 lg:h-6" />
                        {totalItems > 0 && (
                            <span className="absolute top-1 right-1 lg:top-0 lg:right-0 w-4 h-4 bg-black text-white text-[9px] font-bold rounded-full flex items-center justify-center shadow-sm">
                                {totalItems}
                            </span>
                        )}
                    </Link>
                </div>
            </header>

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

export default Navbar;
