import React, { useEffect, useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState } from '../../store';
import { updateProfile as updateProfileState, logout } from '../../store/slices/authSlice';
import {
    profileService,
    UserProfile,
    Address,
    AddressPayload,
} from '../../services/profileService';
import { authService } from '../../services/authService';

// ────────────────────────────────────────────
// Types
// ────────────────────────────────────────────

type Tab = 'personal' | 'security' | 'addresses';

// ────────────────────────────────────────────
// Helper Components
// ────────────────────────────────────────────

const Toast: React.FC<{ message: string; type: 'success' | 'error'; onClose: () => void }> = ({ message, type, onClose }) => (
    <div className={`fixed top-6 right-6 z-[9999] flex items-center gap-3 px-5 py-3.5 rounded-lg shadow-lg text-white text-sm font-medium animate-slide-up
        ${type === 'success' ? 'bg-black' : 'bg-red-500'}`}>
        <span>{type === 'success' ? '✓' : '✕'}</span>
        <span>{message}</span>
        <button onClick={onClose} className="ml-2 opacity-70 hover:opacity-100">×</button>
    </div>
);

const InputField: React.FC<{
    label: string;
    type?: string;
    value: string;
    onChange: (v: string) => void;
    placeholder?: string;
    disabled?: boolean;
    error?: string;
    hint?: string;
}> = ({ label, type = 'text', value, onChange, placeholder, disabled, error, hint }) => (
    <div className="mb-5">
        <label className="block text-[12px] font-semibold text-black uppercase tracking-[0.5px] mb-2">{label}</label>
        <input
            type={type}
            value={value}
            onChange={e => onChange(e.target.value)}
            placeholder={placeholder}
            disabled={disabled}
            className={`w-full px-4 py-3.5 border rounded text-[14px] text-black placeholder-[#aaa] font-[Inter] transition-all
                ${disabled ? 'bg-[#f8f8f8] text-[#999] cursor-not-allowed' : 'bg-white hover:border-gray-400'}
                ${error ? 'border-red-400 focus:border-red-400 focus:ring-red-100' : 'border-[#e5e5e5] focus:border-black focus:ring-2 focus:ring-black/5'}
                focus:outline-none`}
        />
        {hint && !error && <p className="mt-1 text-[11px] text-[#999]">{hint}</p>}
        {error && <p className="mt-1 text-[11px] text-red-500">{error}</p>}
    </div>
);

// ────────────────────────────────────────────
// Address Form Modal
// ────────────────────────────────────────────

