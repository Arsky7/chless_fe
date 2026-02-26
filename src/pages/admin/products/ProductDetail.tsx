import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { apiService } from '../../../services/api'
import { toast } from 'react-hot-toast'
import {
    ArrowLeft, Edit3, Trash2, Package, Tag, Star,
    Map, Ruler, Scale, Eye, EyeOff, Calendar, ShieldCheck, Box
} from 'lucide-react'

// Types based on the backend data structure
interface ProductImage {
    id: number
    url: string
    is_main: boolean
}

interface ProductSize {
    size: string
    stock: number
}

interface Category {
    id: number
    name: string
}

interface ProductDetailData {
    id: number
    name: string
    category: Category
    short_description?: string
    description?: string
    tags?: string
    base_price?: number
    price?: number
    sale_price?: number
    sale_starts_at?: string
    sale_ends_at?: string
    sku?: string
    gender?: 'men' | 'women' | 'unisex'
    material?: string
    care_instructions?: string
    weight?: number
    length?: number
    width?: number
    height?: number
    is_featured?: boolean
    track_inventory?: boolean
    allow_backorders?: boolean
    is_returnable?: boolean
    meta_title?: string
    meta_description?: string
    meta_keywords?: string
    is_active?: boolean
    visibility?: 'public' | 'hidden' | 'private'
    images?: ProductImage[]
    sizes?: ProductSize[]
    created_at?: string
}

const ProductDetail = () => {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()

    const [product, setProduct] = useState<ProductDetailData | null>(null)
    const [loading, setLoading] = useState(true)
    const [activeImage, setActiveImage] = useState<string>('')

    useEffect(() => {
        fetchProductDetail()
    }, [id])

    const fetchProductDetail = async () => {
        try {
            setLoading(true)
            const response = await apiService.get<any>(`/admin/products/${id}`)
            const data = response.data || response
            setProduct(data)

            // Set initial active image to main image or first image
            if (data.images && data.images.length > 0) {
                const mainImage = data.images.find((img: ProductImage) => img.is_main) || data.images[0]
                setActiveImage(getImageUrl(mainImage.url))
            }
        } catch (error) {
            console.error('Failed to load product details:', error)
            toast.error('Failed to load product details')
            navigate('/admin/products')
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this product?')) return

        try {
            await apiService.delete(`/admin/products/${id}`)
            toast.success('Product deleted successfully')
            navigate('/admin/products')
        } catch (error) {
            toast.error('Failed to delete product')
        }
    }

    const getImageUrl = (path: string | undefined): string => {
        if (!path) return 'https://placehold.co/800x1200/f3f4f6/a1a1aa?text=No+Image'
        if (path.startsWith('http://') || path.startsWith('https://')) return path
        if (path.startsWith('data:')) return path

        const backendUrl = 'http://localhost:8000'
        const cleanPath = path.startsWith('/') ? path : '/' + path
        if (cleanPath.startsWith('/storage/')) return `${backendUrl}${cleanPath}`
        return `${backendUrl}/storage${cleanPath}`
    }

    const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
        const target = e.currentTarget
        target.onerror = null
        target.src = 'https://placehold.co/800x1200/f3f4f6/a1a1aa?text=Image+Not+Found'
    }

    const formatPrice = (price: number | undefined) => {
        if (price === undefined) return 'Rp 0'
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(price)
    }

    const getTotalStock = () => {
        if (!product?.sizes) return 0
        return product.sizes.reduce((total, size) => total + size.stock, 0)
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="flex flex-col items-center gap-3">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-l-2 border-[#ff4d6d]"></div>
                    <p className="text-gray-500 font-medium animate-pulse">Loading Product Data...</p>
                </div>
            </div>
        )
    }

    if (!product) return null

    // Determine actual display price
    const displayPrice = product.price || product.base_price || 0
    const isSale = !!product.sale_price && product.sale_price < displayPrice

    return (
        <div className="space-y-6 max-w-7xl mx-auto pb-10">
            {/* Header & Breadcrumb */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 md:p-6 rounded-2xl shadow-sm border border-gray-100">
                <div>
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                        <Link to="/admin" className="hover:text-[#ff4d6d] transition-colors">Dashboard</Link>
                        <span>›</span>
                        <Link to="/admin/products" className="hover:text-[#ff4d6d] transition-colors">Products</Link>
                        <span>›</span>
                        <span className="text-gray-900 font-semibold truncate max-w-[200px]">{product.name}</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => navigate('/admin/products')}
                            className="p-1.5 bg-gray-50 hover:bg-gray-100 rounded-lg text-gray-600 transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                        <h1 className="text-2xl font-bold text-gray-900">Product Details</h1>
                        {product.is_active ? (
                            <span className="px-2.5 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-lg flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                                Active
                            </span>
                        ) : (
                            <span className="px-2.5 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-lg flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                                Inactive
                            </span>
                        )}
                        {product.is_featured && (
                            <span className="px-2.5 py-1 bg-amber-100 text-amber-700 text-xs font-bold rounded-lg flex items-center gap-1">
                                <Star className="w-3 h-3 fill-amber-500" />
                                Featured
                            </span>
                        )}
                    </div>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                    <Link
                        to={`/admin/products/${product.id}/edit`}
                        className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-black text-white text-sm font-semibold rounded-xl hover:bg-gray-800 transition-all duration-300 shadow-sm hover:shadow"
                    >
                        <Edit3 className="w-4 h-4" />
                        Edit Product
                    </Link>
                    <button
                        onClick={handleDelete}
                        className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-red-50 text-red-600 text-sm font-semibold rounded-xl hover:bg-red-600 hover:text-white transition-all duration-300 shadow-sm"
                    >
                        <Trash2 className="w-4 h-4" />
                        <span className="hidden sm:inline">Delete</span>
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
                {/* Left Column: Images Galleries */}
                <div className="lg:col-span-1 space-y-4">
                    <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                        <div className="aspect-[3/4] bg-gray-50 rounded-xl overflow-hidden mb-4 border border-gray-200">
                            <img
                                src={activeImage || 'https://placehold.co/800x1200/f3f4f6/a1a1aa?text=No+Image'}
                                alt={product.name}
                                className="w-full h-full object-cover transition-all duration-500 hover:scale-105"
                                onError={handleImageError}
                            />
                        </div>

                        {product.images && product.images.length > 0 && (
                            <div className="grid grid-cols-4 gap-2">
                                {product.images.map((img) => (
                                    <button
                                        key={img.id}
                                        onClick={() => setActiveImage(getImageUrl(img.url))}
                                        className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${activeImage === getImageUrl(img.url)
                                                ? 'border-[#ff4d6d] opacity-100 scale-95 shadow-md'
                                                : 'border-transparent opacity-60 hover:opacity-100 hover:border-gray-300'
                                            }`}
                                    >
                                        <img
                                            src={getImageUrl(img.url)}
                                            alt="Thumbnail"
                                            className="w-full h-full object-cover"
                                            onError={handleImageError}
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Quick Stats Card */}
                    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                        <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-4 flex items-center gap-2">
                            <Box className="w-4 h-4 text-[#ff4d6d]" />
                            Inventory Status
                        </h3>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 bg-blue-50/50 border border-blue-100 rounded-xl">
                                <p className="text-xs text-blue-600 font-semibold mb-1 uppercase">Total Stock</p>
                                <p className="text-3xl font-black text-blue-900">{getTotalStock()}</p>
                                {product.track_inventory && (
                                    <span className="text-[10px] text-blue-500 font-medium flex items-center gap-1 mt-1">
                                        <ShieldCheck className="w-3 h-3" /> Tracked
                                    </span>
                                )}
                            </div>
                            <div className="p-4 bg-purple-50/50 border border-purple-100 rounded-xl">
                                <p className="text-xs text-purple-600 font-semibold mb-1 uppercase">SKU</p>
                                <p className="text-sm font-bold text-gray-900 break-all">{product.sku || 'N/A'}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Product Detail Info */}
                <div className="lg:col-span-2 space-y-6">

                    {/* Primary Info Card */}
                    <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100 relative overflow-hidden">
                        {/* Decorative background element */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-pink-50 to-orange-50 rounded-full blur-3xl -mr-20 -mt-20 opacity-50 pointer-events-none"></div>

                        <div className="relative z-10">
                            <div className="flex flex-wrap items-center gap-2 mb-3">
                                <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-bold uppercase tracking-wider rounded-md border border-gray-200">
                                    {product.category?.name || 'Uncategorized'}
                                </span>
                                <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-bold uppercase tracking-wider rounded-md flex items-center gap-1 border border-gray-200">
                                    {product.visibility === 'public' ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                                    {product.visibility || 'Public'}
                                </span>
                            </div>

                            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-2 leading-tight">
                                {product.name}
                            </h1>

                            {product.short_description && (
                                <p className="text-lg text-gray-500 mb-6 font-medium leading-relaxed">
                                    {product.short_description}
                                </p>
                            )}

                            <div className="flex items-end gap-3 mb-8 pb-8 border-b border-gray-100">
                                {isSale ? (
                                    <>
                                        <h2 className="text-4xl md:text-5xl font-black text-[#ff4d6d]">{formatPrice(product.sale_price)}</h2>
                                        <h3 className="text-xl md:text-2xl font-bold text-gray-400 line-through mb-1.5">{formatPrice(displayPrice)}</h3>
                                        <span className="ml-2 px-2 py-1 bg-red-100 text-red-600 text-xs font-bold rounded mb-2">SALE</span>
                                    </>
                                ) : (
                                    <h2 className="text-4xl md:text-5xl font-black text-gray-900">{formatPrice(displayPrice)}</h2>
                                )}
                            </div>

                            {/* Detailed Description */}
                            <div className="prose prose-sm md:prose-base max-w-none text-gray-600">
                                <h3 className="text-base font-bold text-gray-900 mb-3 flex items-center gap-2">
                                    <Tag className="w-4 h-4 text-gray-400" />
                                    Product Description
                                </h3>
                                {product.description ? (
                                    <div className="whitespace-pre-wrap leading-relaxed bg-gray-50 p-5 rounded-xl border border-gray-100">
                                        {product.description}
                                    </div>
                                ) : (
                                    <p className="italic text-gray-400">No detailed description provided.</p>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Sizes & Variations */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                            <h3 className="text-base font-bold text-gray-900 mb-5 flex items-center gap-2 border-b border-gray-50 pb-3">
                                <Ruler className="w-5 h-5 text-gray-400" />
                                Available Sizes
                            </h3>

                            {product.sizes && product.sizes.length > 0 ? (
                                <div className="space-y-3">
                                    {product.sizes.map((size, idx) => (
                                        <div key={idx} className="flex items-center justify-between p-3 rounded-xl border border-gray-100 hover:border-gray-300 hover:bg-gray-50 transition-colors group">
                                            <div className="flex items-center gap-4">
                                                <div className={`w-12 h-12 flex items-center justify-center rounded-lg font-black text-lg ${size.stock > 0 ? 'bg-black text-white' : 'bg-gray-100 text-gray-400'
                                                    }`}>
                                                    {size.size}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-gray-900 group-hover:text-[#ff4d6d] transition-colors">Size {size.size}</p>
                                                    <p className={`text-xs font-medium ${size.stock > 10 ? 'text-green-600' : size.stock > 0 ? 'text-amber-500' : 'text-red-500'}`}>
                                                        {size.stock > 0 ? `${size.stock} in stock` : 'Out of stock'}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Stock Level Indicator Bar */}
                                            <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden hidden sm:block">
                                                <div
                                                    className={`h-full rounded-full ${size.stock > 10 ? 'bg-green-500' : size.stock > 0 ? 'bg-amber-400' : 'bg-red-500'}`}
                                                    style={{ width: `${Math.min(100, Math.max(5, (size.stock / 50) * 100))}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8 bg-gray-50 rounded-xl border border-dashed border-gray-300 w-full">
                                    <p className="text-gray-500 text-sm font-medium">No sizing details available.</p>
                                </div>
                            )}
                        </div>

                        {/* Product Meta & Shipping */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-6 flex flex-col justify-between">
                            <div>
                                <h3 className="text-base font-bold text-gray-900 mb-5 flex items-center gap-2 border-b border-gray-50 pb-3">
                                    <Map className="w-5 h-5 text-gray-400" />
                                    Specifications
                                </h3>
                                <div className="grid grid-cols-2 gap-y-4 gap-x-6">
                                    <div>
                                        <p className="text-xs text-gray-500 font-medium mb-1 uppercase tracking-wider">Gender</p>
                                        <p className="text-sm font-bold text-gray-900 capitalize">{product.gender || '-'}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 font-medium mb-1 uppercase tracking-wider">Material</p>
                                        <p className="text-sm font-bold text-gray-900">{product.material || '-'}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 font-medium mb-1 uppercase tracking-wider">Weight</p>
                                        <p className="text-sm font-bold text-gray-900">{product.weight ? `${product.weight} g` : '-'}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 font-medium mb-1 uppercase tracking-wider">Dimensions</p>
                                        <p className="text-sm font-bold text-gray-900">
                                            {product.length || '-'} x {product.width || '-'} x {product.height || '-'} cm
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-5 border-t border-gray-100">
                                <div className="flex flex-wrap gap-2">
                                    <span className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 ${product.is_returnable ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                                        <ShieldCheck className="w-3.5 h-3.5" />
                                        {product.is_returnable ? 'Returnable' : 'No Returns'}
                                    </span>
                                    <span className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 ${product.allow_backorders ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'bg-gray-100 text-gray-600 border border-gray-200'}`}>
                                        <Scale className="w-3.5 h-3.5" />
                                        {product.allow_backorders ? 'Backorders Allowed' : 'No Backorders'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default ProductDetail
