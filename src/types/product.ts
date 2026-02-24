// types/product.ts
export interface Product {
  id: number
  name: string
  slug: string
  sku: string
  category_id: number
  category?: {
    id: number
    name: string
    slug: string
  }
  
  // 🔴 PERUBAHAN: Hanya price (base_price dihapus)
  price: number
  sale_price?: number | null
  sale_starts_at?: string | null
  sale_ends_at?: string | null
  
  price_formatted: string
  sale_price_formatted?: string
  discount_percentage?: number
  is_on_sale: boolean
  
  short_description?: string
  description?: string
  tags?: string
  
  gender?: 'men' | 'women' | 'unisex'
  material?: string
  care_instructions?: string
  
  weight?: number
  length?: number
  width?: number
  height?: number
  
  is_featured: boolean
  track_inventory: boolean
  allow_backorders: boolean
  is_returnable: boolean
  
  meta_title?: string
  meta_description?: string
  meta_keywords?: string
  
  is_active: boolean
  visibility: 'public' | 'hidden' | 'private'
  
  images?: ProductImage[]
  sizes?: ProductSize[]
  
  total_stock: number
  stock_status: 'in_stock' | 'low_stock' | 'out_of_stock'
  
  created_at: string
  updated_at: string
}

export interface ProductImage {
  id: number
  url: string
  path: string
  filename: string
  is_main: boolean
  sort_order: number
}

export interface ProductSize {
  id: number
  product_id: number
  size: string
  stock: number
  reserved_stock: number
  available_stock: number
}

export interface ProductFormData {
  // Basic Info
  name: string
  category_id: number | ''
  short_description: string
  description: string
  tags: string
  
  // Pricing - HANYA price
  price: number | ''
  sale_starts_at: string
  sale_ends_at: string
  
  // Attributes
  sku: string
  gender: 'men' | 'women' | 'unisex' | ''
  material: string
  care_instructions: string
  weight: number | ''
  length: number | ''
  width: number | ''
  height: number | ''
  
  // Options
  is_featured: boolean
  track_inventory: boolean
  allow_backorders: boolean
  is_returnable: boolean
  
  // SEO
  meta_title: string
  meta_description: string
  meta_keywords: string
  
  // Status
  is_active: boolean
  visibility: 'public' | 'hidden' | 'private'
  
  // Sizes
  sizes: Array<{
    size: string
    stock: number
  }>
}

export interface ProductListParams {
  page?: number
  per_page?: number
  search?: string
  category?: string | number
  status?: 'all' | 'active' | 'low' | 'out'
  sortBy?: 'newest' | 'popular' | 'price-low' | 'price-high' | 'stock'
  sortOrder?: 'asc' | 'desc'
}

export interface ProductListResponse {
  data: Product[]
  current_page: number
  last_page: number
  per_page: number
  total: number
  from: number
  to: number
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  message?: string
  errors?: Record<string, string[]>
}