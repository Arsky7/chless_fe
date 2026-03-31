import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Store, Globe, Mail, Link as LinkIcon, Save, RefreshCw, Shield, ShieldAlert } from 'lucide-react';
import { settingService, SettingsMap } from '../../../services/settingService';

type Tab = 'general' | 'store' | 'links' | 'account';

const SettingsPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState<Tab>('general');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [accountSaving, setAccountSaving] = useState(false);
    const [passwordSaving, setPasswordSaving] = useState(false);

    // Separate state for account tab inputs to avoid mixing with global settings React Hook Form
    const [profileData, setProfileData] = useState({ name: '', email: '' });
    const [passwordData, setPasswordData] = useState({ current_password: '', new_password: '', new_password_confirmation: '' });

    const { register, handleSubmit, reset } = useForm<SettingsMap>();

    const fetchSettings = async () => {
        setLoading(true);
        try {
            const response = await settingService.getSettings();
            // Reset form with fetched data
            reset(response.data || {});
        } catch (error) {
            console.error('Failed to load settings', error);
            toast.error('Failed to load settings configuration');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSettings();

        // Also load current auth profile
        import('../../../services/authService').then(({ authService }) => {
            authService.me().then(res => {
                if (res.success && res.data.user) {
                    setProfileData({ name: res.data.user.name, email: res.data.user.email });
                }
            });
        });
    }, []);

    const onSubmit = async (data: SettingsMap) => {
        setSaving(true);
        try {
            // Filter out empty string values to avoid saving junk
            const cleanData = Object.fromEntries(
                Object.entries(data).filter(([_, v]) => v !== '' && v !== null)
            );

            const response = await settingService.updateSettings(cleanData);
            reset(response.data); // Update form with guaranteed server state
            toast.success('Settings updated successfully!');
        } catch (error) {
            console.error('Failed to update settings', error);
            toast.error('Could not save settings changes');
        } finally {
            setSaving(false);
        }
    };

    const tabs = [
        { id: 'general', label: 'General Configuration', icon: Globe },
        { id: 'store', label: 'Store Information', icon: Store },
        { id: 'links', label: 'Social & Links', icon: LinkIcon },
        { id: 'account', label: 'Account Security', icon: Shield },
    ];

    const handleUpdateProfile = async () => {
        setAccountSaving(true);
        try {
            const { authService } = await import('../../../services/authService');
            await authService.updateProfile({ name: profileData.name });
            toast.success('Profile updated successfully');
        } catch (e) {
            toast.error('Failed to update profile');
        } finally {
            setAccountSaving(false);
        }
    };

    const handleChangePassword = async () => {
        if (passwordData.new_password !== passwordData.new_password_confirmation) {
            toast.error("New passwords don't match");
            return;
        }
        setPasswordSaving(true);
        try {
            const { authService } = await import('../../../services/authService');
            await authService.changePassword(passwordData);
            toast.success('Password changed successfully');
            setPasswordData({ current_password: '', new_password: '', new_password_confirmation: '' });
        } catch (e: any) {
            toast.error(e.response?.data?.message || 'Failed to change password');
        } finally {
            setPasswordSaving(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50/50 p-6 lg:p-8">
            <div className="max-w-4xl mx-auto">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Application Settings</h1>
                        <p className="text-gray-500 mt-1">Manage your store's global configuration and contact details.</p>
                    </div>

                    <button
                        onClick={() => fetchSettings()}
                        disabled={loading || saving}
                        className="p-2 text-gray-400 hover:text-gray-900 bg-white rounded-lg shadow-sm border border-gray-200 transition-colors tooltip"
                        title="Refresh Settings"
                    >
                        <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                    </button>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden flex flex-col md:flex-row min-h-[500px]">
                    {/* Vertical Tabs Sidebar */}
                    <div className="w-full md:w-64 bg-gray-50/80 border-b md:border-b-0 md:border-r border-gray-200 p-4">
                        <nav className="flex flex-row md:flex-col gap-2 overflow-x-auto custom-scrollbar pb-2 md:pb-0">
                            {tabs.map((tab) => {
                                const Icon = tab.icon;
                                const isActive = activeTab === tab.id;
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id as Tab)}
                                        className={`
                      flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all whitespace-nowrap
                      ${isActive
                                                ? 'bg-black text-white shadow-md'
                                                : 'text-gray-600 hover:bg-gray-200/50 hover:text-gray-900'}
                    `}
                                    >
                                        <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-gray-400'}`} />
                                        {tab.label}
                                    </button>
                                );
                            })}
                        </nav>
                    </div>

                    {/* Form Content Area */}
                    <div className="flex-1 p-6 md:p-8">
                        {loading ? (
                            <div className="h-full flex flex-col items-center justify-center text-gray-400 gap-4">
                                <div className="w-8 h-8 border-4 border-gray-200 border-t-black rounded-full animate-spin"></div>
                                <p>Loading configuration...</p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit(onSubmit)} className="h-full flex flex-col">

                                <div className="flex-1">
                                    {/* General Configuration Tab */}
                                    <div className={activeTab === 'general' ? 'block space-y-6' : 'hidden'}>
                                        <h2 className="text-lg font-bold text-gray-900 mb-4">General Configuration</h2>

                                        <div className="grid grid-cols-1 gap-6">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Site Title</label>
                                                <input
                                                    type="text"
                                                    {...register('site_title')}
                                                    className="w-full rounded-lg border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm"
                                                    placeholder="e.g., CHLESS Official Store"
                                                />
                                                <p className="mt-1 text-xs text-gray-500">The primary title displayed on the browser tab.</p>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Currency Symbol</label>
                                                <input
                                                    type="text"
                                                    {...register('currency_symbol')}
                                                    className="w-full rounded-lg border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm"
                                                    placeholder="e.g., Rp"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Maintenance Mode</label>
                                                <select
                                                    {...register('maintenance_mode')}
                                                    className="w-full rounded-lg border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm"
                                                >
                                                    <option value="false">Disabled (Live)</option>
                                                    <option value="true">Enabled (Offline)</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Store Details Tab */}
                                    <div className={activeTab === 'store' ? 'block space-y-6' : 'hidden'}>
                                        <h2 className="text-lg font-bold text-gray-900 mb-4">Store Information</h2>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="md:col-span-2">
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Contact Email</label>
                                                <div className="relative">
                                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                        <Mail className="h-4 w-4 text-gray-400" />
                                                    </div>
                                                    <input
                                                        type="email"
                                                        {...register('contact_email')}
                                                        className="pl-10 w-full rounded-lg border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm"
                                                        placeholder="support@chless.com"
                                                    />
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Support Phone</label>
                                                <input
                                                    type="text"
                                                    {...register('support_phone')}
                                                    className="w-full rounded-lg border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm"
                                                    placeholder="+62 812 3456 7890"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp Number</label>
                                                <input
                                                    type="text"
                                                    {...register('whatsapp_number')}
                                                    className="w-full rounded-lg border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm"
                                                    placeholder="6281234567890"
                                                />
                                            </div>

                                            <div className="md:col-span-2">
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Store Physical Address</label>
                                                <textarea
                                                    {...register('store_address')}
                                                    rows={3}
                                                    className="w-full rounded-lg border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm resize-none"
                                                    placeholder="Enter the main address of your business..."
                                                ></textarea>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Links & Socials Tab */}
                                    <div className={activeTab === 'links' ? 'block space-y-6' : 'hidden'}>
                                        <h2 className="text-lg font-bold text-gray-900 mb-4">Social Media & Links</h2>

                                        <div className="grid grid-cols-1 gap-6">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Instagram URL</label>
                                                <input
                                                    type="url"
                                                    {...register('social_instagram')}
                                                    className="w-full rounded-lg border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm"
                                                    placeholder="https://instagram.com/chless"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">TikTok URL</label>
                                                <input
                                                    type="url"
                                                    {...register('social_tiktok')}
                                                    className="w-full rounded-lg border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm"
                                                    placeholder="https://tiktok.com/@chless"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Account Tab */}
                                    <div className={activeTab === 'account' ? 'block space-y-6' : 'hidden'}>
                                        <h2 className="text-lg font-bold text-gray-900 mb-4">Profile Details</h2>

                                        <div className="grid grid-cols-1 gap-4 mb-8">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Display Name</label>
                                                <input
                                                    type="text"
                                                    value={profileData.name}
                                                    onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                                                    className="w-full rounded-lg border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Email <span className="text-gray-400 text-xs">(Read Only)</span></label>
                                                <input
                                                    type="email"
                                                    value={profileData.email}
                                                    readOnly disabled
                                                    className="w-full rounded-lg border-gray-200 bg-gray-50 text-gray-500 shadow-sm sm:text-sm"
                                                />
                                            </div>
                                            <div>
                                                <button type="button" onClick={handleUpdateProfile} disabled={accountSaving} className="mt-2 bg-black text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition disabled:opacity-50">
                                                    {accountSaving ? 'Updating...' : 'Update Profile'}
                                                </button>
                                            </div>
                                        </div>

                                        <div className="border-t border-gray-100 mb-6"></div>

                                        <h2 className="text-lg font-bold text-gray-900 mb-4 text-red-600 flex items-center gap-2">
                                            <ShieldAlert className="w-5 h-5" /> Change Password
                                        </h2>
                                        <div className="grid grid-cols-1 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                                                <input
                                                    type="password"
                                                    value={passwordData.current_password}
                                                    onChange={(e) => setPasswordData({ ...passwordData, current_password: e.target.value })}
                                                    className="w-full rounded-lg border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                                                <input
                                                    type="password"
                                                    value={passwordData.new_password}
                                                    onChange={(e) => setPasswordData({ ...passwordData, new_password: e.target.value })}
                                                    className="w-full rounded-lg border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                                                <input
                                                    type="password"
                                                    value={passwordData.new_password_confirmation}
                                                    onChange={(e) => setPasswordData({ ...passwordData, new_password_confirmation: e.target.value })}
                                                    className="w-full rounded-lg border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm"
                                                />
                                            </div>
                                            <div>
                                                <button type="button" onClick={handleChangePassword} disabled={passwordSaving} className="mt-2 bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition disabled:opacity-50">
                                                    {passwordSaving ? 'Changing Password...' : 'Change Password'}
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                </div>

                                {/* Save global settings button, hidden on account tab because account uses its own buttons */}
                                {activeTab !== 'account' && (
                                    <div className="pt-6 mt-6 border-t border-gray-100 flex justify-end">
                                        <button
                                            type="submit"
                                            disabled={saving}
                                            className="flex items-center gap-2 bg-black hover:bg-gray-800 text-white px-6 py-2.5 rounded-xl font-medium transition-all shadow-sm focus:ring-4 focus:ring-gray-200 disabled:opacity-70 disabled:cursor-not-allowed"
                                        >
                                            {saving ? (
                                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                            ) : (
                                                <Save className="w-4 h-4" />
                                            )}
                                            {saving ? 'Saving Changes...' : 'Save Settings'}
                                        </button>
                                    </div>
                                )}

                            </form>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default SettingsPage;
