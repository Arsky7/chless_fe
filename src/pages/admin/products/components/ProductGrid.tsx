import { useState } from 'react'
import { Grid, List } from 'lucide-react'
import ProductCard from './ProductCard'
import { Product } from '../types/product.types'

interface ProductGridProps {
  products: Product[]
  totalItems: number
  onViewProduct: (id: number) => void
  onEditProduct: (id: number) => void
  onDeleteProduct: (id: number) => void
}

const ProductGrid = ({
  products,
  totalItems,
  onViewProduct,
  onEditProduct,
  onDeleteProduct,
}: ProductGridProps) => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h3 className="text-lg font-semibold">
          All Products <span className="text-sm font-normal text-gray-500 ml-2">
            ({totalItems} items)
          </span>
        </h3>
        
        {/* View Toggle */}
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
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onView={onViewProduct}
              onEdit={onEditProduct}
              onDelete={onDeleteProduct}
            />
          ))}
        </div>
      ) : (
        // List View (simplified - bisa diimplementasikan nanti)
        <div className="text-center py-12 text-gray-500">
          <List className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p>List view is under construction</p>
          <p className="text-sm mt-2">Will display products in a table format</p>
        </div>
      )}

      {/* Empty State */}
      {products.length === 0 && (
        <div className="text-center py-16">
          <div className="text-gray-400 mb-3 text-6xl">📦</div>
          <h4 className="text-lg font-semibold text-gray-600 mb-2">No products found</h4>
          <p className="text-sm text-gray-500">Try adjusting your filters or create a new product</p>
        </div>
      )}
    </div>
  )
}

export default ProductGrid