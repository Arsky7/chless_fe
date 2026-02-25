// pages/admin/categories/CategoriesPage.tsx
import { useState, useEffect, useCallback } from 'react'
import { toast } from 'react-hot-toast'
import { apiService } from '../../../services/api'
import {
    Tags,
    CheckCircle,
    XCircle,
    AlertTriangle,
    Loader2,
    Plus,
    Pencil,
    Trash2,
    X,
    Package,
    RefreshCw,
    Search,
    ToggleLeft,
    ToggleRight,
} from 'lucide-react'

// ============================================
// Types
// ============================================

interface CategoryStats {
    total: number
    active: number
    inactive: number
    empty: number
}

interface Category {
    id: number
    name: string
    slug: string
    description: string | null
    is_active: boolean
    sort_order: number
    product_count: number
    created_at: string
    updated_at: string
}

interface CategoryForm {
    name: string
    description: string
    is_active: boolean
    sort_order: number
}

const emptyForm: CategoryForm = { name: '', description: '', is_active: true, sort_order: 1 }

// ============================================
// Main Component
// ============================================

const CategoriesPage = () => {
    const [stats, setStats] = useState<CategoryStats | null>(null)
    const [categories, setCategories] = useState<Category[]>([])
    const [filtered, setFiltered] = useState<Category[]>([])
    const [statsLoading, setStatsLoading] = useState(true)
    const [listLoading, setListLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [statusFilter, setStatusFilter] = useState<'' | 'active' | 'inactive' | 'empty'>('')

    // Modal state
    const [modal, setModal] = useState<{ open: boolean; editing: Category | null }>({ open: false, editing: null })
    const [form, setForm] = useState<CategoryForm>(emptyForm)
    const [formLoading, setFormLoading] = useState(false)

    // Delete confirm
    const [deleteConfirm, setDeleteConfirm] = useState<Category | null>(null)
    const [deleteLoading, setDeleteLoading] = useState(false)

    // ── Fetch Stats ─────────────────────────────
    const fetchStats = useCallback(async () => {
        try {
            setStatsLoading(true)
            const res: any = await apiService.get('/admin/categories/stats')
            setStats(res?.data ?? res)
        } catch {
            toast.error('Failed to load category stats')
        } finally {
            setStatsLoading(false)
        }
    }, [])

    // ── Fetch Categories ─────────────────────────
    const fetchCategories = useCallback(async () => {
        try {
            setListLoading(true)
            const res: any = await apiService.get('/admin/categories')
            const rows: Category[] = Array.isArray(res?.data) ? res.data : []
            setCategories(rows)
        } catch {
            toast.error('Failed to load categories')
            setCategories([])
        } finally {
            setListLoading(false)
        }
    }, [])

    useEffect(() => { fetchStats(); fetchCategories() }, [fetchStats, fetchCategories])

    // ── Filter ────────────────────────────────────
    useEffect(() => {
        let rows = [...categories]
        if (search) rows = rows.filter(c => c.name.toLowerCase().includes(search.toLowerCase()) || c.slug.includes(search.toLowerCase()))
        if (statusFilter === 'active') rows = rows.filter(c => c.is_active)
        if (statusFilter === 'inactive') rows = rows.filter(c => !c.is_active)
        if (statusFilter === 'empty') rows = rows.filter(c => c.product_count === 0)
        setFiltered(rows)
    }, [categories, search, statusFilter])

    // ── Open modal ───────────────────────────────
    const openCreate = () => { setForm(emptyForm); setModal({ open: true, editing: null }) }
    const openEdit = (cat: Category) => {
        setForm({ name: cat.name, description: cat.description ?? '', is_active: cat.is_active, sort_order: cat.sort_order })
        setModal({ open: true, editing: cat })
    }
    const closeModal = () => setModal({ open: false, editing: null })

    // ── Save (create or update) ──────────────────
    const handleSave = async () => {
        if (!form.name.trim()) return toast.error('Category name is required')
        try {
            setFormLoading(true)
            if (modal.editing) {
                await apiService.put(`/admin/categories/${modal.editing.id}`, form)
                toast.success('Category updated!')
            } else {
                await apiService.post('/admin/categories', form)
                toast.success('Category created!')
            }
            closeModal()
            fetchStats()
            fetchCategories()
        } catch (err: any) {
            const msg = err?.response?.data?.message ?? 'Failed to save category'
            toast.error(msg)
        } finally {
            setFormLoading(false)
        }
    }

    // ── Toggle active ────────────────────────────
    const handleToggle = async (cat: Category) => {
        try {
            await apiService.put(`/admin/categories/${cat.id}`, { is_active: !cat.is_active })
            toast.success(`Category ${!cat.is_active ? 'activated' : 'deactivated'}`)
            fetchStats()
            fetchCategories()
        } catch {
            toast.error('Failed to toggle status')
        }
    }

    // ── Delete ────────────────────────────────────
    const handleDelete = async () => {
        if (!deleteConfirm) return
        try {
            setDeleteLoading(true)
            await apiService.delete(`/admin/categories/${deleteConfirm.id}`)
            toast.success('Category deleted')
            setDeleteConfirm(null)
            fetchStats()
            fetchCategories()
        } catch (err: any) {
            const msg = err?.response?.data?.message ?? 'Failed to delete'
            toast.error(msg)
        } finally {
            setDeleteLoading(false)
        }
    }

    // ── Stat cards ───────────────────────────────
    const statCards = [
        { label: 'Total Categories', value: stats?.total ?? 0, icon: <Tags className="w-5 h-5" />, iconBg: 'bg-gray-900', border: 'border-t-4 border-gray-900', filter: '' as const },
        { label: 'Active', value: stats?.active ?? 0, icon: <CheckCircle className="w-5 h-5" />, iconBg: 'bg-green-500', border: 'border-t-4 border-green-500', filter: 'active' as const },
        { label: 'Empty (No Products)', value: stats?.empty ?? 0, icon: <AlertTriangle className="w-5 h-5" />, iconBg: 'bg-yellow-500', border: 'border-t-4 border-yellow-500', filter: 'empty' as const },
        { label: 'Inactive', value: stats?.inactive ?? 0, icon: <XCircle className="w-5 h-5" />, iconBg: 'bg-red-500', border: 'border-t-4 border-red-500', filter: 'inactive' as const },
    ]

    // ── Render ────────────────────────────────────
    return (
        <div className="space-y-6 p-6 w-full max-w-full">

            {/* Header */}
            <div className="flex flex-wrap justify-between items-center gap-3">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Categories Management</h1>
                    <p className="text-sm text-gray-500 mt-1">Organize your fashion products into categories</p>
                </div>
                <div className="flex gap-2">
                    <button onClick={() => { fetchStats(); fetchCategories() }} className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2 text-sm">
                        <RefreshCw className="w-4 h-4" /> Refresh
                    </button>
                    <button onClick={openCreate} className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 flex items-center gap-2 text-sm font-medium transition-all">
                        <Plus className="w-4 h-4" /> Add Category
                    </button>
                </div>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {statCards.map(card => (
                    <div
                        key={card.label}
                        onClick={() => setStatusFilter(f => f === card.filter ? '' : card.filter)}
                        className={`bg-white rounded-xl p-5 shadow-sm border border-gray-200 hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer ${card.border} ${statusFilter === card.filter ? 'ring-2 ring-offset-1 ring-gray-400' : ''}`}
                    >
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-xs font-medium text-gray-500 leading-tight">{card.label}</span>
                            <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-white flex-shrink-0 ${card.iconBg}`}>
                                {card.icon}
                            </div>
                        </div>
                        {statsLoading
                            ? <div className="h-7 bg-gray-100 animate-pulse rounded w-14" />
                            : <div className="text-3xl font-bold text-gray-900">{card.value}</div>
                        }
                    </div>
                ))}
            </div>

            {/* Filter Bar */}
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search categories..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black"
                        />
                    </div>
                    <select
                        value={statusFilter}
                        onChange={e => setStatusFilter(e.target.value as any)}
                        className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black"
                    >
                        <option value="">All Status</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                        <option value="empty">Empty (no products)</option>
                    </select>
                    {(search || statusFilter) && (
                        <button onClick={() => { setSearch(''); setStatusFilter('') }} className="px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 flex items-center gap-1.5">
                            <X className="w-4 h-4" /> Reset
                        </button>
                    )}
                </div>
            </div>

            {/* Categories Grid */}
            <div>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-base font-semibold text-gray-900">
                        All Categories
                        <span className="ml-2 text-sm font-normal text-gray-400">({filtered.length} categories)</span>
                    </h2>
                </div>

                {listLoading ? (
                    <div className="bg-white rounded-xl p-16 text-center shadow-sm border border-gray-200">
                        <Loader2 className="w-8 h-8 animate-spin text-gray-400 mx-auto" />
                        <p className="text-sm text-gray-500 mt-2">Loading categories...</p>
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="bg-white rounded-xl p-16 text-center shadow-sm border border-gray-200">
                        <Tags className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500 font-medium">No categories found</p>
                        <p className="text-sm text-gray-400 mt-1">Try adjusting your filters or add a new category</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                        {filtered.map(cat => (
                            <div key={cat.id} className={`bg-white rounded-xl border shadow-sm overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all ${cat.is_active ? 'border-gray-200' : 'border-red-100'}`}>
                                {/* Card Header */}
                                <div className={`px-5 py-4 border-b flex items-center justify-between gap-3 ${cat.is_active ? 'border-gray-100' : 'border-red-100 bg-red-50/40'}`}>
                                    <div className="flex items-center gap-3 min-w-0">
                                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${cat.is_active ? 'bg-gray-100 text-gray-700' : 'bg-red-100 text-red-500'}`}>
                                            <Tags className="w-5 h-5" />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="font-bold text-gray-900 text-sm truncate">{cat.name}</p>
                                            <p className="text-xs text-gray-400 font-mono truncate">/{cat.slug}</p>
                                        </div>
                                    </div>
                                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold flex-shrink-0 ${cat.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                        {cat.is_active ? 'Active' : 'Inactive'}
                                    </span>
                                </div>

                                {/* Stats */}
                                <div className="px-5 py-3 border-b border-gray-100 space-y-1.5">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">Products</span>
                                        <span className="font-semibold text-gray-900 flex items-center gap-1">
                                            <Package className="w-3.5 h-3.5 text-gray-400" />
                                            {cat.product_count}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">Sort Order</span>
                                        <span className="font-semibold text-gray-900">{cat.sort_order}</span>
                                    </div>
                                    {cat.description && (
                                        <p className="text-xs text-gray-400 pt-1 leading-relaxed line-clamp-2">{cat.description}</p>
                                    )}
                                </div>

                                {/* Actions */}
                                <div className="px-5 py-3 flex items-center gap-2">
                                    <button
                                        onClick={() => openEdit(cat)}
                                        className="flex-1 py-1.5 border border-gray-200 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 hover:bg-yellow-500 hover:text-white hover:border-yellow-500 transition-all"
                                    >
                                        <Pencil className="w-3.5 h-3.5" /> Edit
                                    </button>
                                    <button
                                        onClick={() => handleToggle(cat)}
                                        title={cat.is_active ? 'Deactivate' : 'Activate'}
                                        className={`w-8 h-8 border rounded-lg flex items-center justify-center transition-all hover:text-white ${cat.is_active ? 'border-gray-200 text-gray-500 hover:bg-gray-500 hover:border-gray-500' : 'border-green-200 text-green-600 hover:bg-green-500 hover:border-green-500'}`}
                                    >
                                        {cat.is_active ? <ToggleLeft className="w-4 h-4" /> : <ToggleRight className="w-4 h-4" />}
                                    </button>
                                    <button
                                        onClick={() => setDeleteConfirm(cat)}
                                        title="Delete"
                                        className="w-8 h-8 border border-gray-200 text-gray-500 rounded-lg flex items-center justify-center hover:bg-red-500 hover:text-white hover:border-red-500 transition-all"
                                    >
                                        <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* ── Add / Edit Modal ────────────────────── */}
            {modal.open && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">
                        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
                            <h3 className="text-lg font-semibold">{modal.editing ? 'Edit Category' : 'Add New Category'}</h3>
                            <button onClick={closeModal} className="text-gray-400 hover:text-gray-700"><X className="w-5 h-5" /></button>
                        </div>

                        <div className="p-6 space-y-4">
                            {/* Name */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Category Name <span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    value={form.name}
                                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                                    placeholder="e.g. T-Shirts, Hoodies"
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black"
                                    autoFocus
                                />
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <textarea
                                    value={form.description}
                                    onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                                    placeholder="Brief description of this category..."
                                    rows={3}
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black resize-none"
                                />
                            </div>

                            {/* Sort Order + Status */}
                            <div className="flex gap-4">
                                <div className="flex-1">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Sort Order</label>
                                    <input
                                        type="number"
                                        min={0}
                                        value={form.sort_order}
                                        onChange={e => setForm(f => ({ ...f, sort_order: parseInt(e.target.value) || 0 }))}
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black"
                                    />
                                </div>
                                <div className="flex-1">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                    <select
                                        value={form.is_active ? 'active' : 'inactive'}
                                        onChange={e => setForm(f => ({ ...f, is_active: e.target.value === 'active' }))}
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black"
                                    >
                                        <option value="active">Active</option>
                                        <option value="inactive">Inactive</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-3 px-6 pb-6">
                            <button onClick={closeModal} className="flex-1 py-2.5 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50">
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={formLoading}
                                className="flex-1 py-2.5 bg-black text-white rounded-lg text-sm font-semibold hover:bg-gray-800 disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {formLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                                {modal.editing ? 'Update' : 'Create'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Delete Confirm Modal ─────────────────── */}
            {deleteConfirm && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl p-6">
                        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Trash2 className="w-6 h-6 text-red-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-center mb-1">Delete Category</h3>
                        <p className="text-sm text-gray-500 text-center mb-1">
                            Are you sure you want to delete <strong>"{deleteConfirm.name}"</strong>?
                        </p>
                        {deleteConfirm.product_count > 0 && (
                            <p className="text-xs text-red-600 bg-red-50 rounded-lg p-2 text-center mt-2">
                                ⚠️ This category has {deleteConfirm.product_count} product(s). Please move them first.
                            </p>
                        )}
                        <div className="flex gap-3 mt-5">
                            <button onClick={() => setDeleteConfirm(null)} className="flex-1 py-2.5 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50">
                                Cancel
                            </button>
                            <button
                                onClick={handleDelete}
                                disabled={deleteLoading || deleteConfirm.product_count > 0}
                                className="flex-1 py-2.5 bg-red-600 text-white rounded-lg text-sm font-semibold hover:bg-red-700 disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {deleteLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default CategoriesPage
