import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import API_CONFIG, { API_ENDPOINTS, getApiUrl, isDevelopment } from '../config/api.config'

// Storage keys
export const STORAGE_KEYS = {
  TOKEN: 'token',
  USER: 'user',
} as const

// Types
export interface ApiResponse<T = any> {
  data: T
  message?: string
  meta?: any
}

export interface ApiError {
  message: string
  errors?: Record<string, string[]>
  status?: number
}

// Create axios instance
export const api: AxiosInstance = axios.create({
  baseURL: API_CONFIG.apiUrl,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  },
  timeout: API_CONFIG.apiTimeout,
  withCredentials: true,
})

// Logger
const logger = {
  info: (...args: any[]): void => {
    if (API_CONFIG.debug) {
      console.log('[INFO]:', ...args)
    }
  },
  error: (...args: any[]): void => {
    console.error('[ERROR]:', ...args)
  },
  debug: (...args: any[]): void => {
    if (API_CONFIG.debug && API_CONFIG.logLevel === 'debug') {
      console.debug('[DEBUG]:', ...args)
    }
  }
}

// Request interceptor
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN)
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    
    // Untuk CSRF protection di Laravel
    const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content')
    if (csrfToken) {
      config.headers['X-CSRF-TOKEN'] = csrfToken
    }
    
    logger.debug('Request:', {
      method: config.method?.toUpperCase(),
      url: config.url,
      data: config.data,
      params: config.params
    })
    
    return config
  },
  (error: any): Promise<never> => {
    logger.error('Request Error:', error)
    return Promise.reject(error)
  }
)

// Response interceptor
api.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => {
    logger.debug('Response:', {
      status: response.status,
      url: response.config.url,
      data: response.data
    })
    return response
  },
  async (error: any): Promise<never> => {
    if (error.response) {
      const { status, data } = error.response
      
      logger.error('API Error:', {
        url: error.config?.url,
        status,
        message: data.message || data.error,
        errors: data.errors
      })

      // Handle 401 Unauthorized
      if (status === 401) {
        localStorage.removeItem(STORAGE_KEYS.TOKEN)
        localStorage.removeItem(STORAGE_KEYS.USER)
        
        // Redirect ke login jika bukan di halaman login
        if (!window.location.pathname.includes('/login')) {
          window.location.href = '/login'
        }
      }

      // Handle 419 CSRF Token Mismatch
      if (status === 419) {
        window.location.reload()
      }

      // Handle 422 Validation Error
      if (status === 422) {
        const validationErrors = data.errors || {}
        logger.error('Validation Errors:', validationErrors)
      }

      // Handle 429 Too Many Requests
      if (status === 429) {
        logger.error('Too many requests. Please try again later.')
      }
    } else if (error.request) {
      // Network error - no response
      logger.error('Network Error:', error.request)
      
      if (isDevelopment()) {
        console.warn(`⚠️ Cannot connect to ${API_CONFIG.apiUrl}. Make sure Laravel server is running.`)
      }
    } else {
      logger.error('Error:', error.message)
    }

    return Promise.reject(error)
  }
)

// API Service dengan method yang sesuai untuk Laravel
export const apiService = {
  // GET request
  get: async <T>(url: string, params?: any): Promise<T> => {
    const response = await api.get(url, { params })
    return response.data
  },

  // POST request
  post: async <T>(url: string, data?: any): Promise<T> => {
    const response = await api.post(url, data)
    return response.data
  },

  // PUT request
  put: async <T>(url: string, data?: any): Promise<T> => {
    const response = await api.put(url, data)
    return response.data
  },

  // PATCH request
  patch: async <T>(url: string, data?: any): Promise<T> => {
    const response = await api.patch(url, data)
    return response.data
  },

  // DELETE request
  delete: async <T>(url: string): Promise<T> => {
    const response = await api.delete(url)
    return response.data
  },

  // POST request for FormData (upload file)
  postForm: async <T>(
    url: string, 
    formData: FormData, 
    onProgress?: (percentage: number) => void
  ): Promise<T> => {
    const response = await api.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent: any) => {
        if (onProgress && progressEvent.total) {
          const percentage = Math.round((progressEvent.loaded * 100) / progressEvent.total)
          onProgress(percentage)
        }
      },
    })
    return response.data
  },

  // POST request with URL-encoded data
  postUrlEncoded: async <T>(url: string, data: Record<string, any>): Promise<T> => {
    const params = new URLSearchParams()
    Object.entries(data).forEach(([key, value]) => {
      params.append(key, String(value))
    })
    
    const response = await api.post(url, params, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    })
    return response.data
  },
}

export { API_ENDPOINTS }
export default api