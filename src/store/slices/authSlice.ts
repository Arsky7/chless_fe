import { createSlice, PayloadAction } from '@reduxjs/toolkit'

// Tipe data untuk user
export interface User {
  id: number
  name: string
  email: string
  type: 'customer' | 'staff' | 'admin' | 'super_admin'
  avatar?: string
  phone?: string
  email_verified_at?: string
}

// Tipe data untuk state auth
interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  loading: boolean
  error: string | null
}

// Initial state
const initialState: AuthState = {
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: !!localStorage.getItem('token'),
  loading: false,
  error: null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Login success
    loginSuccess: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.user = action.payload.user
      state.token = action.payload.token
      state.isAuthenticated = true
      state.error = null
      
      // Simpan token ke localStorage
      localStorage.setItem('token', action.payload.token)
    },

    // Login failure
    loginFailure: (state, action: PayloadAction<string>) => {
      state.error = action.payload
      state.loading = false
    },

    // Logout
    logout: (state) => {
      state.user = null
      state.token = null
      state.isAuthenticated = false
      
      // Hapus token dari localStorage
      localStorage.removeItem('token')
    },

    // Update user profile
    updateProfile: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload }
      }
    },

    // Set loading
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },

    // Clear error
    clearError: (state) => {
      state.error = null
    },
  },
})

// Export actions
export const {
  loginSuccess,
  loginFailure,
  logout,
  updateProfile,
  setLoading,
  clearError,
} = authSlice.actions

// Export reducer
export default authSlice.reducer