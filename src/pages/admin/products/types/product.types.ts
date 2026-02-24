export interface ProductColor {
  name: string
  code: string
}

export interface Product {
  id: number
  sku: string
  name: string
  category: 'tshirts' | 'hoodies' | 'jeans' | 'jackets' | 'shoes' | 'accessories'
  price: number
  price_formatted: string
  originalPrice?: number
  originalPrice_formatted?: string
  stock: number
  minStock: number
  status: 'active' | 'low' | 'out'
  colors: ProductColor[]
  sizes: string[]
  outOfStockSizes: string[]
  sold: number
  rating: number
  reviews: number
  createdAt: string
  description: string
  image?: string
}

export interface ProductStats {
  total: number
  active: number
  lowStock: number
  outOfStock: number
  totalChange: number
  activePercentage: number
  lowStockChange: number
  outOfStockChange: number
}

export interface Category {
  id: string
  name: string
  icon: string
  count: number
  change: string
  color: string
  bgColor: string
  borderColor: string
}

export interface FilterParams {
  category: string
  status: string
  sortBy: string
  search: string
}

export interface QuickAction {
  id: string
  title: string
  icon: string
  onClick: () => void
}