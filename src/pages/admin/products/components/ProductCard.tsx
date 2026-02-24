import { Box, ShoppingBag, Star, Edit3, Eye, Trash2 } from 'lucide-react'
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
    <div className="bg-gray-50 rounded-xl border border-gray-200 overflow-hidden hover:-translate-y-1 hover:shadow-md transition-all">
      {/* Product Image Placeholder */}
      <div 
        className="h-48 relative overflow-hidden"
        style={{ backgroundColor: product.colors[0]?.code || '#000' }}
      >
        {/* Color Indicator */}
        <div 
          className="absolute top-4 left-4 w-6 h-6 rounded-full border-2 border-white shadow-md"
          style={{ backgroundColor: product.colors[0]?.code }}
        />
        
        {/* Status Badge */}
        {getStatusBadge(product.status)}
      </div>

      {/* Product Content */}
      <div className="p-5">
        {/* Header */}
        <div className="flex justify-between items-start mb-3">
          <div>
            <h4 className="font-semibold text-gray-900">{product.name}</h4>
            <p className="text-xs text-gray-500 mt-1">
              {getCategoryName(product.category)} • {product.sku}
            </p>
          </div>
          <div className="text-right">
            <div className="font-bold text-gray-900">{product.price_formatted}</div>
            {product.originalPrice && (
              <div className="text-xs text-gray-500 line-through">
                {product.originalPrice_formatted}
              </div>
            )}
          </div>
        </div>

        {/* Details */}
        <div className="flex gap-4 mb-4 text-sm">
          <div className="flex items-center gap-1.5 text-gray-600">
            <Box className="w-4 h-4" />
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

        {/* Colors */}
        <div className="mb-4">
          <p className="text-xs text-gray-500 mb-2">Available Colors:</p>
          <div className="flex gap-2">
            {product.colors.map((color, idx) => (
              <div
                key={idx}
                className="w-6 h-6 rounded-full border-2 border-white shadow-sm cursor-pointer hover:scale-110 transition-transform"
                style={{ backgroundColor: color.code }}
                title={color.name}
              />
            ))}
          </div>
        </div>

        {/* Sizes */}
        <div className="mb-4">
          <p className="text-xs text-gray-500 mb-2">Available Sizes:</p>
          <div className="flex flex-wrap gap-2">
            {product.sizes.map((size, idx) => {
              const isOutOfStock = product.outOfStockSizes.includes(size)
              return (
                <span
                  key={idx}
                  className={`px-3 py-1 text-xs font-semibold rounded border 
                    ${isOutOfStock 
                      ? 'bg-gray-200 text-gray-400 border-gray-200' 
                      : 'bg-white text-gray-700 border-gray-300'
                    }`}
                >
                  {size}
                </span>
              )
            })}
          </div>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-3 gap-2 mt-4">
          <button
            onClick={() => onEdit(product.id)}
            className="flex items-center justify-center gap-1.5 px-3 py-2 
                     border border-gray-300 rounded-lg hover:bg-yellow-500 
                     hover:text-white hover:border-yellow-500 transition-all text-sm"
          >
            <Edit3 className="w-4 h-4" />
            Edit
          </button>
          <button
            onClick={() => onView(product.id)}
            className="flex items-center justify-center gap-1.5 px-3 py-2 
                     border border-gray-300 rounded-lg hover:bg-blue-500 
                     hover:text-white hover:border-blue-500 transition-all text-sm"
          >
            <Eye className="w-4 h-4" />
            View
          </button>
          <button
            onClick={() => onDelete(product.id)}
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
  )
}

export default ProductCard