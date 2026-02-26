import React from 'react';
import { MoreVertical, Mail, Phone, Calendar, CheckCircle2, Clock, XCircle } from 'lucide-react';
import { Staff } from '../types/staff.types';

interface StaffTableProps {
    staff: Staff[];
    loading: boolean;
    onEdit: (staff: Staff) => void;
    onView: (staff: Staff) => void;
    onUpdateStatus: (id: number, status: 'active' | 'onleave' | 'inactive') => void;
    onDelete: (id: number) => void;
}

const StaffTable: React.FC<StaffTableProps> = ({ staff, loading, onEdit, onView, onUpdateStatus, onDelete }) => {
    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'active':
                return (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-green-50 text-green-600">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Active
                    </span>
                );
            case 'onleave':
                return (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-600">
                        <Clock className="w-3.5 h-3.5" />
                        On Leave
                    </span>
                );
            case 'inactive':
                return (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-red-50 text-red-600">
                        <XCircle className="w-3.5 h-3.5" />
                        Inactive
                    </span>
                );
            default:
                return null;
        }
    };

    if (loading && staff.length === 0) {
        return (
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                <div className="p-8 text-center">
                    <div className="w-12 h-12 border-4 border-black/10 border-t-black rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-500">Loading staff data...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-gray-100">
                            <th className="px-6 py-4 text-sm font-semibold text-gray-900">Staff Member</th>
                            <th className="px-6 py-4 text-sm font-semibold text-gray-900">Email & Phone</th>
                            <th className="px-6 py-4 text-sm font-semibold text-gray-900">Status</th>
                            <th className="px-6 py-4 text-sm font-semibold text-gray-900">Join Date</th>
                            <th className="px-6 py-4 text-sm font-semibold text-gray-900 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {staff.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                                    No staff members found matching your filters.
                                </td>
                            </tr>
                        ) : (
                            staff.map((item) => (
                                <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-gray-100 to-gray-50 border border-gray-200 flex items-center justify-center text-gray-600 font-semibold overflow-hidden">
                                                {item.full_name.charAt(0)}
                                            </div>
                                            <div>
                                                <div className="font-medium text-gray-900">{item.full_name}</div>
                                                <div className="text-xs text-gray-500">{item.staff_number}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                <Mail className="w-3.5 h-3.5" />
                                                {item.email}
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                <Phone className="w-3.5 h-3.5" />
                                                {item.phone || '-'}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {getStatusBadge(item.status)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                        <div className="flex items-center gap-2">
                                            <Calendar className="w-3.5 h-3.5" />
                                            {item.join_date}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => onView(item)}
                                                className="p-2 text-gray-400 hover:text-black transition-colors"
                                                title="View Details"
                                            >
                                                <MoreVertical className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => onEdit(item)}
                                                className="px-3 py-1 text-sm font-medium text-black border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => onUpdateStatus(item.id, item.status === 'active' ? 'inactive' : 'active')}
                                                className={`px-3 py-1 text-sm font-medium border rounded-lg transition-colors ${item.status === 'active'
                                                        ? 'text-amber-600 border-amber-200 hover:bg-amber-50'
                                                        : 'text-green-600 border-green-200 hover:bg-green-50'
                                                    }`}
                                            >
                                                {item.status === 'active' ? 'Deactivate' : 'Activate'}
                                            </button>
                                            <button
                                                onClick={() => onDelete(item.id)}
                                                className="px-3 py-1 text-sm font-medium text-red-600 border border-red-100 rounded-lg hover:bg-red-50 transition-colors"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default StaffTable;
