// pages/admin/inventory/InventoryPage.tsx
import { useState, useEffect, useCallback } from 'react'
import { toast } from 'react-hot-toast'
import { apiService } from '../../../services/api'
import {
    Package,
    AlertTriangle,
    XCircle,
    Loader2,
    Search,
    RefreshCw,
    Plus,
    Minus,
    ChevronLeft,
    ChevronRight,
    X,
    BarChart3,
    TrendingDown,
} from 'lucide-react'

// ============================================
// Types
// ============================================

interface InventoryStats {
    total_skus: number
    low_stock: number
    critical: number
    out_of_stock: number
    total_value: number
    total_value_formatted: string
}

interface InventoryItem {
    id: number
    product_id: number
    product_name: string
    product_sku: string
    category_name: string
    image_url: string | null
    size: string
    stock: number
    reserved_stock: number
    available_stock: number
    base_price: number
    total_value: number
    status: 'good' | 'low' | 'critical' | 'out'
    is_active: boolean
    updated_at: string
}

interface Pagination {
    current_page: number
    last_page: number
    per_page: number
    total: number
}

interface Filters {
    status: string
    category_id: string
    search: string
    page: number
    per_page: number
}

interface RestockModal {
    open: boolean
    item: InventoryItem | null
    quantity: number
}

interface AdjustModal {
    open: boolean
    item: InventoryItem | null
    newStock: number
    reason: string
}

// ============================================
// Helpers
// ============================================

