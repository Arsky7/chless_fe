// pages/admin/products/ProductList.tsx
import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { apiService } from '../../../services/api'
import {
  Package,
  AlertTriangle,
  Loader2,
  Plus,
  Grid,
  List,
  Edit3,
  Eye,
  Trash2,
  Star,
  CheckCircle,
  XCircle,
  Shirt,
  ShoppingBag,
  Watch,
  Footprints,
} from 'lucide-react'

// ============================================
// Types
// ============================================

interface DashboardStats {
  sales: {
    today: number
    yesterday: number
    today_formatted: string
    weekly: Array<{
      date: string
      total: number
    }>
  }
  orders: {
    today: number
    yesterday: number
    total: number
    pending: number
    processing: number
    shipped: number
    delivered: number
    cancelled: number
  }
  customers: {
    today: number
    yesterday: number
    total: number
  }
  products: {
    today: number
    yesterday: number
    total: number
    active: number
    low_stock: number
    out_of_stock: number
    active_percentage: number
  }
  top_products: Array<{
    id: number
    name: string
    price: number
    price_formatted: string
    sold_count: number
  }>
  recent_orders: Array<{
    id: number
    order_number: string
    customer_name: string
    total: number
    total_formatted: string
    status: string
    status_label: string
    created_at: string
  }>
}

interface Product {
  id: number
  name: string
  sku: string
  category: {
    id: number
    name: string
    slug: string
  } | null
  
  price: number
  sale_price: number | null
  price_formatted: string
  original_price_formatted?: string
  
  stock: number
  sold: number
  rating: number
  reviews: number
  status: 'active' | 'low' | 'out'
  
  images?: Array<{
    id: number
    url: string
    is_main: boolean
  }>
  
  sizes?: Array<{
    size: string
    stock: number
  }>
  
  created_at: string
}

interface Category {
  id: string
  name: string
  count: number
  change: string
  icon: string
  bgColor: string
  borderColor: string
}

interface FilterParams {
  category: string
  status: string
  sortBy: string
  search: string
  page: number
  per_page: number
}

interface PaginatedResponse<T> {
  data: T[]
  current_page: number
  last_page: number
  per_page: number
  total: number
  from: number
  to: number
}

// ============================================
// Main Component
// ============================================

