import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../public/Sidebar';
import Navbar from '../public/Navbar';

const PublicLayout: React.FC = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const location = useLocation();

    // Close sidebar when route changes on mobile
    useEffect(() => {
        if (window.innerWidth < 1024) {
            setSidebarOpen(false);
        }
    }, [location.pathname]);

    // Initialize: closed everywhere (only opened by hamburger)
    useEffect(() => {
        setSidebarOpen(false);
        const handleResize = () => {
            if (window.innerWidth >= 1024) setSidebarOpen(false);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Prevent body scroll when sidebar is open on mobile
    useEffect(() => {
        if (sidebarOpen && window.innerWidth < 1024) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [sidebarOpen]);

    return (
        <div className="flex bg-[#fafafa] min-h-screen font-['Inter'] relative w-full">
            <Navbar onOpenSidebar={() => setSidebarOpen(true)} />
            <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
            <main
                className="flex-1 w-full flex flex-col min-h-screen transition-all duration-300 ml-0 mt-16 lg:mt-20"
            >
                <Outlet />
            </main>
        </div>
    );
};

export default PublicLayout;
