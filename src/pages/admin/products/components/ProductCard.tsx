import { Box, Star, Edit3, Eye, Trash2 } from 'lucide-react'
import { Product } from '../types/product.types'

interface ProductCardProps {
  product: Product
  onView: (id: number) => void
  onEdit: (id: number) => void
  onDelete: (id: number) => void
}

const ProductCard = ({ product, onView, onEdit, onDelete }: ProductCardProps) => {
  const getStatusBadge = (status: Product['status']) => {
    switch (status) {
      case 'active':
        return <span className="absolute top-4 right-4 px-3 py-1 bg-green-500 text-white text-xs font-semibold rounded-full">In Stock</span>
      case 'low':
        return <span className="absolute top-4 right-4 px-3 py-1 bg-yellow-500 text-white text-xs font-semibold rounded-full">Low Stock</span>
      case 'out':
        return <span className="absolute top-4 right-4 px-3 py-1 bg-red-500 text-white text-xs font-semibold rounded-full">Out of Stock</span>
    }
  }

  const getCategoryName = (category: string) => {
    const categories = {
      tshirts: 'T-Shirts',
      hoodies: 'Hoodies',
      jeans: 'Jeans',
      jackets: 'Jackets',
      shoes: 'Shoes',
      accessories: 'Accessories',
    }
    return categories[category as keyof typeof categories] || category
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:-translate-y-2 hover:shadow-xl transition-all duration-300 group flex flex-col h-full shadow-sm">
      {/* Product Image */}
      <div
        className="h-56 relative overflow-hidden"
        style={{ backgroundColor: product.colors && product.colors[0]?.code ? `${product.colors[0].code}22` : '#f3f4f6' }}
      >
        {/* Color Indicator */}
        {product.colors && product.colors[0] && (
          <div
            className="absolute top-4 left-4 w-6 h-6 rounded-full border-2 border-white shadow-md z-10"
            style={{ backgroundColor: product.colors[0].code }}
          />
        )}

        {/* Status Badge */}
        <div className="z-10">
          {getStatusBadge(product.status)}
        </div>

        {/* Placeholder Icon if no image */}
        {!product.image && (
          <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
            <Box className="w-12 h-12 mb-2 opacity-20" />
            <span className="text-[10px] uppercase tracking-widest font-bold opacity-40">No Image</span>
          </div>
        )}

        {product.image && (
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        )}

        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
      </div>

      {/* Product Content */}
      <div className="p-6 flex flex-col flex-1">
        {/* Header */}
        <div className="mb-4">
          <div className="flex justify-between items-start gap-3 min-w-0">
            <h4 className="font-bold text-gray-900 line-clamp-2 flex-1 text-sm leading-tight h-10" title={product.name}>
              {product.name}
            </h4>
            <div className="text-right shrink-0">
              <div className="font-extrabold text-black text-sm">{product.price_formatted}</div>
              {product.originalPrice_formatted && (
                <div className="text-[10px] text-gray-400 line-through mt-0.5">
                  {product.originalPrice_formatted}
                </div>
              )}
            </div>
          </div>
          <div className="inline-flex items-center px-2 py-0.5 rounded bg-gray-100 text-[10px] text-gray-500 mt-2 uppercase tracking-wider font-bold">
            {getCategoryName(product.category)}
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

        {/* Stats bar */}
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

        {/* Sizes (Simplified for grid) */}
        {product.sizes && product.sizes.length > 0 && (
          <div className="flex gap-1 mb-5 flex-wrap">
            {product.sizes.slice(0, 4).map((size, idx) => (
              <span key={idx} className="text-[9px] font-bold border border-gray-100 rounded px-1.5 py-0.5 text-gray-400">
                {size}
              </span>
            ))}
            {product.sizes.length > 4 && (
              <span className="text-[9px] font-bold text-gray-300">+{product.sizes.length - 4}</span>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 mt-auto pt-4 border-t border-gray-50">
          <button
            onClick={() => onEdit(product.id)}
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 
                     bg-gray-50 text-gray-700 rounded-lg hover:bg-black 
                     hover:text-white transition-all duration-300 text-xs font-bold"
          >
            <Edit3 className="w-3.5 h-3.5" />
            Edit
          </button>
          <button
            onClick={() => onView(product.id)}
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 
                     bg-gray-50 text-gray-700 rounded-lg hover:bg-black 
                     hover:text-white transition-all duration-300 text-xs font-bold"
          >
            <Eye className="w-3.5 h-3.5" />
            View
          </button>
          <button
            onClick={() => onDelete(product.id)}
            className="p-2 bg-red-50 text-red-500 rounded-lg hover:bg-red-500 
                     hover:text-white transition-all duration-300"
            title="Delete product"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProductCard