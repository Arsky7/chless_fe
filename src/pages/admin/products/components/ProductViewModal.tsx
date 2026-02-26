import React, { useState, useEffect } from 'react'
import { X, Edit3, Map, Ruler, Box, Tag } from 'lucide-react'
import { apiService } from '../../../../services/api'
import { toast } from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

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
    sku?: string
    gender?: string
    material?: string
    weight?: number
    length?: number
    width?: number
    height?: number
    is_featured?: boolean
    track_inventory?: boolean
    is_returnable?: boolean
    allow_backorders?: boolean
    is_active?: boolean
    images?: ProductImage[]
    sizes?: ProductSize[]
}

interface ProductViewModalProps {
    isOpen: boolean
    onClose: () => void
    productId: number | null
}

const ProductViewModal: React.FC<ProductViewModalProps> = ({ isOpen, onClose, productId }) => {
    const navigate = useNavigate()
    const [product, setProduct] = useState<ProductDetailData | null>(null)
    const [loading, setLoading] = useState(false)
    const [activeImage, setActiveImage] = useState<string>('')

    useEffect(() => {
        if (isOpen && productId) {
            fetchProductDetail()
        } else {
            setProduct(null)
            setActiveImage('')
        }
    }, [isOpen, productId])

    useEffect(() => {
        // Prevent background scrolling when modal is open
        if (isOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = 'unset'
        }
        return () => {
            document.body.style.overflow = 'unset'
        }
    }, [isOpen])

    const fetchProductDetail = async () => {
        try {
            setLoading(true)
            const response = await apiService.get<any>(`/admin/products/${productId}`)
            const data = response.data || response
            setProduct(data)

            if (data.images && data.images.length > 0) {
                const mainImage = data.images.find((img: ProductImage) => img.is_main) || data.images[0]
                setActiveImage(getImageUrl(mainImage.url))
            }
        } catch (error) {
            console.error('Failed to load product details:', error)
            toast.error('Failed to load product details')
            onClose()
        } finally {
            setLoading(false)
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

    if (!isOpen) return null

    // Determine actual display price
    const displayPrice = product?.price || product?.base_price || 0
    const isSale = !!product?.sale_price && product.sale_price < displayPrice

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 pb-20 sm:pb-6 mt-16 sm:mt-0">
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            ></div>

            {/* Modal Content */}
            <div className="relative w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] sm:max-h-[85vh] animate-in fade-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-white z-10 sticky top-0">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-pink-50 flex items-center justify-center">
                            <Box className="w-4 h-4 text-[#ff4d6d]" />
                        </div>
                        <h2 className="text-xl font-black text-gray-900">Product Details</h2>
                    </div>
                    <div className="flex items-center gap-3">
                        {product && (
                            <button
                                onClick={() => {
                                    onClose()
                                    navigate(`/admin/products/${product.id}/edit`)
                                }}
                                className="flex items-center gap-2 px-4 py-2 bg-black text-white text-xs font-bold rounded-xl hover:bg-gray-800 transition-colors"
                            >
                                <Edit3 className="w-3.5 h-3.5" />
                                Edit Product
                            </button>
                        )}
                        <button
                            onClick={onClose}
                            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Body */}
                <div className="overflow-y-auto flex-1 p-6 relative custom-scrollbar">
                    {loading ? (
                        <div className="min-h-[400px] flex flex-col items-center justify-center gap-4">
                            <div className="animate-spin w-10 h-10 border-4 border-[#ff4d6d]/20 border-t-[#ff4d6d] rounded-full"></div>
                            <p className="text-sm font-medium text-gray-500 animate-pulse">Loading amazing product...</p>
                        </div>
                    ) : product ? (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Left Column: Images */}
                            <div className="space-y-4">
                                <div className="aspect-[4/5] sm:aspect-square bg-gray-50 rounded-2xl overflow-hidden border border-gray-100 relative group">
                                    <img
                                        src={activeImage || 'https://placehold.co/800x1200/f3f4f6/a1a1aa?text=No+Image'}
                                        alt={product.name}
                                        className="w-full h-full object-cover mix-blend-multiply transition-transform duration-500 group-hover:scale-105"
                                        onError={handleImageError}
                                    />
                                    {isSale && (
                                        <div className="absolute top-4 right-4 bg-red-500 text-white text-xs font-black px-3 py-1 rounded-full shadow-lg">
                                            SALE
                                        </div>
                                    )}
                                </div>

                                {product.images && product.images.length > 0 && (
                                    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                                        {product.images.map((img) => (
                                            <button
                                                key={img.id}
                                                onClick={() => setActiveImage(getImageUrl(img.url))}
                                                className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${activeImage === getImageUrl(img.url)
                                                    ? 'border-[#ff4d6d] scale-95 shadow-md'
                                                    : 'border-transparent opacity-70 hover:opacity-100'
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

                            {/* Right Column: Details */}
                            <div className="space-y-6">
                                {/* Title & Price */}
                                <div>
                                    <div className="flex items-center gap-2 mb-3">
                                        {product.is_active ? (
                                            <span className="px-2.5 py-1 bg-green-100 text-green-700 text-[10px] font-black uppercase tracking-wider rounded-md">
                                                Active
                                            </span>
                                        ) : (
                                            <span className="px-2.5 py-1 bg-red-100 text-red-700 text-[10px] font-black uppercase tracking-wider rounded-md">
                                                Inactive
                                            </span>
                                        )}
                                        <span className="px-2.5 py-1 bg-gray-100 text-gray-700 text-[10px] font-black uppercase tracking-wider rounded-md">
                                            {product.category?.name || 'Uncategorized'}
                                        </span>
                                    </div>
                                    <h1 className="text-2xl sm:text-3xl font-black text-gray-900 mb-2 leading-tight">
                                        {product.name}
                                    </h1>

                                    <div className="flex items-end gap-3 mb-4">
                                        {isSale ? (
                                            <>
                                                <h2 className="text-3xl font-black text-[#ff4d6d]">{formatPrice(product.sale_price)}</h2>
                                                <h3 className="text-lg font-bold text-gray-400 line-through mb-1">{formatPrice(displayPrice)}</h3>
                                            </>
                                        ) : (
                                            <h2 className="text-3xl font-black text-gray-900">{formatPrice(displayPrice)}</h2>
                                        )}
                                    </div>

                                    {product.short_description && (
                                        <p className="text-sm text-gray-500 font-medium">
                                            {product.short_description}
                                        </p>
                                    )}
                                </div>

                                <hr className="border-gray-100" />

                                {/* Inventory Stats */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-blue-50/50 p-4 rounded-2xl border border-blue-100">
                                        <p className="text-[10px] uppercase font-bold text-blue-600 mb-1">Total Stock</p>
                                        <p className="text-2xl font-black text-blue-900">{getTotalStock()}</p>
                                    </div>
                                    <div className="bg-purple-50/50 p-4 rounded-2xl border border-purple-100">
                                        <p className="text-[10px] uppercase font-bold text-purple-600 mb-1">SKU</p>
                                        <p className="text-sm font-bold text-purple-900 break-all mt-1">{product.sku || 'N/A'}</p>
                                    </div>
                                </div>

                                {/* Sizes */}
                                <div>
                                    <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                                        <Ruler className="w-4 h-4 text-gray-400" /> Sizes
                                    </h3>
                                    {product.sizes && product.sizes.length > 0 ? (
                                        <div className="flex flex-wrap gap-2">
                                            {product.sizes.map((size, idx) => (
                                                <div
                                                    key={idx}
                                                    className={`px-4 py-2 rounded-xl border flex flex-col items-center min-w-[60px] ${size.stock > 0
                                                        ? 'border-gray-200 bg-white shadow-sm'
                                                        : 'border-gray-100 bg-gray-50 opacity-60'
                                                        }`}
                                                >
                                                    <span className={`text-sm font-black ${size.stock > 0 ? 'text-gray-900' : 'text-gray-400'}`}>
                                                        {size.size}
                                                    </span>
                                                    <span className={`text-[9px] font-bold ${size.stock > 10 ? 'text-green-600' :
                                                        size.stock > 0 ? 'text-amber-500' : 'text-red-500'
                                                        }`}>
                                                        {size.stock} left
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-xs text-gray-400 italic">No sizes mapped.</p>
                                    )}
                                </div>

                                {/* Specifications */}
                                <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100">
                                    <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                                        <Map className="w-4 h-4 text-gray-400" /> Specifications
                                    </h3>
                                    <div className="grid grid-cols-2 gap-y-3 gap-x-4">
                                        <div>
                                            <p className="text-[10px] uppercase font-bold text-gray-500">Gender</p>
                                            <p className="text-sm font-bold text-gray-900 capitalize">{product.gender || '-'}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] uppercase font-bold text-gray-500">Material</p>
                                            <p className="text-sm font-bold text-gray-900">{product.material || '-'}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] uppercase font-bold text-gray-500">Weight</p>
                                            <p className="text-sm font-bold text-gray-900">{product.weight ? `${product.weight} g` : '-'}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] uppercase font-bold text-gray-500">Returns</p>
                                            <p className={`text-sm font-bold ${product.is_returnable ? 'text-green-600' : 'text-red-600'}`}>
                                                {product.is_returnable ? 'Allowed' : 'Not Allowed'}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Description */}
                                {product.description && (
                                    <div>
                                        <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                                            <Tag className="w-4 h-4 text-gray-400" /> Details
                                        </h3>
                                        <div className="text-sm text-gray-600 leading-relaxed max-h-40 overflow-y-auto pr-2 custom-scrollbar whitespace-pre-wrap">
                                            {product.description}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="h-full flex items-center justify-center text-gray-500">
                            Product not found.
                        </div>
                    )}
                </div>

                {/* CSS for scrollbar inside the modal body */}
                <style dangerouslySetInnerHTML={{
                    __html: `
                    .custom-scrollbar::-webkit-scrollbar {
                        width: 4px;
                        height: 4px;
                    }
                    .custom-scrollbar::-webkit-scrollbar-track {
                        background: transparent;
                    }
                    .custom-scrollbar::-webkit-scrollbar-thumb {
                        background: #e5e7eb;
                        border-radius: 4px;
                    }
                    .custom-scrollbar:hover::-webkit-scrollbar-thumb {
                        background: #d1d5db;
                    }
                `}} />
            </div>
        </div>
    )
}

export default ProductViewModal
