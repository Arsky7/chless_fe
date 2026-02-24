import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { apiService } from '../../../services/api'
import API_CONFIG from '../../../config/api.config'

// Types
interface ProductImage {
  id?: number
  url: string
  is_main: boolean
  file?: File
}

interface ProductSize {
  size: string
  stock: number
}

interface ProductFormData {
  // Basic Info
  name: string
  category_id: number | ''
  short_description: string
  description: string
  tags: string
  
  // Pricing - HANYA SALE PRICE (base_price DIHAPUS)
  price: number | ''  // Ganti sale_price menjadi price
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
  sizes: ProductSize[]
}

interface Category {
  id: number
  name: string
}

// Response types
interface ApiResponse<T> {
  data: T
  message?: string
  success?: boolean
}

interface CategoryResponse {
  data: Category[]
}

interface ProductResponse {
  data: ProductDetail
}

interface ProductDetail {
  id: number
  name: string
  category_id: number
  short_description?: string
  description?: string
  tags?: string
  price?: number  // Ganti dari base_price
  sale_price?: number
  sale_starts_at?: string
  sale_ends_at?: string
  sku?: string
  gender?: 'men' | 'women' | 'unisex'
  material?: string
  care_instructions?: string
  weight?: number
  length?: number
  width?: number
  height?: number
  is_featured?: boolean
  track_inventory?: boolean
  allow_backorders?: boolean
  is_returnable?: boolean
  meta_title?: string
  meta_description?: string
  meta_keywords?: string
  is_active?: boolean
  visibility?: 'public' | 'hidden' | 'private'
  images?: ProductImage[]
  sizes?: ProductSize[]
}