const ProductList = () => {
  const navigate = useNavigate()
  
  // State
  const [initialLoading, setInitialLoading] = useState(true)
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [productsLoading, setProductsLoading] = useState(false)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [filters, setFilters] = useState<FilterParams>({
    category: 'all',
    status: 'all',
    sortBy: 'newest',
    search: '',
    page: 1,
    per_page: 12
  })
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    total: 0,
    per_page: 12
  })

  // ============================================
  // Helper Functions
  // ============================================

  const getCategoryIcon = (categoryName: string) => {
    const name = categoryName.toLowerCase()
    if (name.includes('shirt') || name.includes('t-shirt')) return 'tshirt'
    if (name.includes('bag')) return 'shopping-bag'
    if (name.includes('shoe') || name.includes('foot')) return 'shoe'
    if (name.includes('watch')) return 'watch'
    return 'shopping-bag'
  }

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'tshirt': return <Shirt className="w-6 h-6" />
      case 'shopping-bag': return <ShoppingBag className="w-6 h-6" />
      case 'shoe': return <Footprints className="w-6 h-6" />
      case 'watch': return <Watch className="w-6 h-6" />
      default: return <ShoppingBag className="w-6 h-6" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <span className="px-3 py-1 bg-green-500 text-white text-xs font-semibold rounded-full">In Stock</span>
      case 'low':
        return <span className="px-3 py-1 bg-yellow-500 text-white text-xs font-semibold rounded-full">Low Stock</span>
      case 'out':
        return <span className="px-3 py-1 bg-red-500 text-white text-xs font-semibold rounded-full">Out of Stock</span>
      default:
        return null
    }
  }

  // 🔴 FUNGSI GET IMAGE URL - INI YANG DITAMBAHKAN
  const getImageUrl = (path: string | null | undefined): string => {
    if (!path) return '/images/no-image.png'
    
    // Kalau udah URL lengkap, langsung pakai
    if (path.startsWith('http://') || path.startsWith('https://')) {
      return path
    }
    
    // Base URL Laravel (sesuaikan dengan punya lo)
    const baseUrl = 'http://localhost:8000' // atau 'http://127.0.0.1:8000'
    
    // Pastikan path dimulai dengan /
    const cleanPath = path.startsWith('/') ? path : '/' + path
    
    return `${baseUrl}${cleanPath}`
  }

  // ============================================
  // Load Initial Data
  // ============================================
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setInitialLoading(true)
        
        const [statsData, categoriesData] = await Promise.allSettled([
          apiService.get<DashboardStats>('/admin/dashboard/stats').catch(() => null),
          apiService.get<Category[]>('/admin/categories').catch(() => [])
        ])
        
        if (statsData.status === 'fulfilled' && statsData.value) {
          setStats(statsData.value)
        }
        
        if (categoriesData.status === 'fulfilled' && Array.isArray(categoriesData.value)) {
          const colors = ['bg-pink-50', 'bg-blue-50', 'bg-green-50', 'bg-yellow-50', 'bg-purple-50']
          const borders = ['border-pink-200', 'border-blue-200', 'border-green-200', 'border-yellow-200', 'border-purple-200']
          
          const formattedCategories = categoriesData.value.map((cat: any, index: number) => ({
            id: cat.id,
            name: cat.name,
            count: Math.floor(Math.random() * 50) + 10,
            change: `+${Math.floor(Math.random() * 20)}%`,
            icon: getCategoryIcon(cat.name),
            bgColor: colors[index % colors.length],
            borderColor: borders[index % borders.length]
          }))
          
          setCategories(formattedCategories)
        }
        
      } catch (error) {
        console.error('Initial loading error:', error)
        toast.error('Failed to load initial data')
      } finally {
        setInitialLoading(false)
      }
    }
    
    loadInitialData()
  }, [])

  // ============================================
  // Debounce untuk Search
  // ============================================
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (!initialLoading) {
        fetchProducts()
      }
    }, 500)
    
    return () => clearTimeout(debounceTimer)
  }, [filters])

  // ============================================
  // Fetch Products
  // ============================================
  const fetchProducts = useCallback(async () => {
    if (productsLoading) return
    
    try {
      setProductsLoading(true)
      
      const params = new URLSearchParams({
        page: filters.page.toString(),
        per_page: filters.per_page.toString(),
        ...(filters.category !== 'all' && { category: filters.category }),
        ...(filters.status !== 'all' && { status: filters.status }),
        ...(filters.sortBy !== 'newest' && { sortBy: filters.sortBy }),
        ...(filters.search && { search: filters.search }),
      })
      
      console.log('Fetching products with params:', params.toString())
      
      const response = await apiService.get<PaginatedResponse<Product>>(`/admin/products?${params}`)
      
      console.log('Products response:', response)
      
      if (response && response.data && Array.isArray(response.data)) {
        setProducts(response.data)
        setPagination({
          current_page: response.current_page || 1,
          last_page: response.last_page || 1,
          total: response.total || 0,
          per_page: response.per_page || 12
        })
      } else {
        setProducts([])
      }
      
    } catch (error) {
      console.error('Failed to load products:', error)
      toast.error('Failed to load products')
      setProducts([])
    } finally {
      setProductsLoading(false)
    }
  }, [filters])

  // ============================================
  // Event Handlers
  // ============================================

  const handlePageChange = (newPage: number) => {
    setFilters(prev => ({ ...prev, page: newPage }))
  }

  const handleViewProduct = (id: number) => {
    navigate(`/admin/products/${id}`)
  }

  const handleEditProduct = (id: number) => {
    navigate(`/admin/products/${id}/edit`)
  }

  const handleDeleteProduct = async (id: number) => {
    if (!confirm('Are you sure you want to delete this product?')) return
    
    try {
      await apiService.delete(`/admin/products/${id}`)
      toast.success('Product deleted successfully')
      fetchProducts()
    } catch (error) {
      toast.error('Failed to delete product')
    }
  }

  const handleAddNew = () => {
    navigate('/admin/products/new')
  }

  const handleStatClick = (status: string) => {
    setFilters(prev => ({ ...prev, status, page: 1 }))
  }

  const handleCategoryClick = (categoryId: string) => {
    setFilters(prev => ({ ...prev, category: categoryId, page: 1 }))
  }

  // ============================================
  // Computed Data
  // ============================================
  
  const productStats = useMemo(() => ({
    total: stats?.products?.total || 0,
    active: stats?.products?.active || 0,
    lowStock: stats?.products?.low_stock || 0,
    outOfStock: stats?.products?.out_of_stock || 0,
    totalChange: stats?.products?.today || 0,
    activePercentage: stats?.products?.active_percentage || 0,
  }), [stats])

  // ============================================
  // Render
  // ============================================

  if (initialLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-gray-500 mx-auto mb-4" />
          <p className="text-gray-600">Loading products...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 w-full max-w-full overflow-x-hidden p-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Product Management</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your products and inventory</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleAddNew}
            className="px-4 py-2 bg-black text-white rounded-lg hover:bg-red-600 transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Product
          </button>
        </div>
      </div>

      {/* Product Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {[
          {
            title: 'Total Products',
            value: productStats.total,
            change: `+${productStats.totalChange} this month`,
            icon: <Package className="w-6 h-6" />,
            iconBg: 'bg-gradient-to-br from-black to-gray-800',
            border: 'border-t-4 border-black',
            status: 'all',
          },
          {
            title: 'Active',
            value: productStats.active,
            change: `${productStats.activePercentage}% active rate`,
            icon: <CheckCircle className="w-6 h-6" />,
            iconBg: 'bg-gradient-to-br from-green-500 to-green-400',
            border: 'border-t-4 border-green-500',
            status: 'active',
          },
          {
            title: 'Low Stock',
            value: productStats.lowStock,
            change: 'Needs restocking',
            icon: <AlertTriangle className="w-6 h-6" />,
            iconBg: 'bg-gradient-to-br from-yellow-500 to-yellow-400',
            border: 'border-t-4 border-yellow-500',
            status: 'low',
          },
          {
            title: 'Out of Stock',
            value: productStats.outOfStock,
            change: 'Urgent attention',
            icon: <XCircle className="w-6 h-6" />,
            iconBg: 'bg-gradient-to-br from-red-500 to-red-400',
            border: 'border-t-4 border-red-500',
            status: 'out',
          },
        ].map((stat) => (
          <div
            key={stat.title}
            onClick={() => handleStatClick(stat.status)}
            className={`bg-white rounded-xl p-6 shadow-sm border border-gray-200 
                       hover:shadow-md hover:-translate-y-1 transition-all cursor-pointer ${stat.border}`}
          >
            <div className="flex items-start justify-between mb-4">
              <span className="text-sm text-gray-500 font-medium">{stat.title}</span>
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white ${stat.iconBg}`}>
                {stat.icon}
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
            <div className="text-sm text-gray-600">{stat.change}</div>
          </div>
        ))}
      </div>

      {/* Low Stock Alert */}
      {productStats.lowStock > 0 && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg">
          <div className="flex items-center">
            <AlertTriangle className="w-5 h-5 text-yellow-400" />
            <p className="ml-3 text-sm text-yellow-700">
              <span className="font-bold">{productStats.lowStock}</span> products are running low on stock. 
              <button 
                onClick={() => handleStatClick('low')}
                className="ml-2 font-medium underline hover:text-yellow-600"
              >
                View products →
              </button>
            </p>
          </div>
        </div>
      )}

      {/* Categories Grid */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold mb-2">Product Categories</h3>
        <p className="text-sm text-gray-500 mb-6">Browse products by category</p>

        {categories.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {categories.map((category) => (
              <div
                key={category.id}
                onClick={() => handleCategoryClick(category.id)}
                className={`p-6 rounded-xl cursor-pointer transition-all hover:-translate-y-1 hover:shadow-md ${category.bgColor}`}
                style={{ borderColor: category.borderColor }}
              >
                <div className={`w-16 h-16 bg-white rounded-xl flex items-center justify-center mx-auto mb-4 border-2`}
                     style={{ borderColor: category.borderColor }}>
                  {getIcon(category.icon)}
                </div>
                <div className="text-center">
                  <h4 className="font-semibold mb-2">{category.name}</h4>
                  <div className="text-2xl font-bold mb-1">{category.count}</div>
                  <div className="text-sm text-gray-600">{category.change}</div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            <Package className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>No categories found</p>
          </div>
        )}
      </div>

      {/* Products Section */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        {/* Products header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h3 className="text-lg font-semibold">
            All Products <span className="text-sm font-normal text-gray-500 ml-2">
              ({pagination.total} items)
            </span>
          </h3>
          
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-4 py-2 border rounded-lg flex items-center gap-2 transition-all
                ${viewMode === 'grid' 
                  ? 'bg-black text-white border-black' 
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
            >
              <Grid className="w-4 h-4" />
              Grid
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-4 py-2 border rounded-lg flex items-center gap-2 transition-all
                ${viewMode === 'list' 
                  ? 'bg-black text-white border-black' 
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
            >
              <List className="w-4 h-4" />
              List
            </button>
          </div>
        </div>

        {/* Products Grid */}
        {productsLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-gray-500" />
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-gray-400 mb-3 text-6xl">📦</div>
            <h4 className="text-lg font-semibold text-gray-600 mb-2">No products found</h4>
            <p className="text-sm text-gray-500">Try adjusting your filters or create a new product</p>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {products.map((product) => (
              <div key={product.id} className="bg-gray-50 rounded-xl border border-gray-200 overflow-hidden hover:-translate-y-1 hover:shadow-md transition-all">
                {/* Product Image - PAKAI FUNGSI getImageUrl */}
                <div className="h-48 relative overflow-hidden bg-gray-200">
                  {product.images && product.images.length > 0 ? (
                    <img 
                      src={getImageUrl(
                        product.images.find(img => img.is_main)?.url || product.images[0]?.url
                      )}
                      alt={product.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.src = '/images/no-image.png'
                        e.currentTarget.onerror = null
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <Package className="w-12 h-12" />
                    </div>
                  )}
                  
                  <div className="absolute top-4 right-4">
                    {getStatusBadge(product.status)}
                  </div>
                </div>

                {/* Product Content */}
                <div className="p-5">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-semibold text-gray-900">{product.name}</h4>
                      <p className="text-xs text-gray-500 mt-1">
                        {product.category?.name || 'Unknown'} • {product.sku}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-gray-900">{product.price_formatted}</div>
                      {product.original_price_formatted && (
                        <div className="text-xs text-gray-500 line-through">
                          {product.original_price_formatted}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-4 mb-4 text-sm">
                    <div className="flex items-center gap-1.5 text-gray-600">
                      <Package className="w-4 h-4" />
                      <span>Stock: {product.stock}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-gray-600">
                      <ShoppingBag className="w-4 h-4" />
                      <span>Sold: {product.sold}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-gray-600">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span>{product.rating} ({product.reviews})</span>
                    </div>
                  </div>

                  {/* Tampilkan sizes */}
                  {product.sizes && product.sizes.length > 0 && (
                    <div className="mb-3 flex flex-wrap gap-1">
                      {product.sizes.slice(0, 5).map((size, idx) => (
                        <span 
                          key={idx}
                          className={`px-2 py-0.5 text-xs rounded border ${
                            size.stock > 0 
                              ? 'bg-gray-100 text-gray-700 border-gray-300' 
                              : 'bg-gray-200 text-gray-400 border-gray-200 line-through'
                          }`}
                          title={`Stock: ${size.stock}`}
                        >
                          {size.size}
                        </span>
                      ))}
                      {product.sizes.length > 5 && (
                        <span className="text-xs text-gray-500">+{product.sizes.length - 5}</span>
                      )}
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="grid grid-cols-3 gap-2 mt-4">
                    <button
                      onClick={() => handleEditProduct(product.id)}
                      className="flex items-center justify-center gap-1.5 px-3 py-2 
                               border border-gray-300 rounded-lg hover:bg-yellow-500 
                               hover:text-white hover:border-yellow-500 transition-all text-sm"
                    >
                      <Edit3 className="w-4 h-4" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleViewProduct(product.id)}
                      className="flex items-center justify-center gap-1.5 px-3 py-2 
                               border border-gray-300 rounded-lg hover:bg-blue-500 
                               hover:text-white hover:border-blue-500 transition-all text-sm"
                    >
                      <Eye className="w-4 h-4" />
                      View
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(product.id)}
                      className="flex items-center justify-center gap-1.5 px-3 py-2 
                               border border-gray-300 rounded-lg hover:bg-red-500 
                               hover:text-white hover:border-red-500 transition-all text-sm"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            <List className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>List view is under construction</p>
          </div>
        )}

        {/* Pagination */}
        {pagination.last_page > 1 && (
          <div className="flex justify-center mt-8 gap-2">
            <button
              onClick={() => handlePageChange(pagination.current_page - 1)}
              disabled={pagination.current_page === 1}
              className="px-4 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Previous
            </button>
            <span className="px-4 py-2">
              Page {pagination.current_page} of {pagination.last_page}
            </span>
            <button
              onClick={() => handlePageChange(pagination.current_page + 1)}
              disabled={pagination.current_page === pagination.last_page}
              className="px-4 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default ProductList