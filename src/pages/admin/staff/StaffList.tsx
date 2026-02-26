import React, { useState, useEffect } from 'react';
import StaffStats from './components/StaffStats';
import StaffFilters from './components/StaffFilters';
import StaffTable from './components/StaffTable';
import StaffModal from './components/StaffModal';
import staffService from '../../../services/staffService';
import { Staff, StaffStats as IStaffStats, StaffFilters as IStaffFilters } from './types/staff.types';
import toast from 'react-hot-toast';

const StaffList: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const [modalLoading, setModalLoading] = useState(false);
    const [staff, setStaff] = useState<Staff[]>([]);
    const [stats, setStats] = useState<IStaffStats | null>(null);
    const [filters, setFilters] = useState<IStaffFilters>({
        status: 'all',
        search: '',
        page: 1,
        per_page: 10
    });
    const [pagination, setPagination] = useState({
        total: 0,
        last_page: 1,
        current_page: 1
    });

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingStaff, setEditingStaff] = useState<Staff | null>(null);

    const fetchStaffData = async () => {
        try {
            setLoading(true);
            const [staffResponse, statsResponse] = await Promise.all([
                staffService.getStaff(filters),
                staffService.getStats()
            ]);

            setStaff(staffResponse.data);
            setStats(statsResponse);
            setPagination({
                total: staffResponse.meta.total,
                last_page: staffResponse.meta.last_page,
                current_page: staffResponse.meta.current_page
            });
        } catch (error) {
            console.error('Error fetching staff data:', error);
            toast.error('Failed to load staff data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStaffData();
    }, [filters.status, filters.page]);

    // Debounce search
    useEffect(() => {
        const handler = setTimeout(() => {
            if (filters.search !== undefined) {
                fetchStaffData();
            }
        }, 500);
        return () => clearTimeout(handler);
    }, [filters.search]);

    const handleAddStaff = () => {
        setEditingStaff(null);
        setIsModalOpen(true);
    };

    const handleEditStaff = (item: Staff) => {
        setEditingStaff(item);
        setIsModalOpen(true);
    };

    const handleSaveStaff = async (data: any) => {
        try {
            setModalLoading(true);
            if (editingStaff) {
                await staffService.updateStaff(editingStaff.id, data);
                toast.success('Staff updated successfully');
            } else {
                await staffService.createStaff(data);
                toast.success('Staff added successfully');
            }
            setIsModalOpen(false);
            fetchStaffData();
        } catch (error: any) {
            console.error('Error saving staff:', error);
            toast.error(error.response?.data?.message || 'Failed to save staff');
        } finally {
            setModalLoading(false);
        }
    };

    const handleUpdateStatus = async (id: number, status: 'active' | 'onleave' | 'inactive') => {
        try {
            await staffService.updateStatus(id, status);
            toast.success('Status updated');
            fetchStaffData();
        } catch (error) {
            toast.error('Failed to update status');
        }
    };

    const handleDeleteStaff = async (id: number) => {
        if (window.confirm('Are you sure you want to delete this staff member? This will also delete their account.')) {
            try {
                await staffService.deleteStaff(id);
                toast.success('Staff deleted');
                fetchStaffData();
            } catch (error) {
                toast.error('Failed to delete staff');
            }
        }
    };

    return (
        <div className="p-6">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900">Staff Management</h1>
                <p className="text-gray-500">Manage your team members and their employment details.</p>
            </div>

            <StaffStats stats={stats} loading={loading} />

            <StaffFilters
                filters={filters}
                onFilterChange={setFilters}
                onAddStaff={handleAddStaff}
            />

            <StaffTable
                staff={staff}
                loading={loading}
                onEdit={handleEditStaff}
                onView={(s) => console.log('View', s)}
                onUpdateStatus={handleUpdateStatus}
                onDelete={handleDeleteStaff}
            />

            {/* Pagination */}
            <div className="mt-6 flex items-center justify-between">
                <p className="text-sm text-gray-500">
                    Showing <span className="font-medium">{staff.length}</span> of <span className="font-medium">{pagination.total}</span> staff
                </p>
                <div className="flex items-center gap-2">
                    <button
                        disabled={filters.page === 1 || loading}
                        onClick={() => setFilters({ ...filters, page: (filters.page || 1) - 1 })}
                        className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 disabled:opacity-50 transition-colors"
                    >
                        Previous
                    </button>
                    <button
                        disabled={filters.page === pagination.last_page || loading}
                        onClick={() => setFilters({ ...filters, page: (filters.page || 1) + 1 })}
                        className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 disabled:opacity-50 transition-colors"
                    >
                        Next
                    </button>
                </div>
            </div>

            <StaffModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSaveStaff}
                staff={editingStaff}
                loading={modalLoading}
            />
        </div>
    );
};

export default StaffList;
