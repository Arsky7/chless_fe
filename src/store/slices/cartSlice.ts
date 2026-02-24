import { createSlice, PayloadAction } from '@reduxjs/toolkit'

// Tipe data untuk item di cart
export interface CartItem {
  id: number
  productSizeId: number
  productId: number
  name: string
  size: string
  price: number
  quantity: number
  image: string
  maxQuantity?: number
}

// Tipe data untuk state cart
interface CartState {
  items: CartItem[]
  loading: boolean
  error: string | null
  subtotal: number
  total: number
  discountAmount: number
  couponCode: string | null
}

// Initial state
const initialState: CartState = {
  items: [],
  loading: false,
  error: null,
  subtotal: 0,
  total: 0,
  discountAmount: 0,
  couponCode: null,
}

// Helper function untuk menghitung subtotal
const calculateSubtotal = (items: CartItem[]): number => {
  return items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
}

// Cart slice
const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    // Add item to cart
    addToCart: (state, action: PayloadAction<CartItem>) => {
      const existingItem = state.items.find(
        item => item.productSizeId === action.payload.productSizeId
      )

      if (existingItem) {
        // Jika item sudah ada, tambah quantity
        const newQuantity = existingItem.quantity + action.payload.quantity
        if (action.payload.maxQuantity && newQuantity > action.payload.maxQuantity) {
          state.error = `Maximum quantity is ${action.payload.maxQuantity}`
          return
        }
        existingItem.quantity = newQuantity
      } else {
        // Jika item baru, tambahkan ke array
        state.items.push(action.payload)
      }

      // Update subtotal
      state.subtotal = calculateSubtotal(state.items)
      state.total = state.subtotal - state.discountAmount
      state.error = null
    },

    // Remove item from cart
    removeFromCart: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter(item => item.productSizeId !== action.payload)
      
      // Update subtotal
      state.subtotal = calculateSubtotal(state.items)
      state.total = state.subtotal - state.discountAmount
    },

    // Update item quantity
    updateQuantity: (state, action: PayloadAction<{ productSizeId: number; quantity: number }>) => {
      const item = state.items.find(item => item.productSizeId === action.payload.productSizeId)
      
      if (item) {
        // Validasi max quantity
        if (item.maxQuantity && action.payload.quantity > item.maxQuantity) {
          state.error = `Maximum quantity is ${item.maxQuantity}`
          return
        }

        if (action.payload.quantity <= 0) {
          // Jika quantity 0, hapus item
          state.items = state.items.filter(i => i.productSizeId !== action.payload.productSizeId)
        } else {
          // Update quantity
          item.quantity = action.payload.quantity
        }

        // Update subtotal
        state.subtotal = calculateSubtotal(state.items)
        state.total = state.subtotal - state.discountAmount
        state.error = null
      }
    },

    // Apply coupon
    applyCoupon: (state, action: PayloadAction<{ code: string; discountAmount: number }>) => {
      state.couponCode = action.payload.code
      state.discountAmount = action.payload.discountAmount
      state.total = state.subtotal - state.discountAmount
    },

    // Remove coupon
    removeCoupon: (state) => {
      state.couponCode = null
      state.discountAmount = 0
      state.total = state.subtotal
    },

    // Clear cart
    clearCart: (state) => {
      state.items = []
      state.subtotal = 0
      state.total = 0
      state.discountAmount = 0
      state.couponCode = null
      state.error = null
    },

    // Set loading state
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },

    // Set error
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload
    },

    // Clear error
    clearError: (state) => {
      state.error = null
    },
  },
})

// Export actions
export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  applyCoupon,
  removeCoupon,
  clearCart,
  setLoading,
  setError,
  clearError,
} = cartSlice.actions

// Export reducer
export default cartSlice.reducer