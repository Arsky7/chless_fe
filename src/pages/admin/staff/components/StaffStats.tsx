import React from 'react';
import { Users, UserCheck } from 'lucide-react';
import { StaffStats as IStaffStats } from '../types/staff.types';

interface StaffStatsProps {
    stats: IStaffStats | null;
    loading: boolean;
}

const StaffStats: React.FC<StaffStatsProps> = ({ stats, loading }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                <div className="w-12 h-12 bg-black/5 text-black rounded-xl flex items-center justify-center">
                    <Users className="w-6 h-6" />
                </div>
                <div>
                    <h3 className="text-gray-500 text-sm font-medium">Total Staff</h3>
                    {loading ? (
                        <div className="h-8 w-16 bg-gray-100 animate-pulse rounded mt-1"></div>
                    ) : (
                        <p className="text-2xl font-bold text-black">{stats?.total_staff || 0}</p>
                    )}
                </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                <div className="w-12 h-12 bg-green-50 text-green-600 rounded-xl flex items-center justify-center">
                    <UserCheck className="w-6 h-6" />
                </div>
                <div>
                    <h3 className="text-gray-500 text-sm font-medium">Active Staff</h3>
                    {loading ? (
                        <div className="h-8 w-16 bg-gray-100 animate-pulse rounded mt-1"></div>
                    ) : (
                        <p className="text-2xl font-bold text-black">{stats?.active_staff || 0}</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default StaffStats;
