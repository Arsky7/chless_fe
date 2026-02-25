import React, { useState, useEffect, useCallback, useRef } from 'react';
import { toast } from 'react-hot-toast';
import { apiService, API_ENDPOINTS } from '../../../services/api';
import {
    Search, Download, Plus, MoreVertical,
    CheckCircle2, XCircle, Clock, AlertCircle, ChevronDown, Package,
    ChevronLeft, ChevronRight, RefreshCw
} from 'lucide-react';

interface ReturnRequestData {
    id: number;
    return_number: string;
    order_id: number;
    order?: any;
    user?: {
        name: string;
        email: string;
        id: number;
    };
    product?: {
        name: string;
        sku: string;
    };
    reason: string;
    status: 'Pending Review' | 'In Review' | 'Approved' | 'Rejected' | 'Refunded';
    status_date: string | null;
    video_status: 'Video Pending' | 'Video Reviewed' | 'No Video';
    refund_amount: string | number;
    request_date: string;
    updated_at: string;
}

interface ReturnStats {
    pending_review: number;
    in_review: number;
    approved_this_week: number;
    total_refunded: number;
}

interface Pagination {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

interface Filters {
    search: string;
    status: string;
    video_status: string;
    date_range: string;
    page: number;
}





const ReturnsManagementPage = () => {
    const [stats, setStats] = useState<ReturnStats | null>(null);
    const [returns, setReturns] = useState<ReturnRequestData[]>([]);
    const [pagination, setPagination] = useState<Pagination>({ current_page: 1, last_page: 1, per_page: 10, total: 0 });

    const [statsLoading, setStatsLoading] = useState(true);
    const [tableLoading, setTableLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);

    const [selectedItems, setSelectedItems] = useState<number[]>([]);
    const [filters, setFilters] = useState<Filters>({ search: '', status: 'All Status', video_status: 'All', date_range: 'All Time', page: 1 });
    const [pendingSearch, setPendingSearch] = useState('');
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const [viewingReturn, setViewingReturn] = useState<ReturnRequestData | null>(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

    // ── Fetch Stats ─────────────────────────────
    const fetchStats = useCallback(async () => {
        try {
            setStatsLoading(true);
            const res: any = await apiService.get(API_ENDPOINTS.RETURNS.STATS);
            setStats(res?.data || res);
        } catch {
            toast.error('Failed to load stats');
        } finally {
            setStatsLoading(false);
        }
    }, []);

    // ── Fetch Returns ─────────────────────
    const fetchReturns = useCallback(async (f: Filters) => {
        try {
            setTableLoading(true);
            const res: any = await apiService.get(API_ENDPOINTS.RETURNS.INDEX, {
                search: f.search,
                status: f.status,
                video_status: f.video_status,
                date_range: f.date_range,
                page: f.page,
                per_page: 10
            });
            const rows: ReturnRequestData[] = Array.isArray(res?.data?.data) ? res.data.data : [];
            setReturns(rows);
            setPagination({
                current_page: res?.data?.current_page ?? 1,
                last_page: res?.data?.last_page ?? 1,
                per_page: res?.data?.per_page ?? 10,
                total: res?.data?.total ?? 0,
            });
        } catch {
            toast.error('Failed to load returns');
            setReturns([]);
        } finally {
            setTableLoading(false);
        }
    }, []);

    useEffect(() => { fetchStats(); }, [fetchStats]);
    useEffect(() => { fetchReturns(filters); }, [fetchReturns, filters]);

    // ── Debounced search ──────────────────────────
    const handleSearchChange = (v: string) => {
        setPendingSearch(v);
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => {
            setFilters(f => ({ ...f, search: v, page: 1 }));
        }, 450);
    };

    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            setSelectedItems(returns.map(r => r.id));
        } else {
            setSelectedItems([]);
        }
    };

    const handleSelectItem = (id: number) => {
        setSelectedItems(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const handleUpdateStatus = async (id: number, status: string) => {
        try {
            setActionLoading(true);
            await apiService.put(API_ENDPOINTS.RETURNS.DETAIL(id), { status });
            toast.success('Return status updated successfully');
            fetchStats();
            fetchReturns(filters);
        } catch (error) {
            toast.error('Failed to update status');
        } finally {
            setActionLoading(false);
        }
    };

    const handleBulkAction = async (action: 'approve' | 'reject') => {
        if (selectedItems.length === 0) return;
        if (!confirm(`Are you sure you want to bulk ${action} these requests?`)) return;

        try {
            setActionLoading(true);
            await apiService.post(API_ENDPOINTS.RETURNS.BULK_ACTION, {
                ids: selectedItems,
                action
            });
            toast.success(`Selected requests ${action}d successfully`);
            setSelectedItems([]);
            fetchStats();
            fetchReturns(filters);
        } catch (error) {
            toast.error(`Failed to bulk ${action} requests`);
        } finally {
            setActionLoading(false);
        }
    };

    const resetFilters = () => {
        setPendingSearch('');
        setFilters({ search: '', status: 'All Status', video_status: 'All', date_range: 'All Time', page: 1 });
    };

    const goPage = (p: number) => setFilters(f => ({ ...f, page: p }));

    const handleViewDetails = (item: ReturnRequestData) => {
        setViewingReturn(item);
        setIsDetailModalOpen(true);
    };

    // Helper functions
    const isFiltered = filters.status !== 'All Status' || filters.video_status !== 'All' || filters.date_range !== 'All Time' || filters.search !== '';

    // ── Helper Formatting Functions ─────────────────────────
    const formatRp = (amount: number | string) => {
        const num = typeof amount === 'string' ? parseFloat(amount) : amount;
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(num || 0);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Pending Review': return 'bg-orange-100 text-orange-600';
            case 'In Review': return 'bg-blue-100 text-blue-600';
            case 'Approved': return 'bg-green-100 text-green-600';
            case 'Rejected': return 'bg-red-100 text-red-600';
            case 'Refunded': return 'bg-purple-100 text-purple-600';
            default: return 'bg-gray-100 text-gray-600';
        }
    };

    const getStatusIconColor = (status: string) => {
        switch (status) {
            case 'Pending Review': return 'from-orange-400 to-orange-300';
            case 'In Review': return 'from-blue-500 to-blue-400';
            case 'Approved': return 'from-green-500 to-green-400';
            case 'Rejected': return 'from-red-500 to-red-400';
            case 'Refunded': return 'from-purple-500 to-purple-400';
            default: return 'from-gray-400 to-gray-300';
        }
    };

    const formatDate = (date: string | Date | undefined) => {
        if (!date) return '-';
        return new Date(date).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    };

    const formatTime = (date: string | Date | undefined) => {
        if (!date) return '';
        return new Date(date).toLocaleTimeString('en-GB', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getInitials = (name: string | undefined) => {
        if (!name) return '?';
        return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
    };

    return (

        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-start pb-4 border-b border-gray-100">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Returns Management</h1>
                    <p className="text-gray-500 text-sm mt-1">Review and process customer return requests</p>
                </div>
                <div className="bg-white shadow-sm border border-gray-100 rounded-lg px-4 py-2 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span className="text-sm font-medium text-gray-700">
                        {new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                    </span>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: 'Pending Review', value: stats?.pending_review ?? 0, icon: AlertCircle, color: 'from-orange-500 to-orange-400', barCol: 'bg-orange-500' },
                    { label: 'In Review', value: stats?.in_review ?? 0, icon: Search, color: 'from-blue-500 to-blue-400', barCol: 'bg-blue-500' },
                    { label: 'Approved This Week', value: stats?.approved_this_week ?? 0, icon: CheckCircle2, color: 'from-green-500 to-green-400', barCol: 'bg-green-500' },
                    { label: 'Total Refunded', value: formatRp(stats?.total_refunded ?? 0), icon: CheckCircle2, color: 'from-purple-500 to-purple-400', barCol: 'bg-purple-500' },
                ].map((stat, i) => (
                    <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden relative group">
                        <div className={`absolute top-0 left-0 w-full h-1 ${stat.barCol}`} />
                        <div className="p-5">
                            <div className="flex justify-between items-start">
                                <p className="text-sm font-semibold text-gray-600">{stat.label}</p>
                                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center text-white shadow-sm`}>
                                    <stat.icon className="w-5 h-5" />
                                </div>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mt-2">
                                {statsLoading ? <div className="h-8 bg-gray-200 rounded animate-pulse w-1/2 mt-1"></div> : stat.value}
                            </h3>
                        </div>
                    </div>
                ))}
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-gray-700">Status</label>
                        <div className="relative">
                            <select
                                value={filters.status}
                                onChange={e => setFilters(f => ({ ...f, status: e.target.value, page: 1 }))}
                                className="w-full bg-gray-50 border border-gray-200 text-gray-700 rounded-lg px-3 py-2 text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-black">
                                <option>All Status</option>
                                <option>Pending Review</option>
                                <option>In Review</option>
                                <option>Approved</option>
                                <option>Rejected</option>
                                <option>Refunded</option>
                            </select>
                            <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-2.5 pointer-events-none" />
                        </div>
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-gray-700">Return Date</label>
                        <div className="relative">
                            <select
                                value={filters.date_range}
                                onChange={e => setFilters(f => ({ ...f, date_range: e.target.value, page: 1 }))}
                                className="w-full bg-gray-50 border border-gray-200 text-gray-700 rounded-lg px-3 py-2 text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-black">
                                <option>All Time</option>
                                <option>Today</option>
                                <option>This Week</option>
                                <option>This Month</option>
                            </select>
                            <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-2.5 pointer-events-none" />
                        </div>
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-gray-700">Search Returns</label>
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search by ID, customer..."
                                value={pendingSearch}
                                onChange={e => handleSearchChange(e.target.value)}
                                className="w-full bg-gray-50 border border-gray-200 text-gray-700 rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                            />
                            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                        </div>
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-gray-700">Video Status</label>
                        <div className="relative">
                            <select
                                value={filters.video_status}
                                onChange={e => setFilters(f => ({ ...f, video_status: e.target.value, page: 1 }))}
                                className="w-full bg-gray-50 border border-gray-200 text-gray-700 rounded-lg px-3 py-2 text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-black">
                                <option>All</option>
                                <option>Has Video</option>
                                <option>No Video</option>
                            </select>
                            <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-2.5 pointer-events-none" />
                        </div>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <button onClick={() => { fetchStats(); fetchReturns(filters); }} className="bg-black text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors flex items-center gap-2">
                        <RefreshCw className="w-4 h-4" /> Refresh Data
                    </button>
                    {isFiltered && (
                        <button onClick={resetFilters} className="bg-white border text-red-600 border-red-200 px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-50 transition-colors flex items-center gap-2">
                            <XCircle className="w-4 h-4" /> Clear Filters
                        </button>
                    )}
                    <button className="bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors flex items-center gap-2">
                        <Download className="w-4 h-4" /> Export CSV
                    </button>
                    {selectedItems.length > 0 && (
                        <div className="flex gap-2">
                            <button onClick={() => handleBulkAction('approve')} disabled={actionLoading} className="bg-green-50 border border-green-200 text-green-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-100 transition-colors flex items-center gap-2 disabled:opacity-50">
                                <CheckCircle2 className="w-4 h-4" /> Bulk Approve ({selectedItems.length})
                            </button>
                            <button onClick={() => handleBulkAction('reject')} disabled={actionLoading} className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors flex items-center gap-2 disabled:opacity-50">
                                <XCircle className="w-4 h-4" /> Bulk Reject ({selectedItems.length})
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Table Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="flex flex-col sm:flex-row justify-between items-center p-5 border-b border-gray-100 gap-4">
                    <h2 className="text-lg font-semibold text-gray-900">
                        Return Requests
                        {!tableLoading && <span className="ml-2 text-sm font-normal text-gray-500">(Total: {pagination.total} requests)</span>}
                    </h2>
                    <div className="flex items-center gap-3 w-full sm:w-auto">
                        <button className="flex-1 sm:flex-none bg-black text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors flex items-center justify-center gap-2">
                            <Plus className="w-4 h-4" /> Create Return
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50 border-b border-gray-100">
                                <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    <input
                                        type="checkbox"
                                        className="rounded border-gray-300 text-black focus:ring-black"
                                        onChange={handleSelectAll}
                                        checked={selectedItems.length === returns.length && returns.length > 0}
                                    />
                                </th>
                                <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Return ID</th>
                                <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Customer</th>
                                <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Product</th>
                                <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Video</th>
                                <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Refund Amount</th>
                                <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Request Date</th>
                                <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 bg-white">
                            {tableLoading ? (
                                Array.from({ length: 5 }).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td className="px-6 py-4"><div className="h-4 w-4 bg-gray-200 rounded"></div></td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
                                                <div className="space-y-2">
                                                    <div className="h-4 w-20 bg-gray-200 rounded"></div>
                                                    <div className="h-3 w-16 bg-gray-100 rounded"></div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4"><div className="h-8 bg-gray-100 rounded w-24"></div></td>
                                        <td className="px-6 py-4"><div className="h-8 bg-gray-100 rounded w-24"></div></td>
                                        <td className="px-6 py-4"><div className="h-6 bg-gray-100 rounded-full w-20"></div></td>
                                        <td className="px-6 py-4"><div className="h-4 bg-gray-100 rounded w-16"></div></td>
                                        <td className="px-6 py-4"><div className="h-4 bg-gray-100 rounded w-16"></div></td>
                                        <td className="px-6 py-4"><div className="h-8 bg-gray-100 rounded w-24"></div></td>
                                        <td className="px-6 py-4"><div className="h-8 bg-gray-100 rounded w-16 ml-auto"></div></td>
                                    </tr>
                                ))
                            ) : returns.length === 0 ? (
                                <tr>
                                    <td colSpan={9} className="py-16 text-center">
                                        <div className="flex flex-col items-center justify-center">
                                            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                                                <Package className="w-8 h-8 text-gray-400" />
                                            </div>
                                            <p className="text-gray-900 font-medium text-lg">No return requests found</p>
                                            <p className="text-gray-500 text-sm mt-1">
                                                {isFiltered ? "No requests match your current filters." : "There are no return requests in the system."}
                                            </p>
                                            {isFiltered && (
                                                <button onClick={resetFilters} className="mt-4 text-sm font-medium text-black hover:underline">
                                                    Clear all filters
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                returns.map((item) => (
                                    <tr key={item.id} className="hover:bg-gray-50/50 transition-colors group">
                                        <td className="py-4 px-6">
                                            <input
                                                type="checkbox"
                                                className="rounded border-gray-300 text-black focus:ring-black mt-1"
                                                checked={selectedItems.includes(item.id)}
                                                onChange={() => handleSelectItem(item.id)}
                                            />
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-10 h-10 rounded-lg flex-shrink-0 bg-gradient-to-br ${getStatusIconColor(item.status)} flex items-center justify-center text-white shadow-sm`}>
                                                    <Package className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <div className="font-semibold text-gray-900 text-sm whitespace-nowrap">{item.return_number}</div>
                                                    <div className="text-xs text-gray-500 font-medium whitespace-nowrap">Order: {item.order_id}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div>
                                                <div className="font-medium text-gray-900 text-sm whitespace-nowrap">{item.user?.name || 'Unknown User'}</div>
                                                <div className="text-xs text-gray-500 whitespace-nowrap">{item.user?.email || '-'}</div>
                                                <div className="text-[11px] text-gray-400 mt-0.5 whitespace-nowrap">{getInitials(item.user?.name)} • ID: {item.user?.id || '-'}</div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="max-w-[200px]">
                                                <div className="font-semibold text-gray-900 text-sm truncate" title={item.product?.name}>{item.product?.name || 'Unknown Product'}</div>
                                                <div className="text-xs text-gray-500 truncate">{item.product?.sku || '-'}</div>
                                                <div className="text-[11px] text-gray-500 mt-1 truncate">Reason: {item.reason}</div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div>
                                                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${getStatusColor(item.status)}`}>
                                                    {item.status}
                                                </span>
                                                {item.status_date && (
                                                    <div className="text-[11px] text-gray-400 mt-1.5 whitespace-nowrap">{formatDate(item.status_date)}</div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-1.5 whitespace-nowrap">
                                                {item.video_status === 'No Video' ? (
                                                    <XCircle className="w-3.5 h-3.5 text-gray-400" />
                                                ) : item.video_status === 'Video Pending' ? (
                                                    <Clock className="w-3.5 h-3.5 text-orange-400" />
                                                ) : (
                                                    <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
                                                )}
                                                <span className={`text-xs ${item.video_status === 'No Video' ? 'text-gray-400' : 'text-gray-700 font-medium'}`}>
                                                    {item.video_status}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="font-bold text-gray-900 text-sm whitespace-nowrap">{formatRp(item.refund_amount)}</div>
                                            <div className="text-[11px] text-gray-500 whitespace-nowrap">Requested Amount</div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="font-medium text-gray-900 text-sm whitespace-nowrap">{formatDate(item.request_date)}</div>
                                            <div className="text-xs text-gray-500 whitespace-nowrap">{formatTime(item.request_date)}</div>
                                            <div className="text-[11px] text-gray-400 mt-1 whitespace-nowrap">Last updated: {formatDate(item.updated_at)}</div>
                                        </td>
                                        <td className="py-4 px-6 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => handleViewDetails(item)}
                                                    className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-transparent hover:border-blue-100" title="View Details">
                                                    <Search className="w-4 h-4" />
                                                </button>
                                                {item.status === 'Pending Review' && (
                                                    <button
                                                        disabled={actionLoading}
                                                        onClick={() => handleUpdateStatus(item.id, 'Approved')}
                                                        className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors border border-transparent hover:border-green-100 disabled:opacity-50" title="Approve">
                                                        <CheckCircle2 className="w-4 h-4" />
                                                    </button>
                                                )}
                                                {item.status === 'Pending Review' && (
                                                    <button
                                                        disabled={actionLoading}
                                                        onClick={() => handleUpdateStatus(item.id, 'Rejected')}
                                                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-100 disabled:opacity-50" title="Reject">
                                                        <XCircle className="w-4 h-4" />
                                                    </button>
                                                )}
                                                <button className="p-1.5 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors lg:hidden inline-block" title="More options">
                                                    <MoreVertical className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {!tableLoading && pagination.last_page > 1 && (
                    <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100 bg-gray-50">
                        <p className="text-xs text-gray-500">
                            Page {pagination.current_page} of {pagination.last_page} · {pagination.total.toLocaleString()} requests
                        </p>
                        <div className="flex gap-1.5">
                            <button onClick={() => goPage(pagination.current_page - 1)} disabled={pagination.current_page === 1} className="p-1.5 border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-40">
                                <ChevronLeft className="w-4 h-4" />
                            </button>
                            <button onClick={() => goPage(pagination.current_page + 1)} disabled={pagination.current_page === pagination.last_page} className="p-1.5 border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-40">
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Detail Modal */}
            {isDetailModalOpen && viewingReturn && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
                        <div className="flex justify-between items-center p-6 border-b border-gray-100 sticky top-0 bg-white">
                            <div>
                                <h3 className="text-xl font-bold text-gray-900">Return Details</h3>
                                <p className="text-sm text-gray-500 mt-1">{viewingReturn.return_number} • Order ID: {viewingReturn.order_id}</p>
                            </div>
                            <button
                                onClick={() => setIsDetailModalOpen(false)}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <XCircle className="w-6 h-6 text-gray-400" />
                            </button>
                        </div>

                        <div className="p-6 space-y-8">
                            {/* Status Header */}
                            <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-gray-50 border border-gray-100">
                                <div className="space-y-1">
                                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Current Status</p>
                                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-bold ${getStatusColor(viewingReturn.status)}`}>
                                        {viewingReturn.status}
                                    </span>
                                </div>
                                <div className="space-y-1 text-right">
                                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Requested On</p>
                                    <p className="text-sm font-bold text-gray-900">{formatDate(viewingReturn.request_date)} {formatTime(viewingReturn.request_date)}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* Customer & Product */}
                                <div className="space-y-6">
                                    <div>
                                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Customer Information</h4>
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 rounded-full bg-black flex items-center justify-center text-white font-bold">
                                                {getInitials(viewingReturn.user?.name)}
                                            </div>
                                            <div>
                                                <p className="font-bold text-gray-900">{viewingReturn.user?.name || 'Unknown'}</p>
                                                <p className="text-sm text-gray-500">{viewingReturn.user?.email || '-'}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Product Details</h4>
                                        <div className="p-4 rounded-xl border border-gray-100 bg-gray-50">
                                            <p className="font-bold text-gray-900">{viewingReturn.product?.name || 'Unknown'}</p>
                                            <p className="text-sm text-gray-500 mt-1">SKU: {viewingReturn.product?.sku || '-'}</p>
                                            <div className="mt-4 pt-4 border-t border-gray-200">
                                                <p className="text-xs font-semibold text-gray-400 uppercase mb-2">Reason for Return</p>
                                                <p className="text-sm text-gray-700 italic">"{viewingReturn.reason}"</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Financials & Video */}
                                <div className="space-y-6">
                                    <div>
                                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Refund Summary</h4>
                                        <div className="p-4 rounded-xl border border-gray-100 bg-gray-50">
                                            <div className="flex justify-between items-center mb-2">
                                                <span className="text-sm text-gray-500">Refund Amount</span>
                                                <span className="text-lg font-bold text-gray-900">{formatRp(viewingReturn.refund_amount)}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Unboxing Video</h4>
                                        <div className="p-4 rounded-xl border border-gray-100 bg-gray-50">
                                            <div className="flex items-center gap-2 mb-3">
                                                {viewingReturn.video_status === 'No Video' ? (
                                                    <XCircle className="w-4 h-4 text-red-500" />
                                                ) : viewingReturn.video_status === 'Video Pending' ? (
                                                    <Clock className="w-4 h-4 text-orange-500" />
                                                ) : (
                                                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                                                )}
                                                <p className="text-sm font-bold text-gray-900">{viewingReturn.video_status}</p>
                                            </div>
                                            {viewingReturn.video_status !== 'No Video' ? (
                                                <button className="w-full py-2 bg-black text-white rounded-lg text-sm font-bold hover:bg-gray-800 transition-colors">
                                                    Play Video
                                                </button>
                                            ) : (
                                                <p className="text-xs text-gray-500 italic">Customer did not upload an unboxing video.</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Actions Footer */}
                        <div className="p-6 border-t border-gray-100 flex gap-3 sticky bottom-0 bg-white">
                            {viewingReturn.status === 'Pending Review' || viewingReturn.status === 'In Review' ? (
                                <>
                                    <button
                                        onClick={() => { handleUpdateStatus(viewingReturn.id, 'Approved'); setIsDetailModalOpen(false); }}
                                        className="flex-1 py-3 bg-green-500 text-white rounded-xl font-bold hover:bg-green-600 transition-colors"
                                    >
                                        Approve Return
                                    </button>
                                    <button
                                        onClick={() => { handleUpdateStatus(viewingReturn.id, 'Rejected'); setIsDetailModalOpen(false); }}
                                        className="flex-1 py-3 border border-red-500 text-red-500 rounded-xl font-bold hover:bg-red-50 transition-colors"
                                    >
                                        Reject Request
                                    </button>
                                </>
                            ) : (
                                <button
                                    onClick={() => setIsDetailModalOpen(false)}
                                    className="w-full py-3 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition-colors"
                                >
                                    Close Details
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ReturnsManagementPage;
