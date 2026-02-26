import React, { useState, useEffect } from 'react';
import { X, User, Mail, Phone, Calendar, MapPin, PhoneCall, Key, Hash } from 'lucide-react';
import { Staff } from '../types/staff.types';

interface StaffModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: any) => void;
    staff: Staff | null;
    loading: boolean;
}

const StaffModal: React.FC<StaffModalProps> = ({ isOpen, onClose, onSave, staff, loading }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        phone: '',
        staff_number: '',
        join_date: new Date().toISOString().split('T')[0],
        schedule: '',
        shift_days: '',
        address: '',
        emergency_contact: '',
    });

    useEffect(() => {
        if (staff) {
            setFormData({
                name: staff.full_name,
                email: staff.email,
                password: '', // Don't show password
                phone: staff.phone || '',
                staff_number: staff.staff_number,
                join_date: staff.join_date,
                schedule: staff.schedule || '',
                shift_days: staff.shift_days || '',
                address: staff.address || '',
                emergency_contact: staff.emergency_contact || '',
            });
        } else {
            setFormData({
                name: '',
                email: '',
                password: '',
                phone: '',
                staff_number: `STF-${Math.floor(1000 + Math.random() * 9000)}`,
                join_date: new Date().toISOString().split('T')[0],
                schedule: '',
                shift_days: '',
                address: '',
                emergency_contact: '',
            });
        }
    }, [staff, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-white sticky top-0 z-10">
                    <h2 className="text-xl font-bold text-gray-900">
                        {staff ? 'Edit Staff Member' : 'Add New Staff Member'}
                    </h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 overflow-y-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Basic Info */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Account Information</h3>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input
                                        required
                                        type="text"
                                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black/5 outline-none"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input
                                        required
                                        type="email"
                                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black/5 outline-none"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    />
                                </div>
                            </div>
                            {!staff && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                                    <div className="relative">
                                        <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <input
                                            required
                                            type="password"
                                            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black/5 outline-none"
                                            value={formData.password}
                                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        />
                                    </div>
                                </div>
                            )}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input
                                        type="tel"
                                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black/5 outline-none"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Employment Info */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Employment Details</h3>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Staff ID Number</label>
                                <div className="relative">
                                    <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input
                                        required
                                        type="text"
                                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black/5 outline-none bg-gray-50 text-gray-500 cursor-not-allowed"
                                        value={formData.staff_number}
                                        readOnly
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Join Date</label>
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input
                                        required
                                        type="date"
                                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black/5 outline-none"
                                        value={formData.join_date}
                                        onChange={(e) => setFormData({ ...formData, join_date: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Emergency Contact</label>
                                <div className="relative">
                                    <PhoneCall className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Name & Phone"
                                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black/5 outline-none"
                                        value={formData.emergency_contact}
                                        onChange={(e) => setFormData({ ...formData, emergency_contact: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                                    <textarea
                                        rows={2}
                                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black/5 outline-none resize-none"
                                        value={formData.address}
                                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 flex items-center justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-2 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            disabled={loading}
                            type="submit"
                            className="px-6 py-2 bg-black text-white rounded-xl hover:bg-zinc-800 transition-colors flex items-center gap-2"
                        >
                            {loading && <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>}
                            {staff ? 'Update Staff' : 'Add Staff'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default StaffModal;
