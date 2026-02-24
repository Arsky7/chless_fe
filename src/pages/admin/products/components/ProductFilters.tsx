import { useState } from 'react'
import { Filter, RotateCcw, Edit3 } from 'lucide-react'
import { FilterParams } from '../types/product.types'

interface ProductFiltersProps {
  filters: FilterParams
  onFilterChange: (filters: FilterParams) => void
  onApplyFilters: () => void
  onResetFilters: () => void
  onBulkEdit: () => void
}

const ProductFilters = ({
  filters,
  onFilterChange,
  onApplyFilters,
  onResetFilters,
  onBulkEdit,
}: ProductFiltersProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target
    onFilterChange({ ...filters, [name]: value })
  }

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Category Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category
          </label>
          <select
            name="category"
            value={filters.category}
            onChange={handleChange}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg 
                     focus:ring-2 focus:ring-black focus:border-transparent
                     bg-gray-50"
          >
            <option value="all">All Categories</option>
            <option value="tshirts">T-Shirts</option>
            <option value="hoodies">Hoodies</option>
            <option value="jeans">Jeans</option>
            <option value="jackets">Jackets</option>
            <option value="shoes">Shoes</option>
            <option value="accessories">Accessories</option>
          </select>
        </div>

        {/* Stock Status Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Stock Status
          </label>
          <select
            name="status"
            value={filters.status}
            onChange={handleChange}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg 
                     focus:ring-2 focus:ring-black focus:border-transparent
                     bg-gray-50"
          >
            <option value="all">All Status</option>
            <option value="active">In Stock</option>
            <option value="low">Low Stock</option>
            <option value="out">Out of Stock</option>
          </select>
        </div>

        {/* Sort By Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Sort By
          </label>
          <select
            name="sortBy"
            value={filters.sortBy}
            onChange={handleChange}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg 
                     focus:ring-2 focus:ring-black focus:border-transparent
                     bg-gray-50"
          >
            <option value="newest">Newest First</option>
            <option value="popular">Most Popular</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="stock">Stock Level</option>
          </select>
        </div>

        {/* Search Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Search Products
          </label>
          <input
            type="text"
            name="search"
            value={filters.search}
            onChange={handleChange}
            placeholder="Search by name, SKU, or color..."
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg 
                     focus:ring-2 focus:ring-black focus:border-transparent
                     bg-gray-50"
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3 mt-6">
        <button
          onClick={onApplyFilters}
          className="px-6 py-2.5 bg-black text-white rounded-lg 
                   hover:bg-red-600 transition-all font-medium
                   flex items-center gap-2"
        >
          <Filter className="w-4 h-4" />
          Apply Filters
        </button>
        <button
          onClick={onResetFilters}
          className="px-6 py-2.5 border border-gray-300 rounded-lg 
                   hover:bg-gray-50 transition-all font-medium
                   flex items-center gap-2"
        >
          <RotateCcw className="w-4 h-4" />
          Reset
        </button>
        <button
          onClick={onBulkEdit}
          className="px-6 py-2.5 border border-gray-300 rounded-lg 
                   hover:bg-gray-50 transition-all font-medium
                   flex items-center gap-2 ml-auto"
        >
          <Edit3 className="w-4 h-4" />
          Bulk Edit
        </button>
      </div>
    </div>
  )
}

export default ProductFilters