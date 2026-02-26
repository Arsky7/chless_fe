import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { authService } from '../../services/authService';
import { loginSuccess } from '../../store/slices/authSlice';

interface LoginModalProps {
    onClose: () => void;
    onSwitchToRegister: () => void;
}

type Step = 'email' | 'password';

const LoginModal: React.FC<LoginModalProps> = ({ onClose, onSwitchToRegister }) => {
    const dispatch = useDispatch();

    const [step, setStep] = useState<Step>('email');
    const [emailOrPhone, setEmailOrPhone] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleNextStep = (e: React.FormEvent) => {
        e.preventDefault();
        if (!emailOrPhone.trim()) return;
        setError(null);
        setStep('password');
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const res = await authService.login({ email: emailOrPhone, password });

            if (res.success) {
                localStorage.setItem('token', res.data.token);
                dispatch(loginSuccess({ user: res.data.user, token: res.data.token }));
                onClose();
            }
        } catch (err: any) {
            if (err?.response?.data?.errors?.email) {
                setError(err.response.data.errors.email[0]);
            } else {
                setError(err?.response?.data?.message || 'Login failed. Please check your credentials.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-[460px] bg-white rounded-xl shadow-2xl overflow-hidden relative">

            {/* Header — gray background */}
            <div className="bg-[#F5F5F5] px-8 pt-8 pb-6 relative">
                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute right-4 top-4 text-[#999] text-2xl leading-none hover:text-black transition-colors w-8 h-8 flex items-center justify-center"
                    aria-label="Close"
                >
                    ×
                </button>

                {/* Logo */}
                <div className="text-center mb-4">
                    <span className="text-[28px] font-light tracking-[4px] text-black">CH </span>
                    <span className="text-[28px] font-light tracking-[4px] text-[#FF3A3A]">LES</span>
                </div>

                {/* Title */}
                <h2 className="text-center text-[22px] font-medium text-black mb-2">My Account</h2>
                <p className="text-center text-[13px] text-[#666] leading-[1.6]">
                    Enjoy Special Discounts and Stay Cool<br />
                    Get access to exclusive discounts while keeping your<br />
                    account secure.
                </p>
            </div>

            {/* Form body */}
            <div className="px-8 pt-7 pb-4">

                {/* Global Error */}
                {error && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-[13px] text-red-600">
                        {error}
                    </div>
                )}

                {/* STEP 1: Email */}
                {step === 'email' && (
                    <form onSubmit={handleNextStep} className="flex flex-col gap-0">
                        <div className="mb-5">
                            <label className="block text-[13px] text-[#333] mb-2">
                                Your email/phone number
                            </label>
                            <input
                                type="text"
                                value={emailOrPhone}
                                onChange={e => setEmailOrPhone(e.target.value)}
                                placeholder="Enter email or phone number"
                                required
                                autoFocus
                                className="w-full px-3.5 py-3.5 bg-[#F9F9F9] rounded-md text-[15px] text-black placeholder-[#757575] outline outline-1 outline-[#DDDDDD] focus:outline-black transition-all"
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full py-4 bg-black text-white text-[15px] font-medium rounded-md hover:bg-[#FF3A3A] transition-all duration-300"
                        >
                            Next
                        </button>

                        <div className="mt-4 flex items-center justify-center gap-1 text-[13px]">
                            <span className="text-[#666]">Don't have account?</span>
                            <button
                                type="button"
                                onClick={onSwitchToRegister}
                                className="text-[#FF3A3A] font-medium hover:underline"
                            >
                                Signup here
                            </button>
                        </div>

                        <p className="mt-3 text-center text-[10px] text-[#666] leading-[1.5]">
                            This site is protected by reCAPTCHA and the Google{' '}
                            <span className="text-[#4285F4] cursor-pointer">Privacy Policy</span>
                            <br />and{' '}
                            <span className="text-[#4285F4] cursor-pointer">Terms of Service</span> apply.
                        </p>
                    </form>
                )}

                {/* STEP 2: Password */}
                {step === 'password' && (
                    <form onSubmit={handleLogin} className="flex flex-col gap-0">
                        {/* Show email */}
                        <div className="mb-3 flex items-center gap-2">
                            <button
                                type="button"
                                onClick={() => { setStep('email'); setError(null); }}
                                className="text-[#666] hover:text-black transition-colors text-sm"
                            >
                                ←
                            </button>
                            <span className="text-[13px] text-[#555] bg-[#F5F5F5] px-3 py-1.5 rounded-full flex-1 truncate">
                                {emailOrPhone}
                            </span>
                        </div>

                        <div className="mb-5">
                            <label className="block text-[13px] text-[#333] mb-2">Password</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    placeholder="Enter your password"
                                    required
                                    autoFocus
                                    className="w-full px-3.5 py-3.5 bg-[#F9F9F9] rounded-md text-[15px] text-black placeholder-[#757575] outline outline-1 outline-[#DDDDDD] focus:outline-black transition-all pr-10"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(p => !p)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#999] hover:text-black text-sm transition-colors"
                                >
                                    {showPassword ? '🙈' : '👁️'}
                                </button>
                            </div>
                        </div>

                        <div className="flex justify-end mb-5">
                            <button type="button" className="text-[12px] text-[#FF3A3A] hover:underline">
                                Forgot password?
                            </button>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 bg-black text-white text-[15px] font-medium rounded-md hover:bg-[#FF3A3A] transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                    Signing In...
                                </span>
                            ) : 'Sign In'}
                        </button>

                        <div className="mt-4 flex items-center justify-center gap-1 text-[13px]">
                            <span className="text-[#666]">Don't have account?</span>
                            <button
                                type="button"
                                onClick={onSwitchToRegister}
                                className="text-[#FF3A3A] font-medium hover:underline"
                            >
                                Signup here
                            </button>
                        </div>

                        <p className="mt-3 text-center text-[10px] text-[#666] leading-[1.5]">
                            This site is protected by reCAPTCHA and the Google{' '}
                            <span className="text-[#4285F4] cursor-pointer">Privacy Policy</span>
                            <br />and{' '}
                            <span className="text-[#4285F4] cursor-pointer">Terms of Service</span> apply.
                        </p>
                    </form>
                )}
            </div>

            {/* Footer */}
            <div className="border-t border-[#EEEEEE] px-8 py-4 text-center">
                <p className="text-[11px] text-[#666] leading-[1.6]">
                    By creating an account, you agree to our{' '}
                    <span className="text-[#FF3A3A] cursor-pointer hover:underline">Terms of Service</span>
                    {' '}and{' '}
                    <span className="text-[#FF3A3A] cursor-pointer hover:underline">Privacy Policy</span>
                </p>
            </div>
        </div>
    );
};

export default LoginModal;
