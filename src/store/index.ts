import { configureStore } from '@reduxjs/toolkit'
import cartReducer from './slices/cartSlice'
import authReducer from './slices/authSlice'
import productReducer from './slices/productSlice'

// Configure store
export const store = configureStore({
  reducer: {
    cart: cartReducer,
    auth: authReducer,
    products: productReducer,
  },
  // Middleware untuk development
  devTools: import.meta.env.MODE !== 'production',
})

// Export types
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch