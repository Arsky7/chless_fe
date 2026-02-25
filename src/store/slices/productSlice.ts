import { createSlice, PayloadAction } from '@reduxjs/toolkit'

// Tipe data untuk product
export interface Product {
  id: number
  name: string
  slug: string
  description: string
  base_price: number
  sale_price: number | null
  color_name: string
  color_hex: string
  material: string | null
  images: ProductImage[]
  sizes: ProductSize[]
  category: Category | null
  is_active: boolean
  is_featured: boolean
}

export interface ProductImage {
  id: number
  url: string
  is_main: boolean
}

export interface ProductSize {
  id: number
  size: string
  sku: string
  price: number | null
  stock: number
  is_active: boolean
}

export interface Category {
  id: number
  name: string
  slug: string
}



// Tipe data untuk state product
interface ProductState {
  products: Product[]
  featuredProducts: Product[]
  currentProduct: Product | null
  categories: Category[]
  loading: boolean
  error: string | null
  totalPages: number
  currentPage: number
  filters: {
    category_id?: number
    min_price?: number
    max_price?: number
    color?: string
    size?: string
    search?: string
    sort_by?: string
    sort_order?: 'asc' | 'desc'
  }
}

// Initial state
const initialState: ProductState = {
  products: [],
  featuredProducts: [],
  currentProduct: null,
  categories: [],
  loading: false,
  error: null,
  totalPages: 1,
  currentPage: 1,
  filters: {},
}

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    // Set products list
    setProducts: (state, action: PayloadAction<{
      products: Product[]
      totalPages: number
      currentPage: number
    }>) => {
      state.products = action.payload.products
      state.totalPages = action.payload.totalPages
      state.currentPage = action.payload.currentPage
      state.loading = false
    },

    // Set featured products
    setFeaturedProducts: (state, action: PayloadAction<Product[]>) => {
      state.featuredProducts = action.payload
    },

    // Set current product
    setCurrentProduct: (state, action: PayloadAction<Product | null>) => {
      state.currentProduct = action.payload
      state.loading = false
    },

    // Set categories
    setCategories: (state, action: PayloadAction<Category[]>) => {
      state.categories = action.payload
    },



    // Update filters
    setFilters: (state, action: PayloadAction<Partial<ProductState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload }
    },

    // Clear filters
    clearFilters: (state) => {
      state.filters = {}
    },

    // Set loading
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },

    // Set error
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload
      state.loading = false
    },

    // Clear error
    clearError: (state) => {
      state.error = null
    },
  },
})

// Export actions
export const {
  setProducts,
  setFeaturedProducts,
  setCurrentProduct,
  setCategories,
  setFilters,
  clearFilters,
  setLoading,
  setError,
  clearError,
} = productSlice.actions

// Export reducer
export default productSlice.reducer