const statusConfig = {
    good: { label: 'Good', bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-200' },
    low: { label: 'Low Stock', bg: 'bg-yellow-100', text: 'text-yellow-700', border: 'border-yellow-200' },
    critical: { label: 'Critical', bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-200' },
    out: { label: 'Out of Stock', bg: 'bg-gray-100', text: 'text-gray-600', border: 'border-gray-200' },
}

const getStockBarColor = (status: string) => {
    switch (status) {
        case 'good': return 'bg-green-500'
        case 'low': return 'bg-yellow-500'
        case 'critical': return 'bg-red-500'
        default: return 'bg-gray-400'
    }
}

const getImageUrl = (path: string | null | undefined): string => {
    if (!path) return ''
    if (path.startsWith('http://') || path.startsWith('https://')) return path
    const baseUrl = 'http://localhost:8000'
    return `${baseUrl}${path.startsWith('/') ? path : '/' + path}`
}

// ============================================
// Main Component
// ============================================

const InventoryPage = () => {
    const [stats, setStats] = useState<InventoryStats | null>(null)
    const [items, setItems] = useState<InventoryItem[]>([])
    const [pagination, setPagination] = useState<Pagination>({ current_page: 1, last_page: 1, per_page: 20, total: 0 })
    const [statsLoading, setStatsLoading] = useState(true)
    const [tableLoading, setTableLoading] = useState(true)
    const [filters, setFilters] = useState<Filters>({ status: '', category_id: '', search: '', page: 1, per_page: 20 })
    const [searchInput, setSearchInput] = useState('')

    const [restockModal, setRestockModal] = useState<RestockModal>({ open: false, item: null, quantity: 0 })
    const [adjustModal, setAdjustModal] = useState<AdjustModal>({ open: false, item: null, newStock: 0, reason: '' })
    const [actionLoading, setActionLoading] = useState(false)

    // ── Fetch Stats ──────────────────────────────
    const fetchStats = useCallback(async () => {
        try {
            setStatsLoading(true)
            const res: any = await apiService.get('/admin/inventory/stats')
            const payload = res?.data ?? res
            setStats(payload)
        } catch {
            toast.error('Failed to load inventory stats')
        } finally {
            setStatsLoading(false)
        }
    }, [])

    // ── Fetch Inventory Items ─────────────────────
    const fetchItems = useCallback(async (f: Filters) => {
        try {
            setTableLoading(true)
            const params = new URLSearchParams({
                page: f.page.toString(),
                per_page: f.per_page.toString(),
                ...(f.status && { status: f.status }),
                ...(f.category_id && { category_id: f.category_id }),
                ...(f.search && { search: f.search }),
            })

            const res: any = await apiService.get(`/admin/inventory?${params}`)

            // Support both flat {data:[],current_page} and wrapped {success,data,current_page}
            let rows: InventoryItem[] = []
            let meta = { current_page: 1, last_page: 1, per_page: 20, total: 0 }

            if (Array.isArray(res?.data)) {
                rows = res.data
                meta = { current_page: res.current_page ?? 1, last_page: res.last_page ?? 1, per_page: res.per_page ?? 20, total: res.total ?? 0 }
            } else if (res?.data) {
                rows = Array.isArray(res.data) ? res.data : []
                meta = { current_page: res.current_page ?? 1, last_page: res.last_page ?? 1, per_page: res.per_page ?? 20, total: res.total ?? 0 }
            }

            setItems(rows)
            setPagination(meta)
        } catch {
            toast.error('Failed to load inventory')
            setItems([])
        } finally {
            setTableLoading(false)
        }
    }, [])

    // Initial load
    useEffect(() => {
        fetchStats()
    }, [fetchStats])

    useEffect(() => {
        const t = setTimeout(() => fetchItems(filters), 300)
        return () => clearTimeout(t)
    }, [filters, fetchItems])

    // Search debounce
    useEffect(() => {
        const t = setTimeout(() => setFilters(f => ({ ...f, search: searchInput, page: 1 })), 400)
        return () => clearTimeout(t)
    }, [searchInput])

    // ── Restock ───────────────────────────────────
    const handleRestock = async () => {
        if (!restockModal.item || restockModal.quantity <= 0) return toast.error('Enter a valid quantity')
        try {
            setActionLoading(true)
            await apiService.put(`/admin/inventory/${restockModal.item.id}/restock`, { quantity: restockModal.quantity })
            toast.success(`Restocked ${restockModal.quantity} units for ${restockModal.item.product_name} (${restockModal.item.size})`)
            setRestockModal({ open: false, item: null, quantity: 0 })
            fetchStats()
            fetchItems(filters)
        } catch {
            toast.error('Failed to restock')
        } finally {
            setActionLoading(false)
        }
    }

    // ── Adjust ────────────────────────────────────
    const handleAdjust = async () => {
        if (!adjustModal.item || adjustModal.newStock < 0) return toast.error('Enter a valid stock value')
        try {
            setActionLoading(true)
            await apiService.put(`/admin/inventory/${adjustModal.item.id}/adjust`, { stock: adjustModal.newStock, reason: adjustModal.reason })
            toast.success(`Stock adjusted to ${adjustModal.newStock} units`)
            setAdjustModal({ open: false, item: null, newStock: 0, reason: '' })
            fetchStats()
            fetchItems(filters)
        } catch {
            toast.error('Failed to adjust stock')
        } finally {
            setActionLoading(false)
        }
    }

    // ── Stat cards data ───────────────────────────
    const statCards = [
        {
            label: 'Total Stock Value',
            value: stats?.total_value_formatted ?? 'Rp 0',
            sub: `${stats?.total_skus ?? 0} total SKUs`,
            icon: <BarChart3 className="w-6 h-6" />,
            iconBg: 'bg-gradient-to-br from-gray-900 to-gray-700',
            border: 'border-t-4 border-black',
        },
        {
            label: 'Low Stock',
            value: stats?.low_stock ?? 0,
            sub: 'Needs attention',
            icon: <TrendingDown className="w-6 h-6" />,
            iconBg: 'bg-gradient-to-br from-yellow-500 to-yellow-400',
            border: 'border-t-4 border-yellow-500',
            clickStatus: 'low',
        },
        {
            label: 'Critical Stock',
            value: stats?.critical ?? 0,
            sub: 'Immediate action needed',
            icon: <AlertTriangle className="w-6 h-6" />,
            iconBg: 'bg-gradient-to-br from-red-500 to-red-400',
            border: 'border-t-4 border-red-500',
            clickStatus: 'critical',
        },
        {
            label: 'Out of Stock',
            value: stats?.out_of_stock ?? 0,
            sub: 'Restock required',
            icon: <XCircle className="w-6 h-6" />,
            iconBg: 'bg-gradient-to-br from-gray-500 to-gray-400',
            border: 'border-t-4 border-gray-500',
            clickStatus: 'out',
        },
    ]

    // ── Render ────────────────────────────────────
    return (
        <div className="space-y-6 w-full max-w-full p-6">

            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Inventory Management</h1>
                    <p className="text-sm text-gray-500 mt-1">Monitor stock levels across all products</p>
                </div>
                <button
                    onClick={() => { fetchStats(); fetchItems(filters) }}
                    className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 flex items-center gap-2 transition-all"
                >
                    <RefreshCw className="w-4 h-4" />
                    Refresh
                </button>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                {statCards.map((card) => (
                    <div
                        key={card.label}
                        onClick={() => card.clickStatus && setFilters(f => ({ ...f, status: f.status === card.clickStatus ? '' : card.clickStatus!, page: 1 }))}
                        className={`bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md hover:-translate-y-1 transition-all ${card.border} ${card.clickStatus ? 'cursor-pointer' : ''}`}
                    >
                        <div className="flex items-start justify-between mb-4">
                            <span className="text-sm text-gray-500 font-medium">{card.label}</span>
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white ${card.iconBg}`}>
                                {card.icon}
                            </div>
                        </div>
                        {statsLoading ? (
                            <div className="h-8 bg-gray-100 animate-pulse rounded w-24 mb-2" />
                        ) : (
                            <div className="text-3xl font-bold text-gray-900 mb-2">{card.value}</div>
                        )}
                        <div className="text-sm text-gray-600">{card.sub}</div>
                    </div>
                ))}
            </div>

            {/* Filter Bar */}
            <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
                <div className="flex flex-col sm:flex-row gap-3">
                    {/* Search */}
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by product name or SKU..."
                            value={searchInput}
                            onChange={e => setSearchInput(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black"
                        />
                    </div>

                    {/* Status Filter */}
                    <select
                        value={filters.status}
                        onChange={e => setFilters(f => ({ ...f, status: e.target.value, page: 1 }))}
                        className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black"
                    >
                        <option value="">All Status</option>
                        <option value="good">Good Stock</option>
                        <option value="low">Low Stock</option>
                        <option value="critical">Critical</option>
                        <option value="out">Out of Stock</option>
                    </select>

                    {/* Reset Filters */}
                    {(filters.status || filters.search || searchInput) && (
                        <button
                            onClick={() => { setFilters(f => ({ ...f, status: '', category_id: '', search: '', page: 1 })); setSearchInput('') }}
                            className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 flex items-center gap-2"
                        >
                            <X className="w-4 h-4" />
                            Reset
                        </button>
                    )}
                </div>
            </div>

            {/* Inventory Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                {/* Table Header */}
                <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200 bg-gray-50">
                    <h3 className="text-base font-semibold text-gray-900">
                        Inventory Items
                        <span className="ml-2 text-sm font-normal text-gray-500">({pagination.total} SKUs)</span>
                    </h3>
                    {filters.status && (
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusConfig[filters.status as keyof typeof statusConfig]?.bg} ${statusConfig[filters.status as keyof typeof statusConfig]?.text}`}>
                            Filtered: {statusConfig[filters.status as keyof typeof statusConfig]?.label}
                        </span>
                    )}
                </div>

                {/* Table — overflow scroll on mobile to avoid breaking viewport */}
                <div className="w-full overflow-x-auto">
                    <table className="w-full table-fixed min-w-[900px]">
                        <colgroup>
                            <col className="w-[35%]" />
                            <col className="w-[13%]" />
                            <col className="w-[27%]" />
                            <col className="w-[13%]" />
                            <col className="w-[12%]" />
                        </colgroup>
                        <thead>
                            <tr className="border-b border-gray-200 bg-gray-50">
                                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Product</th>
                                <th className="text-left px-3 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Size</th>
                                <th className="text-left px-3 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Stock</th>
                                <th className="text-left px-3 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {tableLoading ? (
                                <tr>
                                    <td colSpan={5} className="py-16 text-center">
                                        <Loader2 className="w-8 h-8 animate-spin text-gray-400 mx-auto" />
                                        <p className="text-sm text-gray-500 mt-2">Loading inventory...</p>
                                    </td>
                                </tr>
                            ) : items.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="py-16 text-center">
                                        <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                        <p className="text-gray-500 font-medium">No inventory items found</p>
                                        <p className="text-sm text-gray-400 mt-1">Try adjusting your filters</p>
                                    </td>
                                </tr>
                            ) : (
                                items.map(item => {
                                    const sc = statusConfig[item.status]
                                    const maxBar = Math.max(item.stock, 10)
                                    const barPct = Math.min((item.available_stock / maxBar) * 100, 100)

                                    return (
                                        <tr key={item.id} className="hover:bg-gray-50 transition-colors">

                                            {/* Product — image + name + sku + category */}
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-2.5 min-w-0">
                                                    {item.image_url ? (
                                                        <img
                                                            src={getImageUrl(item.image_url)}
                                                            alt={item.product_name}
                                                            className="w-9 h-9 rounded-lg object-cover border border-gray-200 flex-shrink-0"
                                                            onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none' }}
                                                        />
                                                    ) : (
                                                        <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                                                            <Package className="w-4 h-4 text-gray-400" />
                                                        </div>
                                                    )}
                                                    <div className="min-w-0">
                                                        <p className="font-semibold text-gray-900 text-sm truncate">{item.product_name}</p>
                                                        <p className="text-xs text-gray-400 truncate">{item.product_sku} · {item.category_name}</p>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Size */}
                                            <td className="px-3 py-3">
                                                <span className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded text-xs font-semibold">
                                                    {item.size}
                                                </span>
                                            </td>

                                            {/* Stock Level — number + bar */}
                                            <td className="px-3 py-3">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-base font-bold text-gray-900 w-8 flex-shrink-0 text-right">
                                                        {item.available_stock}
                                                    </span>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                                            <div
                                                                className={`h-full rounded-full ${getStockBarColor(item.status)}`}
                                                                style={{ width: `${barPct}%` }}
                                                            />
                                                        </div>
                                                        <p className="text-xs text-gray-400 mt-0.5 truncate">/{item.stock} total</p>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Status */}
                                            <td className="px-3 py-3">
                                                <span className={`px-2 py-0.5 rounded-full text-xs font-semibold whitespace-nowrap ${sc.bg} ${sc.text}`}>
                                                    {sc.label}
                                                </span>
                                            </td>

                                            {/* Actions */}
                                            <td className="px-4 py-3">
                                                <div className="flex gap-1.5 justify-end">
                                                    <button
                                                        onClick={() => setRestockModal({ open: true, item, quantity: 0 })}
                                                        title="Restock"
                                                        className="w-7 h-7 flex items-center justify-center rounded border border-gray-200 hover:bg-green-500 hover:text-white hover:border-green-500 transition-all text-gray-600"
                                                    >
                                                        <Plus className="w-3.5 h-3.5" />
                                                    </button>
                                                    <button
                                                        onClick={() => setAdjustModal({ open: true, item, newStock: item.available_stock, reason: '' })}
                                                        title="Adjust Stock"
                                                        className="w-7 h-7 flex items-center justify-center rounded border border-gray-200 hover:bg-yellow-500 hover:text-white hover:border-yellow-500 transition-all text-gray-600"
                                                    >
                                                        <Minus className="w-3.5 h-3.5" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                })
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {pagination.last_page > 1 && (
                    <div className="flex justify-between items-center px-6 py-4 border-t border-gray-200">
                        <p className="text-sm text-gray-500">
                            Page {pagination.current_page} of {pagination.last_page} · {pagination.total} items
                        </p>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setFilters(f => ({ ...f, page: f.page - 1 }))}
                                disabled={pagination.current_page === 1}
                                className="p-2 rounded-lg border border-gray-200 disabled:opacity-40 hover:bg-gray-50"
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => setFilters(f => ({ ...f, page: f.page + 1 }))}
                                disabled={pagination.current_page === pagination.last_page}
                                className="p-2 rounded-lg border border-gray-200 disabled:opacity-40 hover:bg-gray-50"
                            >
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* ─── Restock Modal ───────────────────────── */}
            {restockModal.open && restockModal.item && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">
                        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
                            <h3 className="text-lg font-semibold">Restock Item</h3>
                            <button onClick={() => setRestockModal({ open: false, item: null, quantity: 0 })} className="text-gray-400 hover:text-gray-700">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="bg-gray-50 rounded-xl p-4 space-y-1">
                                <p className="font-semibold text-gray-900">{restockModal.item.product_name}</p>
                                <p className="text-sm text-gray-500">SKU: {restockModal.item.product_sku} · Size: {restockModal.item.size}</p>
                                <div className="flex gap-4 mt-2 text-sm">
                                    <span className="text-gray-600">Available: <strong>{restockModal.item.available_stock}</strong></span>
                                    <span className="text-gray-600">Total Stock: <strong>{restockModal.item.stock}</strong></span>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Quantity to Add</label>
                                <input
                                    type="number"
                                    min={1}
                                    value={restockModal.quantity || ''}
                                    onChange={e => setRestockModal(m => ({ ...m, quantity: parseInt(e.target.value) || 0 }))}
                                    placeholder="e.g. 30"
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-lg font-semibold"
                                    autoFocus
                                />
                                {restockModal.quantity > 0 && (
                                    <p className="text-xs text-green-600 mt-1">
                                        New total stock will be: <strong>{restockModal.item.stock + restockModal.quantity}</strong>
                                    </p>
                                )}
                            </div>
                        </div>
                        <div className="flex gap-3 px-6 pb-6">
                            <button onClick={() => setRestockModal({ open: false, item: null, quantity: 0 })} className="flex-1 py-2.5 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50">
                                Cancel
                            </button>
                            <button
                                onClick={handleRestock}
                                disabled={actionLoading || restockModal.quantity <= 0}
                                className="flex-1 py-2.5 bg-green-600 text-white rounded-lg text-sm font-semibold hover:bg-green-700 disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {actionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                                Confirm Restock
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ─── Adjust Stock Modal ───────────────────── */}
            {adjustModal.open && adjustModal.item && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">
                        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
                            <h3 className="text-lg font-semibold">Adjust Stock</h3>
                            <button onClick={() => setAdjustModal({ open: false, item: null, newStock: 0, reason: '' })} className="text-gray-400 hover:text-gray-700">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="bg-gray-50 rounded-xl p-4 space-y-1">
                                <p className="font-semibold text-gray-900">{adjustModal.item.product_name}</p>
                                <p className="text-sm text-gray-500">SKU: {adjustModal.item.product_sku} · Size: {adjustModal.item.size}</p>
                                <p className="text-sm text-gray-600 mt-1">Current stock: <strong>{adjustModal.item.stock}</strong></p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">New Stock Value</label>
                                <input
                                    type="number"
                                    min={0}
                                    value={adjustModal.newStock}
                                    onChange={e => setAdjustModal(m => ({ ...m, newStock: parseInt(e.target.value) || 0 }))}
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-lg font-semibold"
                                    autoFocus
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Reason (optional)</label>
                                <input
                                    type="text"
                                    value={adjustModal.reason}
                                    onChange={e => setAdjustModal(m => ({ ...m, reason: e.target.value }))}
                                    placeholder="e.g. Physical count, Damaged goods..."
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-sm"
                                />
                            </div>
                        </div>
                        <div className="flex gap-3 px-6 pb-6">
                            <button onClick={() => setAdjustModal({ open: false, item: null, newStock: 0, reason: '' })} className="flex-1 py-2.5 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50">
                                Cancel
                            </button>
                            <button
                                onClick={handleAdjust}
                                disabled={actionLoading}
                                className="flex-1 py-2.5 bg-yellow-500 text-white rounded-lg text-sm font-semibold hover:bg-yellow-600 disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {actionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                                Save Adjustment
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default InventoryPage
