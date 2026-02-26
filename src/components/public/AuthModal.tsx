import React, { useEffect, useCallback } from 'react';
import LoginModal from './LoginModal';
import RegisterModal from './RegisterModal';

type AuthTab = 'login' | 'register';

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialTab?: AuthTab;
    activeTab: AuthTab;
    onTabChange: (tab: AuthTab) => void;
}

const AuthModal: React.FC<AuthModalProps> = ({
    isOpen,
    onClose,
    activeTab,
    onTabChange,
}) => {

    // Close on Escape key
    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        if (e.key === 'Escape') onClose();
    }, [onClose]);

    useEffect(() => {
        if (isOpen) {
            document.addEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = '';
        };
    }, [isOpen, handleKeyDown]);

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-[9999] flex items-center justify-center"
            role="dialog"
            aria-modal="true"
        >
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal — centered, above backdrop */}
            <div className="relative z-10 animate-modal-in">
                {activeTab === 'login' ? (
                    <LoginModal
                        onClose={onClose}
                        onSwitchToRegister={() => onTabChange('register')}
                    />
                ) : (
                    <RegisterModal
                        onClose={onClose}
                        onSwitchToLogin={() => onTabChange('login')}
                    />
                )}
            </div>
        </div>
    );
};

export default AuthModal;
