// pages/admin/customers/CustomersPage.tsx
import { useState, useEffect, useCallback, useRef } from 'react'
import { toast } from 'react-hot-toast'
import { apiService, API_ENDPOINTS } from '../../../services/api'
import {
    Users,
    UserPlus,
    Crown,
    Search,
    RefreshCw,
    ChevronLeft,
    ChevronRight,
    X,
    Eye,
    ToggleLeft,
    ToggleRight,
    Download,
    MailPlus,
    Plus,
    Edit,
    Trash2,
    Lock,
} from 'lucide-react'

// ============================================
// Types
// ============================================

interface CustomerStats {
    total: number
    active: number
    inactive: number
    new_this_month: number
    loyal: number
}

interface Customer {
    id: number
    name: string
    email: string
    phone: string | null
    address: string | null
    is_active: boolean
    avatar_url: string
    initials: string
    customer_type: 'new' | 'active' | 'loyal' | 'inactive'
    order_count: number
    total_spent: number
    last_order_at: string | null
    joined_at: string
}

interface Pagination {
    current_page: number
    last_page: number
    per_page: number
    total: number
}

interface Filters {
    search: string
    type: string
    page: number
}

// ============================================
// Helpers
// ============================================

const typeConfig: Record<string, { label: string; bg: string; text: string }> = {
    new: { label: 'New', bg: 'bg-blue-100', text: 'text-blue-700' },
    active: { label: 'Active', bg: 'bg-green-100', text: 'text-green-700' },
    loyal: { label: 'Loyal', bg: 'bg-purple-100', text: 'text-purple-700' },
    inactive: { label: 'Inactive', bg: 'bg-orange-100', text: 'text-orange-700' },
}

const typeAvatarBg: Record<string, string> = {
    new: 'from-blue-400 to-blue-500',
    active: 'from-green-400 to-green-500',
    loyal: 'from-purple-400 to-purple-500',
    inactive: 'from-orange-400 to-orange-500',
}

function formatRp(v: number) {
    return 'Rp ' + Math.round(v).toLocaleString('id-ID')
}

function daysSince(dateStr: string | null) {
    if (!dateStr) return '—'
    const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 86400000)
    if (diff === 0) return 'Today'
    if (diff === 1) return 'Yesterday'
    if (diff > 90) return '3+ months ago'
    return `${diff}d ago`
}

// ============================================
// Main Component
// ============================================

