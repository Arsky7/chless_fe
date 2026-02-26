// pages/admin/products/ProductList.tsx
import { useState, useEffect, useCallback, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { apiService } from '../../../services/api'
import {
  Package,
  AlertTriangle,
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
import ProductViewModal from './components/ProductViewModal'

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

  base_price: number
  sale_price: number | null
  price_formatted: string
  sale_price_formatted?: string
  original_price_formatted?: string // untuk harga coret

  stock_quantity: number
  sales_count: number
  rating: number
  reviews: number
  status: 'active' | 'low' | 'out'

  // Properti tambahan untuk UI (hasil mapping)
  stock: number
  sold: number

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

  // Modal State
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null)

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
    if (name.includes('shirt') || name.includes('t-shirt') || name.includes('pakaian') || name.includes('baju')) return 'tshirt'
    if (name.includes('bag') || name.includes('tas')) return 'shopping-bag'
    if (name.includes('shoe') || name.includes('foot') || name.includes('sepatu') || name.includes('alas kaki')) return 'shoe'
    if (name.includes('watch') || name.includes('jam') || name.includes('aksesoris') || name.includes('accessory')) return 'watch'
    if (name.includes('head') || name.includes('topi') || name.includes('hat')) return 'watch'
    if (name.includes('bottom') || name.includes('celana') || name.includes('pants')) return 'shirt'
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

  // Fungsi untuk mendapatkan URL gambar yang konsisten
  const getImageUrl = (path: string | null | undefined): string => {
    if (!path) return 'https://placehold.co/400x500/f3f4f6/a1a1aa?text=No+Image'

    // Jika path sudah merupakan URL lengkap (eksternal)
    if (path.startsWith('http://') || path.startsWith('https://')) {
      return path
    }

    const backendUrl = 'http://localhost:8000'

    // Jika path sudah mengandung /storage (hasil dari Storage::url di Laravel)
    if (path.startsWith('/storage/') || path.startsWith('storage/')) {
      const cleanPath = path.startsWith('/') ? path : '/' + path
      return `${backendUrl}${cleanPath}`
    }

    // Jika path murni path file (misal: "products/image.jpg")
    const cleanPath = path.startsWith('/') ? path : '/' + path
    return `${backendUrl}/storage${cleanPath}`
  }

  // Handler untuk error gambar agar tidak loop
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const target = e.currentTarget
    target.onerror = null // Stop further error calls
    target.src = 'https://placehold.co/400x500/f3f4f6/a1a1aa?text=Image+Not+Found'
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
          const statsPayload = (statsData.value as any).data || statsData.value
          setStats(statsPayload)
        }

        if (categoriesData.status === 'fulfilled' && categoriesData.value) {
          const colors = ['bg-pink-50', 'bg-blue-50', 'bg-green-50', 'bg-yellow-50', 'bg-purple-50']
          const borders = ['border-pink-200', 'border-blue-200', 'border-green-200', 'border-yellow-200', 'border-purple-200']

          const catResponse = categoriesData.value as any
          const catPayload = catResponse.data || catResponse

          if (Array.isArray(catPayload)) {
            const formattedCategories = catPayload.map((cat: any, index: number) => ({
              id: cat.id,
              name: cat.name,
              count: cat.product_count || 0,
              change: `${cat.product_count || 0} Total Items`,
              icon: getCategoryIcon(cat.name),
              bgColor: colors[index % colors.length],
              borderColor: borders[index % borders.length]
            }))

            setCategories(formattedCategories)
          }
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
  // Debounce untuk Search (dengan dependency initialLoading)
  // ============================================
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (!initialLoading) {
        fetchProducts()
      }
    }, 500)

    return () => clearTimeout(debounceTimer)
  }, [filters, initialLoading]) // <-- tambah initialLoading

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

      const response: any = await apiService.get(`/admin/products?${params}`)

      console.log('Products response:', response)

      let items = []
      let meta = {
        current_page: 1,
        last_page: 1,
        total: 0,
        per_page: Number(filters.per_page) || 12
      }

      if (response && response.data) {
        if (Array.isArray(response.data)) {
          items = response.data
          meta = {
            current_page: response.current_page || 1,
            last_page: response.last_page || 1,
            total: response.total || 0,
            per_page: response.per_page || 12
          }
        } else if (response.data.data && Array.isArray(response.data.data)) {
          items = response.data.data
          meta = {
            current_page: response.data.current_page || 1,
            last_page: response.data.last_page || 1,
            total: response.data.total || 0,
            per_page: response.data.per_page || 12
          }
        }

        // Mapping data agar sesuai dengan yang dibutuhkan UI
        items = items.map((item: any) => ({
          ...item,
          price: item.base_price,
          stock: item.stock_quantity ?? item.total_stock ?? 0,
          sold: item.sales_count ?? item.sold_count ?? 0,
          status: item.is_active ? 'active' : 'out',
          original_price_formatted: item.sale_price_formatted || undefined,
          images: item.images || [],
          rating: item.rating ?? 0,
          reviews: item.reviews ?? 0,
        }))
      }

      setProducts(items)
      setPagination(meta)

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
    setSelectedProductId(id)
    setIsViewModalOpen(true)
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
    setFilters(prev => ({
      ...prev,
      category: prev.category === categoryId ? 'all' : categoryId,
      page: 1
    }))
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

  const ProductSkeleton = () => (
    <div className="bg-gray-50 rounded-xl border border-gray-200 overflow-hidden animate-pulse">
      <div className="h-48 bg-gray-300"></div>
      <div className="p-5 space-y-4">
        <div className="flex justify-between gap-2">
          <div className="h-5 bg-gray-200 rounded w-2/3"></div>
          <div className="h-5 bg-gray-200 rounded w-1/4"></div>
        </div>
        <div className="h-3 bg-gray-100 rounded w-1/2"></div>
        <div className="h-3 bg-gray-100 rounded w-1/3"></div>
        <div className="h-8 bg-gray-50 rounded w-full border-y border-gray-100"></div>
        <div className="grid grid-cols-3 gap-2">
          <div className="h-9 bg-gray-200 rounded"></div>
          <div className="h-9 bg-gray-200 rounded"></div>
          <div className="h-9 bg-gray-200 rounded"></div>
        </div>
      </div>
    </div>
  )

  const StatSkeleton = () => (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 animate-pulse">
      <div className="flex justify-between items-start mb-4">
        <div className="h-4 bg-gray-200 rounded w-24"></div>
        <div className="w-12 h-12 bg-gray-200 rounded-xl"></div>
      </div>
      <div className="h-8 bg-gray-200 rounded w-16 mb-2"></div>
      <div className="h-4 bg-gray-100 rounded w-32"></div>
    </div>
  )

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
        {initialLoading ? (
          Array.from({ length: 4 }).map((_, i) => <StatSkeleton key={i} />)
        ) : [
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

        {initialLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="p-6 rounded-xl animate-pulse bg-gray-50 border border-gray-100">
                <div className="w-16 h-16 bg-gray-200 rounded-xl mx-auto mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto mb-2"></div>
                <div className="h-6 bg-gray-200 rounded w-1/4 mx-auto mb-1"></div>
                <div className="h-3 bg-gray-100 rounded w-1/3 mx-auto"></div>
              </div>
            ))}
          </div>
        ) : categories.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {categories.map((category) => (
              <div
                key={category.id}
                onClick={() => handleCategoryClick(category.id)}
                className={`p-6 rounded-xl cursor-pointer transition-all hover:-translate-y-1 hover:shadow-md border-2 ${category.bgColor} ${filters.category === category.id ? 'ring-2 ring-black ring-offset-2' : ''}`}
                style={{ borderColor: category.borderColor }}
              >
                <div className={`w-16 h-16 bg-white rounded-xl flex items-center justify-center mx-auto mb-4 border-2`}
                  style={{ borderColor: category.borderColor }}>
                  {getIcon(category.icon)}
                </div>
                <div className="text-center">
                  <h4 className="font-semibold mb-2">{category.name}</h4>
                  <div className="text-2xl font-bold mb-1">{category.count}</div>
                  <div className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {category.count === 0 ? 'Empty Category' : 'Items Collection'}
                  </div>
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => <ProductSkeleton key={i} />)}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-gray-400 mb-3 text-6xl">📦</div>
            <h4 className="text-lg font-semibold text-gray-600 mb-2">No products found</h4>
            <p className="text-sm text-gray-500">Try adjusting your filters or create a new product</p>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <div key={product.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:-translate-y-2 hover:shadow-xl transition-all duration-300 group flex flex-col h-full shadow-sm">
                <div className="h-56 relative overflow-hidden bg-gray-100">
                  {product.images && product.images.length > 0 ? (
                    <img
                      src={getImageUrl(
                        product.images.find((img: any) => img.is_main)?.url || product.images[0]?.url || (product.images[0] as any)?.path
                      )}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      loading="lazy"
                      onError={handleImageError}
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 bg-gray-50">
                      <Package className="w-12 h-12 mb-2 opacity-20" />
                      <span className="text-[10px] uppercase tracking-widest font-bold opacity-40">No Image</span>
                    </div>
                  )}

                  <div className="absolute top-4 right-4 z-10">
                    {getStatusBadge(product.status)}
                  </div>

                  {/* Overlay on hover */}
                  <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                </div>

                {/* Product Content */}
                <div className="p-6 flex flex-col flex-1">
                  <div className="mb-4">
                    <div className="flex justify-between items-start gap-3 min-w-0">
                      <h4 className="font-bold text-gray-900 line-clamp-2 flex-1 text-sm leading-tight h-10" title={product.name}>
                        {product.name}
                      </h4>
                      <div className="text-right shrink-0">
                        <div className="font-extrabold text-black text-sm">{product.price_formatted}</div>
                        {product.original_price_formatted && (
                          <div className="text-[10px] text-gray-400 line-through mt-0.5">
                            {product.original_price_formatted}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="inline-flex items-center px-2 py-0.5 rounded bg-gray-100 text-[10px] text-gray-500 mt-2 uppercase tracking-wider font-bold">
                      {product.category?.name || 'Uncategorized'}
                    </div>
                  </div>

                  {/* Rating Stars - Premium Look */}
                  <div className="flex flex-wrap items-center gap-2 mb-4 mt-auto">
                    <div className="flex gap-0.5 shrink-0">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-3.5 h-3.5 ${star <= Math.round(product.rating || 0)
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-gray-200 fill-gray-200'
                            }`}
                        />
                      ))}
                    </div>
                    <span className="text-[11px] text-gray-400 font-semibold bg-gray-50 px-1.5 py-0.5 rounded">
                      {product.rating?.toFixed(1) || '0.0'} ({product.reviews || 0})
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-px bg-gray-100 border border-gray-100 rounded-lg overflow-hidden mb-5 shrink-0 shadow-sm">
                    <div className="flex flex-col items-center justify-center p-2 bg-white">
                      <span className="text-[9px] text-gray-400 uppercase font-bold mb-0.5">Stock</span>
                      <span className="text-xs font-bold text-gray-800">{product.stock}</span>
                    </div>
                    <div className="flex flex-col items-center justify-center p-2 bg-white">
                      <span className="text-[9px] text-gray-400 uppercase font-bold mb-0.5">Sold</span>
                      <span className="text-xs font-bold text-gray-800">{product.sold}</span>
                    </div>
                  </div>

                  {/* Tampilkan sizes */}
                  {product.sizes && product.sizes.length > 0 && (
                    <div className="mb-3 flex flex-wrap gap-1">
                      {product.sizes.slice(0, 5).map((size, idx) => (
                        <span
                          key={idx}
                          className={`px-2 py-0.5 text-xs rounded border ${size.stock > 0
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
                  <div className="flex gap-2 mt-4 pt-4 border-t border-gray-50">
                    <button
                      onClick={() => handleEditProduct(product.id)}
                      className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 
                               bg-gray-50 text-gray-700 rounded-lg hover:bg-black 
                               hover:text-white transition-all duration-300 text-xs font-bold"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleViewProduct(product.id)}
                      className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 
                               bg-gray-50 text-gray-700 rounded-lg hover:bg-black 
                               hover:text-white transition-all duration-300 text-xs font-bold"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      View
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(product.id)}
                      className="p-2 bg-red-50 text-red-500 rounded-lg hover:bg-red-500 
                               hover:text-white transition-all duration-300 shadow-sm"
                      title="Delete Product"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto -mx-6">
            <div className="inline-block min-w-full align-middle px-6">
              <div className="overflow-hidden border border-gray-100 rounded-xl shadow-sm">
                <table className="min-w-full divide-y divide-gray-100">
                  <thead className="bg-gray-50 uppercase tracking-wider text-[10px] font-bold text-gray-500">
                    <tr>
                      <th className="px-6 py-4 text-left">Product</th>
                      <th className="px-6 py-4 text-left">Category</th>
                      <th className="px-6 py-4 text-left">Price</th>
                      <th className="px-6 py-4 text-left">Stock</th>
                      <th className="px-6 py-4 text-left">Sales</th>
                      <th className="px-6 py-4 text-left">Status</th>
                      <th className="px-6 py-4 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-50">
                    {products.map((product) => (
                      <tr key={product.id} className="hover:bg-gray-50/50 transition-colors group">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 shrink-0 border border-gray-100">
                              <img
                                src={getImageUrl(product.images?.[0]?.url || (product.images?.[0] as any)?.path)}
                                alt={product.name}
                                className="w-full h-full object-cover"
                                onError={handleImageError}
                              />
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-bold text-gray-900 truncate max-w-[200px]">{product.name}</p>
                              <p className="text-[10px] text-gray-400 font-medium tracking-tight">SKU: {product.sku}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-xs font-medium text-gray-600 px-2.5 py-1 bg-gray-100 rounded-md">
                            {product.category?.name || 'Uncategorized'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm font-bold text-gray-900">{product.price_formatted}</p>
                          {product.original_price_formatted && (
                            <p className="text-[10px] text-gray-400 line-through">{product.original_price_formatted}</p>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <div className={`w-1.5 h-1.5 rounded-full ${product.stock > 10 ? 'bg-green-500' : product.stock > 0 ? 'bg-yellow-500' : 'bg-red-500'}`} />
                            <span className="text-sm font-semibold text-gray-700">{product.stock}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm font-medium text-gray-600">{product.sold}</span>
                        </td>
                        <td className="px-6 py-4">
                          {getStatusBadge(product.status)}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => handleEditProduct(product.id)}
                              className="p-1.5 text-gray-400 hover:text-black hover:bg-gray-100 rounded-md transition-all"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleViewProduct(product.id)}
                              className="p-1.5 text-gray-400 hover:text-black hover:bg-gray-100 rounded-md transition-all"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(product.id)}
                              className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-all"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
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

      <ProductViewModal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        productId={selectedProductId}
      />
    </div>
  )
}

export default ProductList