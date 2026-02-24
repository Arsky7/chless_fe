import { Shirt, ShoppingBag, Watch, Footprints } from 'lucide-react'
// Atau gunakan Footprints, Shoe tidak tersedia di lucide-react
import { Category } from '../types/product.types'

interface CategoryGridProps {
  categories: Category[]
  onCategoryClick: (categoryId: string) => void
}

const CategoryGrid = ({ categories, onCategoryClick }: CategoryGridProps) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'tshirt': return <Shirt className="w-6 h-6" />
      case 'shopping-bag': return <ShoppingBag className="w-6 h-6" />
      case 'shoe': return <Footprints className="w-6 h-6" /> // Ganti Shoes dengan Footprints
      case 'watch': return <Watch className="w-6 h-6" />
      default: return <ShoppingBag className="w-6 h-6" />
    }
  }

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-8">
      <h3 className="text-lg font-semibold mb-2">Product Categories</h3>
      <p className="text-sm text-gray-500 mb-6">Browse products by category</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {categories.map((category) => (
          <div
            key={category.id}
            onClick={() => onCategoryClick(category.id)}
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
    </div>
  )
}

export default CategoryGrid