const ProductForm = () => {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const isEditMode = !!id

  // State
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  
  // Product data - tanpa base_price
  const [formData, setFormData] = useState<ProductFormData>({
    // Basic Info
    name: '',
    category_id: '',
    short_description: '',
    description: '',
    tags: '',
    
    // Pricing - HANYA price
    price: '',
    sale_starts_at: '',
    sale_ends_at: '',
    
    // Attributes
    sku: '',
    gender: '',
    material: '',
    care_instructions: '',
    weight: '',
    length: '',
    width: '',
    height: '',
    
    // Options
    is_featured: false,
    track_inventory: true,
    allow_backorders: false,
    is_returnable: true,
    
    // SEO
    meta_title: '',
    meta_description: '',
    meta_keywords: '',
    
    // Status
    is_active: true,
    visibility: 'public',
    
    // Sizes
    sizes: []
  })

  // Images
  const [images, setImages] = useState<ProductImage[]>([])
  const [uploading, setUploading] = useState(false)

  // Available sizes (fixed options)
  const availableSizes = ['S', 'M', 'L', 'XL', 'XXL']

  // Load data
  useEffect(() => {
    fetchCategories()
    if (isEditMode) {
      fetchProduct()
    }
  }, [id])

  // API Calls
  const fetchCategories = async () => {
    try {
      const response = await apiService.get<CategoryResponse>('/admin/categories')
      setCategories(response.data || [])
    } catch (error) {
      console.error('Failed to fetch categories:', error)
      toast.error('Failed to load categories')
    }
  }

  const fetchProduct = async () => {
    try {
      setLoading(true)
      const response = await apiService.get<ProductResponse>(`/admin/products/${id}`)
      const product = response.data
      
      setFormData({
        name: product.name || '',
        category_id: product.category_id || '',
        short_description: product.short_description || '',
        description: product.description || '',
        tags: product.tags || '',
        price: product.price || product.sale_price || '',  // Gunakan price atau sale_price
        sale_starts_at: product.sale_starts_at || '',
        sale_ends_at: product.sale_ends_at || '',
        sku: product.sku || '',
        gender: product.gender || '',
        material: product.material || '',
        care_instructions: product.care_instructions || '',
        weight: product.weight || '',
        length: product.length || '',
        width: product.width || '',
        height: product.height || '',
        is_featured: product.is_featured || false,
        track_inventory: product.track_inventory ?? true,
        allow_backorders: product.allow_backorders || false,
        is_returnable: product.is_returnable ?? true,
        meta_title: product.meta_title || '',
        meta_description: product.meta_description || '',
        meta_keywords: product.meta_keywords || '',
        is_active: product.is_active ?? true,
        visibility: product.visibility || 'public',
        sizes: product.sizes || []
      })

      if (product.images) {
        setImages(product.images)
      }

    } catch (error) {
      toast.error('Failed to load product')
      navigate('/admin/products')
    } finally {
      setLoading(false)
    }
  }

  // Handlers
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }))
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    setUploading(true)
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      
      const reader = new FileReader()
      reader.onloadend = () => {
        setImages(prev => [...prev, {
          url: reader.result as string,
          is_main: prev.length === 0,
          file: file
        }])
      }
      reader.readAsDataURL(file)
    }
    
    setUploading(false)
  }

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index))
  }

  const setMainImage = (index: number) => {
    setImages(prev => prev.map((img, i) => ({
      ...img,
      is_main: i === index
    })))
  }

  // Size handlers
  const addSize = () => {
    const usedSizes = formData.sizes.map(s => s.size)
    const availableSize = availableSizes.find(size => !usedSizes.includes(size))
    
    if (availableSize) {
      setFormData(prev => ({
        ...prev,
        sizes: [...prev.sizes, { size: availableSize, stock: 0 }]
      }))
    } else {
      toast.error('All sizes already added')
    }
  }

  const removeSize = (index: number) => {
    setFormData(prev => ({
      ...prev,
      sizes: prev.sizes.filter((_, i) => i !== index)
    }))
  }

  const updateSizeStock = (index: number, stock: number) => {
    setFormData(prev => ({
      ...prev,
      sizes: prev.sizes.map((size, i) => 
        i === index ? { ...size, stock } : size
      )
    }))
  }

  // Handle submit - TANPA validasi base_price
  const handleSubmit = async (status: 'draft' | 'published' = 'published') => {
    // Validasi dasar
    if (!formData.name) {
      toast.error('Product name is required')
      return
    }

    if (!formData.category_id) {
      toast.error('Category is required')
      return
    }

    if (!formData.price) {
      toast.error('Price is required')
      return
    }

    if (formData.sizes.length === 0) {
      toast.error('At least one size is required')
      return
    }

    try {
      setSaving(true)

      const submitData = new FormData()
      
      // Basic info
      submitData.append('name', formData.name)
      submitData.append('category_id', String(formData.category_id))
      submitData.append('short_description', formData.short_description || '')
      submitData.append('description', formData.description || '')
      submitData.append('tags', formData.tags || '')
      
      // Pricing - HANYA price (bukan base_price)
      submitData.append('base_price', String(formData.price))
      
      // Sale price (optional)
      if (formData.sale_starts_at || formData.sale_ends_at) {
        // Jika ada sale period, price dianggap sebagai sale_price
        submitData.append('sale_price', String(formData.price))
      }
      
      if (formData.sale_starts_at) submitData.append('sale_starts_at', formData.sale_starts_at)
      if (formData.sale_ends_at) submitData.append('sale_ends_at', formData.sale_ends_at)
      
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
      submitData.append('is_active', status === 'published' ? '1' : '0')
      submitData.append('visibility', formData.visibility)

      // Sizes
      submitData.append('sizes', JSON.stringify(formData.sizes))

      // Images
      images.forEach((img, index) => {
        if (img.file) {
          submitData.append(`images[${index}]`, img.file)
          submitData.append(`images_main[${index}]`, img.is_main ? '1' : '0')
        }
      })

      // Log untuk debugging
      console.log('Submitting data:')
      for (let [key, value] of submitData.entries()) {
        console.log(key, value)
      }

      let response: ApiResponse<{ id: number }>
      if (isEditMode) {
        response = await apiService.postForm<ApiResponse<{ id: number }>>(`/admin/products/${id}?_method=PUT`, submitData)
      } else {
        response = await apiService.postForm<ApiResponse<{ id: number }>>('/admin/products', submitData)
      }

      toast.success(`Product ${isEditMode ? 'updated' : 'created'} successfully`)
      
      if (status === 'published') {
        navigate('/admin/products')
      } else {
        if (!isEditMode && response.data?.id) {
          navigate(`/admin/products/${response.data.id}/edit`)
        }
      }

    } catch (error: any) {
      console.error('Error response:', error.response?.data)
      
      if (error.response?.status === 422) {
        const errors = error.response.data.errors
        Object.keys(errors).forEach(key => {
          errors[key].forEach((msg: string) => {
            toast.error(`${key}: ${msg}`)
          })
        })
      } else {
        toast.error(error.response?.data?.message || 'Failed to save product')
      }
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ff4d6d]"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <a href="/admin" className="hover:text-[#ff4d6d]">Dashboard</a>
        <span>›</span>
        <a href="/admin/products" className="hover:text-[#ff4d6d]">Products</a>
        <span>›</span>
        <span className="text-gray-900 font-medium">
          {isEditMode ? 'Edit Product' : 'Add New Product'}
        </span>
      </div>

      {/* Page Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">
          {isEditMode ? '✏️ Edit Product' : '➕ Add New Product'}
        </h1>
        <div className="flex gap-3">
          <button
            onClick={() => handleSubmit('draft')}
            disabled={saving}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 disabled:opacity-50"
          >
            💾 Save Draft
          </button>
          <button
            onClick={() => handleSubmit('published')}
            disabled={saving}
            className="px-4 py-2 bg-[#ff4d6d] text-white rounded-lg text-sm font-medium hover:bg-[#e6304f] disabled:opacity-50"
          >
            {saving ? 'Saving...' : '🚀 Publish Product'}
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - 2/3 width */}
        <div className="lg:col-span-2 space-y-6">

          {/* Basic Information */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <h3 className="font-semibold">📝 Basic Information</h3>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 required">
                  Product Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ff4d6d] focus:border-transparent"
                  placeholder="e.g. Oversized T-Shirt"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 required">
                  Category
                </label>
                <select
                  name="category_id"
                  value={formData.category_id}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ff4d6d] focus:border-transparent"
                >
                  <option value="">Select category...</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Short Description
                </label>
                <input
                  type="text"
                  name="short_description"
                  value={formData.short_description}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ff4d6d] focus:border-transparent"
                  placeholder="Brief product description (appears on product cards)"
                />
                <p className="text-xs text-gray-500 mt-1">Max 160 characters — shown on product listing cards</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={6}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ff4d6d] focus:border-transparent"
                  placeholder="Detailed product description..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product Tags
                </label>
                <input
                  type="text"
                  name="tags"
                  value={formData.tags}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ff4d6d] focus:border-transparent"
                  placeholder="Add tags separated by comma (e.g. denim, jacket, oversized, streetwear)"
                />
                <p className="text-xs text-gray-500 mt-1">Tags help customers find your product in search</p>
              </div>
            </div>
          </div>

          {/* Product Images */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
              <h3 className="font-semibold">🖼️ Product Images</h3>
              <span className="text-xs text-gray-500">First image = primary image</span>
            </div>
            <div className="p-6">
              <div
                onClick={() => document.getElementById('image-upload')?.click()}
                className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:border-[#ff4d6d] hover:bg-pink-50 transition-colors"
              >
                <div className="text-4xl mb-3">📸</div>
                <div className="font-medium text-gray-900 mb-1">Click to upload or drag & drop</div>
                <div className="text-sm text-gray-500">PNG, JPG, WEBP — Max 5MB each — Min 800x1000px recommended</div>
                <input
                  id="image-upload"
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  disabled={uploading}
                />
              </div>

              {images.length > 0 && (
                <div className="grid grid-cols-4 gap-3 mt-4">
                  {images.map((img, idx) => (
                    <div key={idx} className="relative aspect-[3/4] bg-gray-100 rounded-lg border-2 overflow-hidden group">
                      <img
                        src={img.url}
                        alt={`Product ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                      {img.is_main && (
                        <span className="absolute bottom-2 left-2 bg-[#ff4d6d] text-white text-xs px-2 py-1 rounded font-bold">
                          PRIMARY
                        </span>
                      )}
                      <button
                        onClick={() => removeImage(idx)}
                        className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-sm opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        ×
                      </button>
                      {!img.is_main && (
                        <button
                          onClick={() => setMainImage(idx)}
                          className="absolute bottom-2 right-2 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                          title="Set as primary"
                        >
                          ★
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
              <p className="text-xs text-gray-500 mt-3">💡 Drag to reorder • Click star to set as primary image</p>
            </div>
          </div>

          {/* Pricing - TANPA Cost Price */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <h3 className="font-semibold">💰 Pricing</h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1 required">
                    Price
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">Rp</span>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ff4d6d] focus:border-transparent"
                      placeholder="0"
                      required
                    />
                  </div>
                </div>
                
                <div className="col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Sale Period (Optional)
                  </label>
                  <div className="space-y-2">
                    <input
                      type="date"
                      name="sale_starts_at"
                      value={formData.sale_starts_at}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ff4d6d] focus:border-transparent"
                      placeholder="Start date"
                    />
                    <input
                      type="date"
                      name="sale_ends_at"
                      value={formData.sale_ends_at}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ff4d6d] focus:border-transparent"
                      placeholder="End date"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Set period for special price</p>
                </div>
              </div>
            </div>
          </div>

          {/* Sizes */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
              <h3 className="font-semibold">📏 Product Sizes</h3>
              <button
                type="button"
                onClick={addSize}
                className="text-sm text-[#ff4d6d] hover:text-[#e6304f] font-medium"
              >
                + Add Size
              </button>
            </div>
            <div className="p-6">
              {formData.sizes.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No sizes added yet. Click "Add Size" to add product sizes.
                </div>
              ) : (
                <div className="space-y-3">
                  {formData.sizes.map((size, index) => (
                    <div key={index} className="flex gap-3 items-center">
                      <div className="w-24 px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg font-medium">
                        {size.size}
                      </div>
                      <input
                        type="number"
                        placeholder="Stock"
                        value={size.stock}
                        onChange={(e) => updateSizeStock(index, parseInt(e.target.value) || 0)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ff4d6d] focus:border-transparent"
                        min="0"
                      />
                      <button
                        onClick={() => removeSize(index)}
                        className="text-red-500 hover:text-red-700 px-3"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <p className="text-xs text-gray-500 mt-3">
                Available sizes: S, M, L, XL, XXL. Add each size with its stock quantity.
              </p>
            </div>
          </div>

          {/* Shipping */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <h3 className="font-semibold">🚚 Shipping & Dimensions</h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Weight (gram)</label>
                  <input
                    type="number"
                    name="weight"
                    value={formData.weight}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ff4d6d] focus:border-transparent"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ff4d6d] focus:border-transparent"
                  >
                    <option value="">Select gender...</option>
                    <option value="men">Men</option>
                    <option value="women">Women</option>
                    <option value="unisex">Unisex</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Length (cm)</label>
                  <input
                    type="number"
                    name="length"
                    value={formData.length}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ff4d6d] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Width (cm)</label>
                  <input
                    type="number"
                    name="width"
                    value={formData.width}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ff4d6d] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Height (cm)</label>
                  <input
                    type="number"
                    name="height"
                    value={formData.height}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ff4d6d] focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* SEO */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <h3 className="font-semibold">🔍 SEO Settings</h3>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">URL Slug</label>
                <div className="flex">
                  <span className="inline-flex items-center px-3 bg-gray-100 border border-r-0 border-gray-300 rounded-l-lg text-sm text-gray-500">
                    {API_CONFIG.appUrl}/products/
                  </span>
                  <input
                    type="text"
                    name="slug"
                    value={formData.name?.toLowerCase().replace(/\s+/g, '-')}
                    onChange={handleInputChange}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-r-lg focus:ring-2 focus:ring-[#ff4d6d] focus:border-transparent"
                    placeholder="product-slug"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Meta Title</label>
                <input
                  type="text"
                  name="meta_title"
                  value={formData.meta_title}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ff4d6d] focus:border-transparent"
                  placeholder="Meta title for SEO"
                />
                <p className="text-xs text-gray-500 mt-1">Recommended: 50-60 characters</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Meta Description</label>
                <textarea
                  name="meta_description"
                  value={formData.meta_description}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ff4d6d] focus:border-transparent"
                  placeholder="Meta description for SEO"
                />
                <p className="text-xs text-gray-500 mt-1">Recommended: 150-160 characters</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - 1/3 width */}
        <div className="space-y-6">

          {/* Publish Status */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <h3 className="font-semibold">🚀 Publish</h3>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  name="is_active"
                  value={String(formData.is_active)}
                  onChange={(e) => setFormData(prev => ({ ...prev, is_active: e.target.value === 'true' }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ff4d6d] focus:border-transparent"
                >
                  <option value="false">Draft</option>
                  <option value="true">Published</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Visibility</label>
                <select
                  name="visibility"
                  value={formData.visibility}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ff4d6d] focus:border-transparent"
                >
                  <option value="public">Public</option>
                  <option value="hidden">Hidden</option>
                  <option value="private">Private</option>
                </select>
              </div>
              <button
                onClick={() => handleSubmit('published')}
                disabled={saving}
                className="w-full px-4 py-2 bg-[#ff4d6d] text-white rounded-lg font-medium hover:bg-[#e6304f] disabled:opacity-50"
              >
                {saving ? 'Saving...' : '🚀 Publish Product'}
              </button>
            </div>
          </div>

          {/* Product Options */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <h3 className="font-semibold">⚙️ Product Options</h3>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Featured Product</div>
                  <div className="text-xs text-gray-500">Show on homepage</div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="is_featured"
                    checked={formData.is_featured}
                    onChange={handleInputChange}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-pink-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#ff4d6d]"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Track Inventory</div>
                  <div className="text-xs text-gray-500">Monitor stock levels</div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="track_inventory"
                    checked={formData.track_inventory}
                    onChange={handleInputChange}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-pink-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#ff4d6d]"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Allow Backorders</div>
                  <div className="text-xs text-gray-500">Sell when out of stock</div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="allow_backorders"
                    checked={formData.allow_backorders}
                    onChange={handleInputChange}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-pink-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#ff4d6d]"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Returnable</div>
                  <div className="text-xs text-gray-500">Allow return requests</div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="is_returnable"
                    checked={formData.is_returnable}
                    onChange={handleInputChange}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-pink-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#ff4d6d]"></div>
                </label>
              </div>
            </div>
          </div>

          {/* Attributes */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <h3 className="font-semibold">📋 Attributes</h3>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">SKU</label>
                <input
                  type="text"
                  name="sku"
                  value={formData.sku}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ff4d6d] focus:border-transparent"
                  placeholder="Product SKU"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Material</label>
                <input
                  type="text"
                  name="material"
                  value={formData.material}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ff4d6d] focus:border-transparent"
                  placeholder="e.g. 100% Cotton Denim"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Care Instructions</label>
                <input
                  type="text"
                  name="care_instructions"
                  value={formData.care_instructions}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ff4d6d] focus:border-transparent"
                  placeholder="e.g. Machine wash cold"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductForm