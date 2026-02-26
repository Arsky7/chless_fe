import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { authService } from '../../services/authService';
import { loginSuccess } from '../../store/slices/authSlice';

interface RegisterModalProps {
    onClose: () => void;
    onSwitchToLogin: () => void;
}

const MONTHS = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];

const RegisterModal: React.FC<RegisterModalProps> = ({ onClose, onSwitchToLogin }) => {
    const dispatch = useDispatch();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [day, setDay] = useState('');
    const [month, setMonth] = useState('');
    const [year, setYear] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 80 }, (_, i) => String(currentYear - 10 - i));
    const days = Array.from({ length: 31 }, (_, i) => String(i + 1));

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setFieldErrors({});
        setLoading(true);

        try {
            const res = await authService.register({
                name,
                email,
                password,
                password_confirmation: password,
                birthday_day: day || undefined,
                birthday_month: month || undefined,
                birthday_year: year || undefined,
            });

            if (res.success) {
                localStorage.setItem('token', res.data.token);
                dispatch(loginSuccess({ user: res.data.user, token: res.data.token }));
                onClose();
            }
        } catch (err: any) {
            if (err?.response?.data?.errors) {
                const errs = err.response.data.errors as Record<string, string[]>;
                const mapped: Record<string, string> = {};
                Object.keys(errs).forEach(k => { mapped[k] = errs[k][0]; });
                setFieldErrors(mapped);
            } else {
                setError(err?.response?.data?.message || 'Registration failed. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-[400px] bg-white rounded-xl shadow-2xl overflow-hidden relative flex flex-col max-h-[95vh] overflow-y-auto">

            {/* Header — gray background */}
            <div className="bg-[#F5F5F5] px-7 pt-8 pb-5 relative flex-shrink-0">
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
                <h2 className="text-center text-[22px] font-medium text-black mb-1">Create Account</h2>
                <p className="text-center text-[13px] text-[#666] leading-[1.55] mb-4">
                    Enjoy Special Discounts and Stay Cool
                </p>

                {/* Info box */}
                <div className="bg-[#F9F9F9] rounded-lg p-3.5 text-center border border-[#eee]">
                    <p className="text-[14px] font-bold text-[#333] mb-1">Register</p>
                    <p className="text-[12px] text-[#666] leading-[1.5]">
                        Create account to be our member to earn points, get<br />
                        free vouchers, and hear our news earlier.
                    </p>
                </div>
            </div>

            {/* Form body */}
            <form onSubmit={handleSubmit} className="px-7 pt-6 pb-4 flex flex-col gap-0">

                {/* Global error */}
                {error && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-[13px] text-red-600">
                        {error}
                    </div>
                )}

                {/* Full Name */}
                <div className="mb-4">
                    <label className="block text-[13px] text-[#333] mb-2">Your Full Name*</label>
                    <input
                        type="text"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        placeholder="Enter your full name"
                        required
                        className={`w-full px-3.5 py-3.5 bg-[#F9F9F9] rounded-md text-[15px] text-black placeholder-[#757575] outline outline-1 ${fieldErrors.name ? 'outline-red-400' : 'outline-[#DDDDDD]'} focus:outline-black transition-all`}
                    />
                    {fieldErrors.name && <p className="mt-1 text-[11px] text-red-500">{fieldErrors.name}</p>}
                </div>

                {/* Email */}
                <div className="mb-4">
                    <label className="block text-[13px] text-[#333] mb-2">Your email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        required
                        className={`w-full px-3.5 py-3.5 bg-[#F9F9F9] rounded-md text-[15px] text-black placeholder-[#757575] outline outline-1 ${fieldErrors.email ? 'outline-red-400' : 'outline-[#DDDDDD]'} focus:outline-black transition-all`}
                    />
                    {fieldErrors.email && <p className="mt-1 text-[11px] text-red-500">{fieldErrors.email}</p>}
                </div>

                {/* Password */}
                <div className="mb-4">
                    <label className="block text-[13px] text-[#333] mb-2">Password</label>
                    <div className="relative">
                        <input
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            placeholder="Create a password"
                            required
                            minLength={8}
                            className={`w-full px-3.5 py-3.5 bg-[#F9F9F9] rounded-md text-[15px] text-black placeholder-[#757575] outline outline-1 ${fieldErrors.password ? 'outline-red-400' : 'outline-[#DDDDDD]'} focus:outline-black transition-all pr-10`}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(p => !p)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#999] hover:text-black text-sm transition-colors"
                        >
                            {showPassword ? '🙈' : '👁️'}
                        </button>
                    </div>
                    {fieldErrors.password && <p className="mt-1 text-[11px] text-red-500">{fieldErrors.password}</p>}
                </div>

                {/* Birthday (Optional) */}
                <div className="mb-5">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-[13px] text-[#666]">My Birthday</span>
                        <span className="px-2 py-0.5 bg-[#F0F0F0] rounded-full text-[11px] text-[#999]">Optional</span>
                    </div>
                    <div className="flex gap-2">
                        {/* Day */}
                        <select
                            value={day}
                            onChange={e => setDay(e.target.value)}
                            className="flex-1 px-3.5 py-3.5 bg-[#F9F9F9] rounded-md text-[13px] text-[#666] outline outline-1 outline-[#DDDDDD] focus:outline-black transition-all appearance-none cursor-pointer"
                        >
                            <option value="">Day</option>
                            {days.map(d => <option key={d} value={d}>{d}</option>)}
                        </select>
                        {/* Month */}
                        <select
                            value={month}
                            onChange={e => setMonth(e.target.value)}
                            className="flex-1 px-3.5 py-3.5 bg-[#F9F9F9] rounded-md text-[13px] text-[#666] outline outline-1 outline-[#DDDDDD] focus:outline-black transition-all appearance-none cursor-pointer"
                        >
                            <option value="">Month</option>
                            {MONTHS.map((m, i) => <option key={m} value={String(i + 1)}>{m}</option>)}
                        </select>
                        {/* Year */}
                        <select
                            value={year}
                            onChange={e => setYear(e.target.value)}
                            className="flex-1 px-3.5 py-3.5 bg-[#F9F9F9] rounded-md text-[13px] text-[#666] outline outline-1 outline-[#DDDDDD] focus:outline-black transition-all appearance-none cursor-pointer"
                        >
                            <option value="">Year</option>
                            {years.map(y => <option key={y} value={y}>{y}</option>)}
                        </select>
                    </div>
                </div>

                {/* Submit */}
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 bg-black text-white text-[15px] font-medium rounded-md hover:bg-[#FF3A3A] transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                    {loading ? (
                        <span className="flex items-center justify-center gap-2">
                            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                            Creating Account...
                        </span>
                    ) : 'Create New Account'}
                </button>

                {/* Login link */}
                <div className="mt-4 flex items-center justify-center gap-1 text-[13px]">
                    <span className="text-[#666]">Already have an account?</span>
                    <button
                        type="button"
                        onClick={onSwitchToLogin}
                        className="text-[#FF3A3A] font-medium hover:underline"
                    >
                        Login here
                    </button>
                </div>

                {/* reCAPTCHA notice */}
                <p className="mt-3 text-center text-[10px] text-[#666] leading-[1.5]">
                    This site is protected by reCAPTCHA and the Google{' '}
                    <span className="text-[#4285F4] cursor-pointer">Privacy Policy</span>
                    <br />and{' '}
                    <span className="text-[#4285F4] cursor-pointer">Terms of Service</span> apply.
                </p>
            </form>

            {/* Footer */}
            <div className="border-t border-[#EEEEEE] px-7 py-4 flex-shrink-0 text-center">
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

export default RegisterModal;
