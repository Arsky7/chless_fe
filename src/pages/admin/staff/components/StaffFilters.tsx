import React from 'react';
import { Search, Filter, Plus } from 'lucide-react';
import { StaffFilters as IStaffFilters } from '../types/staff.types';

interface StaffFiltersProps {
    filters: IStaffFilters;
    onFilterChange: (filters: IStaffFilters) => void;
    onAddStaff: () => void;
}

const StaffFilters: React.FC<StaffFiltersProps> = ({ filters, onFilterChange, onAddStaff }) => {
    return (
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-6">
            <div className="flex flex-1 items-center gap-4 w-full">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search staff by name, email, or number..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/5 transition-all"
                        value={filters.search}
                        onChange={(e) => onFilterChange({ ...filters, search: e.target.value })}
                    />
                </div>
                <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4 text-gray-400" />
                    <select
                        className="border border-gray-200 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black/5 transition-all outline-none"
                        value={filters.status}
                        onChange={(e) => onFilterChange({ ...filters, status: e.target.value })}
                    >
                        <option value="all">All Statuses</option>
                        <option value="active">Active</option>
                        <option value="onleave">On Leave</option>
                        <option value="inactive">Inactive</option>
                    </select>
                </div>
            </div>
            <button
                onClick={onAddStaff}
                className="flex items-center gap-2 bg-black text-white px-6 py-2 rounded-xl hover:bg-zinc-800 transition-colors w-full md:w-auto justify-center"
            >
                <Plus className="w-4 h-4" />
                Add New Staff
            </button>
        </div>
    );
};

export default StaffFilters;
