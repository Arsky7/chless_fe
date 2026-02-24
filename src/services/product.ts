// services/product.ts
import { apiService } from './api'
import type { 
  Product, 
  ProductFormData, 
  ProductListParams, 
  ProductListResponse,
  ApiResponse 
} from '@/types/product'

export const productService = {
  /**
   * Get list of products with filtering and pagination
   */
  getProducts: async (params?: ProductListParams): Promise<ProductListResponse> => {
    try {
      const queryParams: Record<string, string> = {}
      
      if (params?.page) queryParams.page = String(params.page)
      if (params?.per_page) queryParams.per_page = String(params.per_page)
      if (params?.search) queryParams.search = params.search
      if (params?.category && params.category !== 'all') {
        queryParams.category = String(params.category)
      }
      if (params?.status && params.status !== 'all') {
        queryParams.status = params.status
      }
      if (params?.sortBy) {
        queryParams.sortBy = params.sortBy
        queryParams.sortOrder = params.sortOrder || 'desc'
      }
      
      const response = await apiService.get<ProductListResponse>('/admin/products', queryParams)
      return response
      
    } catch (error) {
      console.error('[ProductService] Failed to fetch products:', error)
      throw error
    }
  },

  /**
   * Get single product by ID
   */
  getProduct: async (id: number): Promise<Product> => {
    try {
      const response = await apiService.get<ApiResponse<Product>>(`/admin/products/${id}`)
      
      if (response.success && response.data) {
        return response.data
      }
      
      throw new Error('Failed to load product')
      
    } catch (error) {
      console.error(`[ProductService] Failed to fetch product ${id}:`, error)
      throw error
    }
  },

  /**
   * Create new product
   */
  createProduct: async (formData: ProductFormData, images: File[] = []): Promise<{ id: number }> => {
    try {
      const submitData = new FormData()
      
      // Basic info
      submitData.append('name', formData.name)
      submitData.append('category_id', String(formData.category_id))
      submitData.append('short_description', formData.short_description || '')
      submitData.append('description', formData.description || '')
      submitData.append('tags', formData.tags || '')
      
      // 🔴 PERUBAHAN: Kirim price (bukan base_price)
      submitData.append('price', String(formData.price))
      
      // Sale period (optional)
      if (formData.sale_starts_at) {
        submitData.append('sale_starts_at', formData.sale_starts_at)
        // Jika ada sale period, price dianggap sebagai sale_price
        submitData.append('sale_price', String(formData.price))
      }
      
      if (formData.sale_ends_at) {
        submitData.append('sale_ends_at', formData.sale_ends_at)
      }
      
      // Attributes
      if (formData.sku) submitData.append('sku', formData.sku)
      if (formData.gender) submitData.append('gender', formData.gender)
      if (formData.material) submitData.append('material', formData.material)
      if (formData.care_instructions) submitData.append('care_instructions', formData.care_instructions)
      if (formData.weight) submitData.append('weight', String(formData.weight))
      if (formData.length) submitData.append('length', String(formData.length))
      if (formData.width) submitData.append('width', String(formData.width))
      if (formData.height) submitData.append('height', String(formData.height))
      
      // Options
      submitData.append('is_featured', formData.is_featured ? '1' : '0')
      submitData.append('track_inventory', formData.track_inventory ? '1' : '0')
      submitData.append('allow_backorders', formData.allow_backorders ? '1' : '0')
      submitData.append('is_returnable', formData.is_returnable ? '1' : '0')
      
      // SEO
      if (formData.meta_title) submitData.append('meta_title', formData.meta_title)
      if (formData.meta_description) submitData.append('meta_description', formData.meta_description)
      if (formData.meta_keywords) submitData.append('meta_keywords', formData.meta_keywords)
      
      // Status
      submitData.append('is_active', formData.is_active ? '1' : '0')
      submitData.append('visibility', formData.visibility)

      // Sizes
      submitData.append('sizes', JSON.stringify(formData.sizes))

      // Images
      images.forEach((file, index) => {
        submitData.append(`images[${index}]`, file)
      })

      const response = await apiService.postForm<ApiResponse<{ id: number }>>('/admin/products', submitData)
      
      if (response.success && response.data) {
        return response.data
      }
      
      throw new Error(response.message || 'Failed to create product')
      
    } catch (error) {
      console.error('[ProductService] Failed to create product:', error)
      throw error
    }
  },

  /**
   * Update existing product
   */
  updateProduct: async (id: number, formData: ProductFormData, images: File[] = []): Promise<{ id: number }> => {
    try {
      const submitData = new FormData()
      
      // Basic info
      submitData.append('name', formData.name)
      submitData.append('category_id', String(formData.category_id))
      submitData.append('short_description', formData.short_description || '')
      submitData.append('description', formData.description || '')
      submitData.append('tags', formData.tags || '')
      
      // 🔴 PERUBAHAN: Kirim price (bukan base_price)
      submitData.append('price', String(formData.price))
      
      // Sale period
      if (formData.sale_starts_at) {
        submitData.append('sale_starts_at', formData.sale_starts_at)
        submitData.append('sale_price', String(formData.price))
      }
      
      if (formData.sale_ends_at) {
        submitData.append('sale_ends_at', formData.sale_ends_at)
      }
      
      // Attributes
      if (formData.sku) submitData.append('sku', formData.sku)
      if (formData.gender) submitData.append('gender', formData.gender)
      if (formData.material) submitData.append('material', formData.material)
      if (formData.care_instructions) submitData.append('care_instructions', formData.care_instructions)
      if (formData.weight) submitData.append('weight', String(formData.weight))
      if (formData.length) submitData.append('length', String(formData.length))
      if (formData.width) submitData.append('width', String(formData.width))
      if (formData.height) submitData.append('height', String(formData.height))
      
      // Options
      submitData.append('is_featured', formData.is_featured ? '1' : '0')
      submitData.append('track_inventory', formData.track_inventory ? '1' : '0')
      submitData.append('allow_backorders', formData.allow_backorders ? '1' : '0')
      submitData.append('is_returnable', formData.is_returnable ? '1' : '0')
      
      // SEO
      if (formData.meta_title) submitData.append('meta_title', formData.meta_title)
      if (formData.meta_description) submitData.append('meta_description', formData.meta_description)
      if (formData.meta_keywords) submitData.append('meta_keywords', formData.meta_keywords)
      
      // Status
      submitData.append('is_active', formData.is_active ? '1' : '0')
      submitData.append('visibility', formData.visibility)

      // Sizes
      submitData.append('sizes', JSON.stringify(formData.sizes))

      // Images
      images.forEach((file, index) => {
        submitData.append(`images[${index}]`, file)
      })

      // 🔴 PENTING: Untuk update, tambahkan _method=PUT
      const response = await apiService.postForm<ApiResponse<{ id: number }>>(
        `/admin/products/${id}?_method=PUT`, 
        submitData
      )
      
      if (response.success && response.data) {
        return response.data
      }
      
      throw new Error(response.message || 'Failed to update product')
      
    } catch (error) {
      console.error(`[ProductService] Failed to update product ${id}:`, error)
      throw error
    }
  },

  /**
   * Delete product
   */
  deleteProduct: async (id: number): Promise<boolean> => {
    try {
      const response = await apiService.delete<ApiResponse<null>>(`/admin/products/${id}`)
      
      if (response.success) {
        return true
      }
      
      return false
      
    } catch (error) {
      console.error(`[ProductService] Failed to delete product ${id}:`, error)
      throw error
    }
  },

  /**
   * Bulk delete products
   */
  bulkDeleteProducts: async (ids: number[]): Promise<boolean> => {
    try {
      const response = await apiService.post<ApiResponse<null>>('/admin/products/bulk-delete', { ids })
      
      if (response.success) {
        return true
      }
      
      return false
      
    } catch (error) {
      console.error('[ProductService] Failed to bulk delete products:', error)
      throw error
    }
  },

  /**
   * Update product stock
   */
  updateStock: async (id: number, sizes: Array<{ size: string; stock: number }>): Promise<boolean> => {
    try {
      const response = await apiService.put<ApiResponse<null>>(`/admin/products/${id}/stock`, { sizes })
      
      if (response.success) {
        return true
      }
      
      return false
      
    } catch (error) {
      console.error(`[ProductService] Failed to update stock for product ${id}:`, error)
      throw error
    }
  },

  /**
   * Toggle featured status
   */
  toggleFeatured: async (id: number): Promise<boolean> => {
    try {
      const response = await apiService.patch<ApiResponse<{ is_featured: boolean }>>(
        `/admin/products/${id}/toggle-featured`
      )
      
      if (response.success) {
        return true
      }
      
      return false
      
    } catch (error) {
      console.error(`[ProductService] Failed to toggle featured for product ${id}:`, error)
      throw error
    }
  },

  /**
   * Toggle active status
   */
  toggleActive: async (id: number): Promise<boolean> => {
    try {
      const response = await apiService.patch<ApiResponse<{ is_active: boolean }>>(
        `/admin/products/${id}/toggle-active`
      )
      
      if (response.success) {
        return true
      }
      
      return false
      
    } catch (error) {
      console.error(`[ProductService] Failed to toggle active for product ${id}:`, error)
      throw error
    }
  },

  /**
   * Duplicate product
   */
  duplicateProduct: async (id: number): Promise<{ id: number }> => {
    try {
      const response = await apiService.post<ApiResponse<{ id: number }>>(`/admin/products/${id}/duplicate`)
      
      if (response.success && response.data) {
        return response.data
      }
      
      throw new Error('Failed to duplicate product')
      
    } catch (error) {
      console.error(`[ProductService] Failed to duplicate product ${id}:`, error)
      throw error
    }
  }
}