const AddressFormModal: React.FC<{
    initial?: Address | null;
    onSave: (payload: AddressPayload) => Promise<void>;
    onClose: () => void;
    saving: boolean;
}> = ({ initial, onSave, onClose, saving }) => {
    const [form, setForm] = useState<AddressPayload>({
        label: initial?.label ?? 'Rumah',
        receiver_name: initial?.receiver_name ?? '',
        receiver_phone: initial?.receiver_phone ?? '',
        province: initial?.province ?? '',
        city: initial?.city ?? '',
        district: initial?.district ?? '',
        village: initial?.village ?? '',
        postal_code: initial?.postal_code ?? '',
        full_address: initial?.full_address ?? '',
        is_default: initial?.is_default ?? false,
        notes: initial?.notes ?? '',
    });

    const set = (key: keyof AddressPayload) => (val: string | boolean) =>
        setForm(f => ({ ...f, [key]: val }));

    return (
        <div className="fixed inset-0 z-[9998] flex items-center justify-center">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
            <div className="relative z-10 bg-white rounded-xl shadow-2xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto animate-modal-in">
                <div className="sticky top-0 bg-white px-6 py-4 border-b border-[#f0f0f0] flex items-center justify-between">
                    <h3 className="text-[16px] font-bold text-black">{initial ? 'Edit Address' : 'Add New Address'}</h3>
                    <button onClick={onClose} className="text-[#999] hover:text-black text-xl w-8 h-8 flex items-center justify-center transition-colors">×</button>
                </div>
                <div className="p-6">
                    {/* Label + default */}
                    <div className="flex gap-3 mb-5">
                        {['Rumah', 'Kantor', 'Lainnya'].map(l => (
                            <button
                                key={l}
                                type="button"
                                onClick={() => set('label')(l)}
                                className={`flex-1 py-2.5 text-[12px] font-semibold border rounded transition-all 
                                    ${form.label === l ? 'bg-black text-white border-black' : 'bg-white text-[#666] border-[#e5e5e5] hover:border-black'}`}
                            >
                                {l}
                            </button>
                        ))}
                    </div>

                    <InputField label="Receiver Name*" value={form.receiver_name} onChange={set('receiver_name')} placeholder="Full name of receiver" />
                    <InputField label="Receiver Phone*" type="tel" value={form.receiver_phone} onChange={set('receiver_phone')} placeholder="08xxxxxxxx" />
                    <div className="grid grid-cols-2 gap-3">
                        <InputField label="Province*" value={form.province} onChange={set('province')} placeholder="DKI Jakarta" />
                        <InputField label="City*" value={form.city} onChange={set('city')} placeholder="Jakarta Selatan" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <InputField label="District*" value={form.district} onChange={set('district')} placeholder="Kebayoran Baru" />
                        <InputField label="Postal Code*" value={form.postal_code} onChange={set('postal_code')} placeholder="12610" />
                    </div>
                    <InputField label="Full Address*" value={form.full_address} onChange={set('full_address')} placeholder="Jl. Sudirman No. 1, Lantai 12" />
                    <InputField label="Notes (Optional)" value={form.notes ?? ''} onChange={set('notes')} placeholder="Patokan / petunjuk tambahan" />

                    <label className="flex items-center gap-2.5 cursor-pointer mb-6">
                        <div
                            onClick={() => set('is_default')(!form.is_default)}
                            className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all
                                ${form.is_default ? 'bg-black border-black' : 'border-[#ccc]'}`}
                        >
                            {form.is_default && <span className="text-white text-[10px] font-bold">✓</span>}
                        </div>
                        <span className="text-[13px] text-[#555]">Set as default address</span>
                    </label>

                    <div className="flex gap-3">
                        <button onClick={onClose} className="flex-1 py-3 border border-[#e5e5e5] text-[#666] text-[13px] font-medium rounded hover:border-black hover:text-black transition-all">
                            Cancel
                        </button>
                        <button
                            onClick={() => onSave(form)}
                            disabled={saving}
                            className="flex-1 py-3 bg-black text-white text-[13px] font-medium rounded hover:bg-[#FF3A3A] transition-all disabled:opacity-60"
                        >
                            {saving ? 'Saving...' : 'Save Address'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// ────────────────────────────────────────────
// Tabs
// ────────────────────────────────────────────

const PersonalTab: React.FC<{
    profile: UserProfile | null;
    loading: boolean;
    onSave: (name: string, phone: string, gender: string, birth_date: string) => Promise<void>;
    saving: boolean;
}> = ({ profile, loading, onSave, saving }) => {
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [gender, setGender] = useState('');
    const [birthDate, setBirthDate] = useState('');

    useEffect(() => {
        if (profile) {
            setName(profile.name ?? '');
            setPhone(profile.profile?.phone ?? '');
            setGender(profile.profile?.gender ?? '');
            setBirthDate(profile.profile?.birth_date ?? '');
        }
    }, [profile]);

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="w-8 h-8 border-3 border-black/20 border-t-black rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="max-w-xl">
            <h3 className="text-[18px] font-bold text-black mb-1">Personal Information</h3>
            <p className="text-[13px] text-[#999] mb-7">Update your personal details and profile info</p>

            {/* Avatar */}
            <div className="flex items-center gap-5 mb-8 p-5 bg-[#fafafa] rounded-xl border border-[#f0f0f0]">
                <div className="w-16 h-16 rounded-full bg-black text-white flex items-center justify-center text-2xl font-bold flex-shrink-0">
                    {name.charAt(0).toUpperCase() || '?'}
                </div>
                <div>
                    <div className="text-[14px] font-semibold text-black mb-1">{name || 'Your Name'}</div>
                    <div className="text-[12px] text-[#999] mb-2">{profile?.email}</div>
                    <span className="text-[10px] font-semibold uppercase tracking-[1px] px-2.5 py-1 border border-[#e5e5e5] rounded text-[#666]">
                        {profile?.type || 'customer'}
                    </span>
                </div>
            </div>

            <InputField label="Full Name" value={name} onChange={setName} placeholder="Enter your full name" />
            <InputField label="Email Address" value={profile?.email ?? ''} onChange={() => { }} disabled hint="Email cannot be changed" />
            <InputField label="Phone Number" type="tel" value={phone} onChange={setPhone} placeholder="08xxxxxxxxxx" />

            <div className="mb-5">
                <label className="block text-[12px] font-semibold text-black uppercase tracking-[0.5px] mb-2">Gender</label>
                <div className="flex gap-3">
                    {['', 'male', 'female'].map(g => (
                        <button
                            key={g}
                            type="button"
                            onClick={() => setGender(g)}
                            className={`flex-1 py-3 text-[13px] font-medium border rounded transition-all
                                ${gender === g ? 'bg-black text-white border-black' : 'bg-white text-[#666] border-[#e5e5e5] hover:border-black'}`}
                        >
                            {g === '' ? 'Prefer not to say' : g.charAt(0).toUpperCase() + g.slice(1)}
                        </button>
                    ))}
                </div>
            </div>

            <InputField label="Birth Date" type="date" value={birthDate} onChange={setBirthDate} />

            <button
                onClick={() => onSave(name, phone, gender, birthDate)}
                disabled={saving}
                className="w-full py-4 bg-black text-white text-[14px] font-semibold rounded hover:bg-[#FF3A3A] transition-all duration-300 uppercase tracking-[1px] disabled:opacity-60"
            >
                {saving ? 'Saving Changes...' : 'Save Changes'}
            </button>
        </div>
    );
};

const SecurityTab: React.FC<{
    onChangePassword: (current: string, newPass: string, confirm: string) => Promise<void>;
    saving: boolean;
}> = ({ onChangePassword, saving }) => {
    const [current, setCurrent] = useState('');
    const [newPass, setNewPass] = useState('');
    const [confirm, setConfirm] = useState('');
    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [mismatch, setMismatch] = useState(false);

    const handleSubmit = async () => {
        if (newPass !== confirm) { setMismatch(true); return; }
        setMismatch(false);
        await onChangePassword(current, newPass, confirm);
        setCurrent(''); setNewPass(''); setConfirm('');
    };

    const PasswordInput: React.FC<{ label: string; value: string; onChange: (v: string) => void; show: boolean; onToggle: () => void; error?: string }> = ({ label, value, onChange, show, onToggle, error }) => (
        <div className="mb-5">
            <label className="block text-[12px] font-semibold text-black uppercase tracking-[0.5px] mb-2">{label}</label>
            <div className="relative">
                <input
                    type={show ? 'text' : 'password'}
                    value={value}
                    onChange={e => onChange(e.target.value)}
                    className={`w-full px-4 py-3.5 border rounded text-[14px] text-black placeholder-[#aaa] pr-10 focus:outline-none transition-all
                        ${error ? 'border-red-400 focus:border-red-400' : 'border-[#e5e5e5] focus:border-black focus:ring-2 focus:ring-black/5'}`}
                    placeholder="••••••••"
                />
                <button type="button" onClick={onToggle} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#999] hover:text-black text-sm transition-colors">
                    {show ? '🙈' : '👁️'}
                </button>
            </div>
            {error && <p className="mt-1 text-[11px] text-red-500">{error}</p>}
        </div>
    );

    return (
        <div className="max-w-xl">
            <h3 className="text-[18px] font-bold text-black mb-1">Change Password</h3>
            <p className="text-[13px] text-[#999] mb-7">Keep your account secure with a strong password</p>

            <div className="p-5 bg-[#fafafa] rounded-xl border border-[#f0f0f0] mb-7">
                <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-[#f0f0f0] rounded-full flex items-center justify-center text-sm flex-shrink-0 mt-0.5">🔒</div>
                    <div>
                        <div className="text-[13px] font-semibold text-black mb-1">Password Tips</div>
                        <ul className="space-y-1">
                            {['At least 8 characters', 'Mix of uppercase and lowercase letters', 'Include numbers and symbols'].map(tip => (
                                <li key={tip} className="text-[12px] text-[#666] flex items-center gap-2">
                                    <span className="w-1 h-1 rounded-full bg-[#888] flex-shrink-0" />
                                    {tip}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>

            <PasswordInput label="Current Password" value={current} onChange={setCurrent} show={showCurrent} onToggle={() => setShowCurrent(p => !p)} />
            <PasswordInput label="New Password" value={newPass} onChange={setNewPass} show={showNew} onToggle={() => setShowNew(p => !p)} />
            <PasswordInput label="Confirm New Password" value={confirm} onChange={setConfirm} show={showNew} onToggle={() => setShowNew(p => !p)} error={mismatch ? 'Passwords do not match' : undefined} />

            <button
                onClick={handleSubmit}
                disabled={saving || !current || !newPass || !confirm}
                className="w-full py-4 bg-black text-white text-[14px] font-semibold rounded hover:bg-[#FF3A3A] transition-all duration-300 uppercase tracking-[1px] disabled:opacity-60"
            >
                {saving ? 'Updating Password...' : 'Update Password'}
            </button>
        </div>
    );
};

const AddressesTab: React.FC<{
    addresses: Address[];
    loading: boolean;
    onAdd: (payload: AddressPayload) => Promise<void>;
    onEdit: (id: number, payload: AddressPayload) => Promise<void>;
    onDelete: (id: number) => Promise<void>;
    onSetDefault: (id: number) => Promise<void>;
    saving: boolean;
}> = ({ addresses, loading, onAdd, onEdit, onDelete, onSetDefault, saving }) => {
    const [showForm, setShowForm] = useState(false);
    const [editAddress, setEditAddress] = useState<Address | null>(null);

    const handleSave = async (payload: AddressPayload) => {
        if (editAddress) {
            await onEdit(editAddress.id, payload);
        } else {
            await onAdd(payload);
        }
        setShowForm(false);
        setEditAddress(null);
    };

    if (loading) {
        return <div className="flex items-center justify-center py-20"><div className="w-8 h-8 border-3 border-black/20 border-t-black rounded-full animate-spin" /></div>;
    }

    return (
        <>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-[18px] font-bold text-black mb-1">My Addresses</h3>
                    <p className="text-[13px] text-[#999]">Manage your delivery addresses</p>
                </div>
                <button
                    onClick={() => { setEditAddress(null); setShowForm(true); }}
                    className="px-4 py-2.5 bg-black text-white text-[13px] font-semibold rounded hover:bg-[#FF3A3A] transition-all uppercase tracking-[0.5px]"
                >
                    + Add Address
                </button>
            </div>

            {addresses.length === 0 ? (
                <div className="text-center py-16 border-2 border-dashed border-[#e5e5e5] rounded-xl">
                    <div className="text-4xl mb-3">📍</div>
                    <div className="text-[14px] font-semibold text-black mb-1">No addresses yet</div>
                    <div className="text-[12px] text-[#999] mb-5">Add your first delivery address</div>
                    <button
                        onClick={() => { setEditAddress(null); setShowForm(true); }}
                        className="px-5 py-2.5 bg-black text-white text-[12px] font-semibold rounded hover:bg-[#FF3A3A] transition-all"
                    >
                        Add Address
                    </button>
                </div>
            ) : (
                <div className="grid gap-4 max-w-2xl">
                    {addresses.map(addr => (
                        <div
                            key={addr.id}
                            className={`p-5 rounded-xl border-2 transition-all ${addr.is_default ? 'border-black bg-[#fafafa]' : 'border-[#e5e5e5] hover:border-[#ccc]'}`}
                        >
                            <div className="flex items-start justify-between gap-3 mb-3">
                                <div className="flex items-center gap-2">
                                    <span className="text-[11px] font-bold uppercase tracking-[1px] px-2.5 py-1 bg-[#f0f0f0] rounded text-[#333]">
                                        {addr.label}
                                    </span>
                                    {addr.is_default && (
                                        <span className="text-[10px] font-bold uppercase tracking-[1px] px-2.5 py-1 bg-black text-white rounded">
                                            Default
                                        </span>
                                    )}
                                </div>
                                <div className="flex gap-2">
                                    {!addr.is_default && (
                                        <button
                                            onClick={() => onSetDefault(addr.id)}
                                            className="text-[11px] text-[#666] border border-[#e5e5e5] px-2.5 py-1 rounded hover:border-black transition-all"
                                        >
                                            Set Default
                                        </button>
                                    )}
                                    <button
                                        onClick={() => { setEditAddress(addr); setShowForm(true); }}
                                        className="text-[11px] text-[#666] border border-[#e5e5e5] px-2.5 py-1 rounded hover:border-black transition-all"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => onDelete(addr.id)}
                                        className="text-[11px] text-red-500 border border-red-200 px-2.5 py-1 rounded hover:bg-red-50 transition-all"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                            <div className="text-[14px] font-semibold text-black mb-0.5">{addr.receiver_name}</div>
                            <div className="text-[13px] text-[#666] mb-1">{addr.receiver_phone}</div>
                            <div className="text-[13px] text-[#555] leading-[1.5]">{addr.full_address}</div>
                            <div className="text-[12px] text-[#999] mt-1">{addr.district}, {addr.city}, {addr.province} {addr.postal_code}</div>
                            {addr.notes && <div className="mt-2 text-[11px] text-[#999] italic">📝 {addr.notes}</div>}
                        </div>
                    ))}
                </div>
            )}

            {showForm && (
                <AddressFormModal
                    initial={editAddress}
                    onSave={handleSave}
                    onClose={() => { setShowForm(false); setEditAddress(null); }}
                    saving={saving}
                />
            )}
        </>
    );
};

// ────────────────────────────────────────────
// Main Profile Page
// ────────────────────────────────────────────

const ProfilePage: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);

    const [activeTab, setActiveTab] = useState<Tab>('personal');
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

    const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 3500);
    };

    const fetchProfile = useCallback(async () => {
        if (!isAuthenticated) return;
        try {
            setLoading(true);
            const [profileRes, addressRes] = await Promise.all([
                profileService.getProfile(),
                profileService.getAddresses(),
            ]);
            setProfile(profileRes.data as UserProfile);
            // getAddresses returns plain array after backend fix
            const addrData = addressRes.data;
            setAddresses(Array.isArray(addrData) ? addrData : []);
        } catch {
            showToast('Failed to load profile data', 'error');
        } finally {
            setLoading(false);
        }
    }, [isAuthenticated]);

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/');
            return;
        }
        fetchProfile();
    }, [isAuthenticated, navigate, fetchProfile]);

    // ── Actions ─────────────────────────────

    const handleSavePersonal = async (name: string, phone: string, gender: string, birth_date: string) => {
        setSaving(true);
        try {
            const res = await profileService.updateProfile({ name, phone, gender, birth_date });
            setProfile(prev => prev ? { ...prev, ...(res.data as UserProfile) } : res.data as UserProfile);
            dispatch(updateProfileState({ name }));
            showToast('Profile updated successfully!');
        } catch (err: any) {
            showToast(err?.response?.data?.message ?? 'Failed to update profile', 'error');
        } finally {
            setSaving(false);
        }
    };

    const handleChangePassword = async (current: string, newPass: string, confirm: string) => {
        setSaving(true);
        try {
            await profileService.changePassword({
                current_password: current,
                new_password: newPass,
                new_password_confirmation: confirm,
            });
            showToast('Password changed! Please log in again.');
            setTimeout(async () => {
                try { await authService.logout(); } catch { }
                dispatch(logout());
                navigate('/');
            }, 1500);
        } catch (err: any) {
            showToast(err?.response?.data?.message ?? 'Failed to change password', 'error');
        } finally {
            setSaving(false);
        }
    };

    const handleAddAddress = async (payload: AddressPayload) => {
        setSaving(true);
        try {
            const res = await profileService.createAddress(payload);
            setAddresses(prev =>
                payload.is_default
                    ? [res.data, ...prev.map(a => ({ ...a, is_default: false }))]
                    : [...prev, res.data]
            );
            showToast('Address added successfully!');
        } catch (err: any) {
            showToast(err?.response?.data?.message ?? 'Failed to add address', 'error');
        } finally {
            setSaving(false);
        }
    };

    const handleEditAddress = async (id: number, payload: AddressPayload) => {
        setSaving(true);
        try {
            const res = await profileService.updateAddress(id, payload);
            setAddresses(prev => {
                const updated = prev.map(a => a.id === id ? res.data : (payload.is_default ? { ...a, is_default: false } : a));
                return updated;
            });
            showToast('Address updated successfully!');
        } catch (err: any) {
            showToast(err?.response?.data?.message ?? 'Failed to update address', 'error');
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteAddress = async (id: number) => {
        if (!confirm('Delete this address?')) return;
        setSaving(true);
        try {
            await profileService.deleteAddress(id);
            setAddresses(prev => prev.filter(a => a.id !== id));
            showToast('Address deleted.');
        } catch {
            showToast('Failed to delete address', 'error');
        } finally {
            setSaving(false);
        }
    };

    const handleSetDefault = async (id: number) => {
        setSaving(true);
        try {
            await profileService.setDefaultAddress(id);
            setAddresses(prev => prev.map(a => ({ ...a, is_default: a.id === id })));
            showToast('Default address updated!');
        } catch {
            showToast('Failed to update default address', 'error');
        } finally {
            setSaving(false);
        }
    };

    // ── Tabs config ─────────────────────────

    const tabs: { id: Tab; label: string; icon: string }[] = [
        { id: 'personal', label: 'Personal Info', icon: '👤' },
        { id: 'security', label: 'Security', icon: '🔒' },
        { id: 'addresses', label: 'Addresses', icon: '📍' },
    ];

    // ────────────────────────────────────────

    return (
        <div className="w-full min-h-screen flex flex-col relative">
            {/* Main area */}
            <div className="flex-1 w-full flex flex-col">
                {/* Page Header */}
                <div className="bg-white border-b border-[#e5e5e5] px-8 py-6">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center text-lg font-bold">
                            {user?.name?.charAt(0).toUpperCase() ?? '?'}
                        </div>
                        <div>
                            <h1 className="text-[22px] font-bold text-black">{user?.name ?? 'My Account'}</h1>
                            <p className="text-[13px] text-[#999]">{user?.email}</p>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row">
                    {/* Side nav */}
                    <nav className="lg:w-[220px] bg-white border-r border-b border-[#e5e5e5] p-4 flex-shrink-0">
                        <ul className="space-y-1">
                            {tabs.map(t => (
                                <li key={t.id}>
                                    <button
                                        onClick={() => setActiveTab(t.id)}
                                        className={`w-full flex items-center gap-3 px-3.5 py-3 rounded text-[13px] font-medium transition-all text-left
                                            ${activeTab === t.id
                                                ? 'bg-[#f0f0f0] text-black font-semibold'
                                                : 'text-[#888] hover:text-black hover:bg-[#f5f5f5]'}`}
                                    >
                                        <span className="text-base">{t.icon}</span>
                                        {t.label}
                                        {activeTab === t.id && (
                                            <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#FF3A3A]" />
                                        )}
                                    </button>
                                </li>
                            ))}
                        </ul>

                        <div className="mt-6 pt-6 border-t border-[#f0f0f0]">
                            <button
                                onClick={async () => {
                                    try { await authService.logout(); } catch { }
                                    dispatch(logout());
                                    navigate('/');
                                }}
                                className="w-full flex items-center gap-3 px-3.5 py-3 rounded text-[13px] font-medium text-red-400 hover:text-red-600 hover:bg-red-50 transition-all"
                            >
                                <span>↩</span>
                                Sign Out
                            </button>
                        </div>
                    </nav>

                    {/* Tab Content */}
                    <div className="flex-1 p-8">
                        {activeTab === 'personal' && (
                            <PersonalTab
                                profile={profile}
                                loading={loading}
                                onSave={handleSavePersonal}
                                saving={saving}
                            />
                        )}
                        {activeTab === 'security' && (
                            <SecurityTab
                                onChangePassword={handleChangePassword}
                                saving={saving}
                            />
                        )}
                        {activeTab === 'addresses' && (
                            <AddressesTab
                                addresses={addresses}
                                loading={loading}
                                onAdd={handleAddAddress}
                                onEdit={handleEditAddress}
                                onDelete={handleDeleteAddress}
                                onSetDefault={handleSetDefault}
                                saving={saving}
                            />
                        )}
                    </div>
                </div>
            </div>

            {/* Toast */}
            {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
        </div>
    );
};

export default ProfilePage;