const CustomersPage = () => {
    const [stats, setStats] = useState<CustomerStats | null>(null)
    const [customers, setCust] = useState<Customer[]>([])
    const [pagination, setPagination] = useState<Pagination>({ current_page: 1, last_page: 1, per_page: 15, total: 0 })
    const [statsLoading, setStatsLoading] = useState(true)
    const [tableLoading, setTableLoading] = useState(true)
    const [filters, setFilters] = useState<Filters>({ search: '', type: '', page: 1 })
    const [pendingSearch, setPendingSearch] = useState('')
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

    // Detail modal
    const [detail, setDetail] = useState<Customer | null>(null)

    // Form Modal (Add/Edit)
    const [showForm, setShowForm] = useState(false)
    const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null)
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        phone: '',
        address: '',
    })
    const [formLoading, setFormLoading] = useState(false)

    // ── Fetch Stats ─────────────────────────────
    const fetchStats = useCallback(async () => {
        try {
            setStatsLoading(true)
            const res: any = await apiService.get(API_ENDPOINTS.CUSTOMERS.STATS)
            setStats(res?.data || res)
        } catch {
            toast.error('Failed to load stats')
        } finally {
            setStatsLoading(false)
        }
    }, [])

    // ── Fetch Customers List ─────────────────────
    const fetchCustomers = useCallback(async (f: Filters) => {
        try {
            setTableLoading(true)
            const res: any = await apiService.get(API_ENDPOINTS.CUSTOMERS.INDEX, {
                search: f.search,
                type: f.type,
                page: f.page,
                per_page: 15
            })
            const rows: Customer[] = Array.isArray(res?.data) ? res.data : []
            setCust(rows)
            setPagination({
                current_page: res.current_page ?? 1,
                last_page: res.last_page ?? 1,
                per_page: res.per_page ?? 15,
                total: res.total ?? 0,
            })
        } catch {
            toast.error('Failed to load customers')
            setCust([])
        } finally {
            setTableLoading(false)
        }
    }, [])

    useEffect(() => { fetchStats() }, [fetchStats])
    useEffect(() => { fetchCustomers(filters) }, [fetchCustomers, filters])

    // ── Debounced search ──────────────────────────
    const handleSearchChange = (v: string) => {
        setPendingSearch(v)
        if (debounceRef.current) clearTimeout(debounceRef.current)
        debounceRef.current = setTimeout(() => {
            setFilters(f => ({ ...f, search: v, page: 1 }))
        }, 450)
    }

    // ── Filter helpers ────────────────────────────
    const setTypeFilter = (type: string) => setFilters(f => ({ ...f, type: f.type === type ? '' : type, page: 1 }))
    const resetFilters = () => { setPendingSearch(''); setFilters({ search: '', type: '', page: 1 }) }
    const goPage = (p: number) => setFilters(f => ({ ...f, page: p }))

    // ── Open Form ──────────────────────────────
    const openForm = (c: Customer | null = null) => {
        if (c) {
            setEditingCustomer(c)
            setFormData({
                name: c.name,
                email: c.email,
                password: '',
                phone: c.phone || '',
                address: c.address || '',
            })
        } else {
            setEditingCustomer(null)
            setFormData({ name: '', email: '', password: '', phone: '', address: '' })
        }
        setShowForm(true)
    }

    // ── Submit Form ────────────────────────────
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            setFormLoading(true)
            if (editingCustomer) {
                await apiService.put(API_ENDPOINTS.CUSTOMERS.DETAIL(editingCustomer.id), formData)
                toast.success('Customer updated')
            } else {
                if (!formData.password) {
                    toast.error('Password is required')
                    return
                }
                await apiService.post(API_ENDPOINTS.CUSTOMERS.INDEX, formData)
                toast.success('Customer added')
            }
            setShowForm(false)
            fetchStats()
            fetchCustomers(filters)
        } catch (err: any) {
            toast.error(err?.response?.data?.message || 'Failed to save customer')
        } finally {
            setFormLoading(false)
        }
    }

    // ── Delete Customer ─────────────────────────
    const handleDelete = async (c: Customer) => {
        if (!confirm(`Are you sure you want to delete ${c.name}?`)) return
        try {
            await apiService.delete(API_ENDPOINTS.CUSTOMERS.DETAIL(c.id))
            toast.success('Customer deleted')
            fetchStats()
            fetchCustomers(filters)
        } catch {
            toast.error('Failed to delete customer')
        }
    }

    // ── Handle Toggle ───────────────────────────
    const handleToggle = async (c: Customer) => {
        try {
            await apiService.patch(API_ENDPOINTS.CUSTOMERS.TOGGLE_ACTIVE(c.id))
            toast.success(c.is_active ? 'Customer deactivated' : 'Customer activated')
            fetchStats()
            fetchCustomers(filters)
        } catch {
            toast.error('Failed to toggle status')
        }
    }

    // ── Export CSV ──────────────────────────────
    const exportCSV = () => {
        toast.success('Exporting customers...')
    }

    // ── Bulk Email ──────────────────────────────
    const sendBulkEmail = () => {
        toast('Bulk Email feature coming soon!', { icon: '📧' })
    }

    return (
        <div className="space-y-6 p-6 w-full max-w-full">
            {/* Header */}
            <div className="flex flex-wrap justify-between items-center gap-3">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Customer Management</h1>
                    <p className="text-sm text-gray-500 mt-1">Manage your customer database and insights</p>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={sendBulkEmail}
                        className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2 text-sm"
                    >
                        <MailPlus className="w-4 h-4" /> Bulk Email
                    </button>
                    <button
                        onClick={() => openForm()}
                        className="px-3 py-2 bg-black text-white rounded-lg hover:bg-red-600 flex items-center gap-2 text-sm transition-colors"
                    >
                        <Plus className="w-4 h-4" /> Add Customer
                    </button>
                    <button
                        onClick={() => { fetchStats(); fetchCustomers(filters) }}
                        className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center justify-center text-sm"
                        title="Refresh"
                    >
                        <RefreshCw className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Segmentation Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div
                    onClick={() => setTypeFilter('new')}
                    className={`p-6 rounded-xl border border-blue-200 bg-blue-50 hover:shadow-md transition-all cursor-pointer ${filters.type === 'new' ? 'ring-2 ring-blue-500' : ''}`}
                >
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-lg bg-blue-500 flex items-center justify-center text-white shadow-sm">
                            <UserPlus className="w-6 h-6" />
                        </div>
                        <h3 className="font-bold text-blue-900">New Customers</h3>
                    </div>
                    <div className="text-4xl font-extrabold text-blue-900 mb-2">
                        {statsLoading ? <div className="h-10 w-16 bg-blue-200 rounded animate-pulse"></div> : (stats?.new_this_month ?? 0)}
                    </div>
                    <p className="text-sm text-blue-700/80 leading-relaxed">Registered within last 30 days. High potential for conversion.</p>
                </div>

                <div
                    onClick={() => setTypeFilter('loyal')}
                    className={`p-6 rounded-xl border border-purple-200 bg-purple-50 hover:shadow-md transition-all cursor-pointer ${filters.type === 'loyal' ? 'ring-2 ring-purple-500' : ''}`}
                >
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-lg bg-purple-500 flex items-center justify-center text-white shadow-sm">
                            <Crown className="w-6 h-6" />
                        </div>
                        <h3 className="font-bold text-purple-900">Loyal Customers</h3>
                    </div>
                    <div className="text-4xl font-extrabold text-purple-900 mb-2">
                        {statsLoading ? <div className="h-10 w-16 bg-purple-200 rounded animate-pulse"></div> : (stats?.loyal ?? 0)}
                    </div>
                    <p className="text-sm text-purple-700/80 leading-relaxed">5+ orders or high spending. High retention rate.</p>
                </div>

                <div
                    onClick={() => setTypeFilter('inactive')}
                    className={`p-6 rounded-xl border border-orange-200 bg-orange-50 hover:shadow-md transition-all cursor-pointer ${filters.type === 'inactive' ? 'ring-2 ring-orange-500' : ''}`}
                >
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-lg bg-orange-500 flex items-center justify-center text-white shadow-sm">
                            <Lock className="w-6 h-6" />
                        </div>
                        <h3 className="font-bold text-orange-900">Inactive Customers</h3>
                    </div>
                    <div className="text-4xl font-extrabold text-orange-900 mb-2">
                        {statsLoading ? <div className="h-10 w-16 bg-orange-200 rounded animate-pulse"></div> : (stats?.inactive ?? 0)}
                    </div>
                    <p className="text-sm text-orange-700/80 leading-relaxed">No active status. Consider re-engagement campaigns.</p>
                </div>
            </div>

            {/* Filter Bar */}
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by name, email, or phone..."
                            value={pendingSearch}
                            onChange={e => handleSearchChange(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <select
                            value={filters.type}
                            onChange={e => setFilters(f => ({ ...f, type: e.target.value, page: 1 }))}
                            className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black"
                        >
                            <option value="">All Types</option>
                            <option value="new">New (≤30 days)</option>
                            <option value="active">Active</option>
                            <option value="loyal">Loyal (5+ orders)</option>
                            <option value="inactive">Inactive</option>
                        </select>
                        <button
                            onClick={exportCSV}
                            className="px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 flex items-center gap-2 whitespace-nowrap"
                        >
                            <Download className="w-4 h-4" /> Export CSV
                        </button>
                        {(pendingSearch || filters.type) && (
                            <button onClick={resetFilters} className="px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 flex items-center gap-1.5">
                                <X className="w-4 h-4" /> Reset
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Customers Table Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 bg-gray-50">
                    <h2 className="text-sm font-semibold text-gray-700">
                        Customers
                        {!tableLoading && <span className="ml-2 text-gray-400 font-normal">({pagination.total.toLocaleString()})</span>}
                    </h2>
                </div>

                <div className="w-full overflow-x-auto">
                    <table className="w-full table-fixed min-w-[800px]">
                        <colgroup>
                            <col className="w-[35%]" />
                            <col className="w-[12%]" />
                            <col className="w-[18%]" />
                            <col className="w-[18%]" />
                            <col className="w-[17%]" />
                        </colgroup>
                        <thead>
                            <tr className="border-b border-gray-200 bg-gray-50">
                                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Customer</th>
                                <th className="text-left px-3 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Type</th>
                                <th className="text-left px-3 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Orders</th>
                                <th className="text-left px-3 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Spent</th>
                                <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {tableLoading ? (
                                Array.from({ length: 5 }).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td className="px-4 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 bg-gray-200 rounded-full"></div>
                                                <div className="space-y-2 flex-1">
                                                    <div className="h-4 bg-gray-200 rounded w-24"></div>
                                                    <div className="h-3 bg-gray-100 rounded w-32"></div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-3 py-4"><div className="h-5 bg-gray-100 rounded-full w-16"></div></td>
                                        <td className="px-3 py-4"><div className="h-4 bg-gray-100 rounded w-8"></div></td>
                                        <td className="px-3 py-4"><div className="h-4 bg-gray-100 rounded w-20"></div></td>
                                        <td className="px-4 py-4"><div className="h-7 bg-gray-100 rounded w-full"></div></td>
                                    </tr>
                                ))
                            ) : customers.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="py-16 text-center">
                                        <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                        <p className="text-gray-500 font-medium">No customers found</p>
                                        <p className="text-sm text-gray-400 mt-1">Try adjusting your filters</p>
                                    </td>
                                </tr>
                            ) : (
                                customers.map(c => {
                                    const tc = typeConfig[c.customer_type] ?? typeConfig.active
                                    return (
                                        <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-4 py-3 text-sm truncate">
                                                <div className="flex items-center gap-2.5">
                                                    <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${typeAvatarBg[c.customer_type] ?? 'from-gray-400 to-gray-500'} flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}>
                                                        {c.initials.slice(0, 2)}
                                                    </div>
                                                    <div className="truncate">
                                                        <div className="flex items-center gap-1">
                                                            <p className="font-semibold text-gray-900 truncate">{c.name}</p>
                                                            {c.customer_type === 'loyal' && <Crown className="w-3 h-3 text-purple-500 flex-shrink-0" />}
                                                        </div>
                                                        <p className="text-xs text-gray-400 truncate">{c.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-3 py-3">
                                                <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${tc.bg} ${tc.text}`}>
                                                    {tc.label}
                                                </span>
                                            </td>
                                            <td className="px-3 py-3">
                                                <p className="text-sm font-bold text-gray-900">{c.order_count}</p>
                                                <p className="text-xs text-gray-400 truncate">{c.last_order_at ? daysSince(c.last_order_at) : 'No orders'}</p>
                                            </td>
                                            <td className="px-3 py-3">
                                                <p className="text-sm font-bold text-gray-900 truncate">{formatRp(c.total_spent)}</p>
                                                <p className="text-xs text-gray-400">joined {c.joined_at}</p>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex gap-1.5 justify-end">
                                                    <button onClick={() => setDetail(c)} title="View Detail" className="w-7 h-7 flex items-center justify-center rounded border border-gray-200 hover:bg-blue-500 hover:text-white transition-colors text-gray-600">
                                                        <Eye className="w-3.5 h-3.5" />
                                                    </button>
                                                    <button onClick={() => openForm(c)} title="Edit Customer" className="w-7 h-7 flex items-center justify-center rounded border border-gray-200 hover:bg-amber-500 hover:text-white transition-colors text-gray-600">
                                                        <Edit className="w-3.5 h-3.5" />
                                                    </button>
                                                    <button onClick={() => handleToggle(c)} title={c.is_active ? 'Deactivate' : 'Activate'} className={`w-7 h-7 flex items-center justify-center rounded border transition-colors ${c.is_active ? 'border-gray-200 text-gray-600 hover:bg-gray-500 hover:text-white' : 'border-green-200 text-green-600 hover:bg-green-500 hover:text-white'}`}>
                                                        {c.is_active ? <ToggleLeft className="w-4 h-4" /> : <ToggleRight className="w-4 h-4" />}
                                                    </button>
                                                    <button onClick={() => handleDelete(c)} title="Delete" className="w-7 h-7 flex items-center justify-center rounded border border-gray-200 hover:bg-red-500 hover:text-white transition-colors text-gray-600">
                                                        <Trash2 className="w-3.5 h-3.5" />
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
                {!tableLoading && pagination.last_page > 1 && (
                    <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100 bg-gray-50">
                        <p className="text-xs text-gray-500">
                            Page {pagination.current_page} of {pagination.last_page} · {pagination.total.toLocaleString()} customers
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
            {detail && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl">
                        <div className="flex justify-between items-center px-6 py-4 border-b">
                            <h3 className="font-bold">Customer Detail</h3>
                            <button onClick={() => setDetail(null)} className="text-gray-400 hover:text-gray-900"><X className="w-5 h-5" /></button>
                        </div>
                        <div className="p-6 flex flex-col items-center">
                            <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${typeAvatarBg[detail.customer_type]} flex items-center justify-center text-white font-bold text-2xl mb-4`}>
                                {detail.initials}
                            </div>
                            <h4 className="text-lg font-bold">{detail.name}</h4>
                            <p className="text-sm text-gray-500 mb-4">{detail.email}</p>
                            <div className="w-full space-y-2">
                                <div className="flex justify-between text-sm"><span className="text-gray-400">Status</span><span className={`font-semibold ${typeConfig[detail.customer_type].text}`}>{typeConfig[detail.customer_type].label}</span></div>
                                <div className="flex justify-between text-sm"><span className="text-gray-400">Phone</span><span className="font-semibold">{detail.phone || '-'}</span></div>
                                <div className="flex justify-between text-sm"><span className="text-gray-400">Address</span><span className="font-semibold">{detail.address || '-'}</span></div>
                                <div className="flex justify-between text-sm"><span className="text-gray-400">Joined</span><span className="font-semibold">{detail.joined_at}</span></div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Add/Edit Modal */}
            {showForm && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
                        <div className="flex justify-between items-center px-6 py-5 border-b bg-gray-50">
                            <h3 className="text-lg font-bold">{editingCustomer ? 'Edit Customer' : 'Add New Customer'}</h3>
                            <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-700"><X className="w-5 h-5" /></button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <input required type="text" placeholder="Name" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full p-2.5 bg-gray-50 border rounded-lg focus:ring-1 focus:ring-black outline-none" />
                            <input required type="email" placeholder="Email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} className="w-full p-2.5 bg-gray-50 border rounded-lg focus:ring-1 focus:ring-black outline-none" />
                            <input required={!editingCustomer} type="password" placeholder="Password" value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} className="w-full p-2.5 bg-gray-50 border rounded-lg focus:ring-1 focus:ring-black outline-none" />
                            <input type="text" placeholder="Phone" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} className="w-full p-2.5 bg-gray-50 border rounded-lg focus:ring-1 focus:ring-black outline-none" />
                            <textarea placeholder="Address" value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })} className="w-full p-2.5 bg-gray-50 border rounded-lg focus:ring-1 focus:ring-black outline-none resize-none" rows={2} />
                            <div className="flex gap-3 pt-2">
                                <button type="button" onClick={() => setShowForm(false)} className="flex-1 py-2.5 border rounded-lg font-bold hover:bg-gray-50">Cancel</button>
                                <button type="submit" disabled={formLoading} className="flex-1 py-2.5 bg-black text-white rounded-lg font-bold hover:bg-gray-900 disabled:opacity-50">
                                    {formLoading ? 'Saving...' : (editingCustomer ? 'Update' : 'Create')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}

export default CustomersPage;
