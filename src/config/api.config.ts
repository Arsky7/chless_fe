/**
 * API Configuration for Laravel Backend
 * Centralized configuration for all API related settings
 * UPDATED: 2026-02-18
 */

// ============================================
// Type Definitions
// ============================================

export interface ApiConfig {
  // API
  apiUrl: string
  apiTimeout: number
  apiVersion: string

  // App
  appName: string
  appEnv: string
  appDebug: boolean
  appTimezone: string
  appUrl: string
  appLocale: string
  appFallbackLocale: string

  // Auth & Security
  tokenKey: string
  refreshTokenKey: string
  userKey: string
  sessionLifetime: number

  // Payment Gateways
  midtrans: {
    clientKey: string
    isProduction: boolean
    merchantId?: string
  }
  xendit: {
    isProduction: boolean
  }

  // Shipping
  rajaongkir: {
    apiKey: string
    mode: string
  }

  // Company Information
  company: {
    name: string
    email: string
    phone: string
    whatsapp: string
    address: string
    city: string
    province: string
    postalCode: string
  }

  // Social Media
  social: {
    instagram: string
    tiktok: string
    shopee: string
    tokopedia: string
  }

  // Features (based on backend capabilities)
  features: {
    paymentGateway: boolean
    shippingTracking: boolean
    returnRequest: boolean
    staffManagement: boolean
    multiWarehouse: boolean
    reviewSystem: boolean
    wishlist: boolean
  }

  // Pagination
  pagination: {
    defaultPageSize: number
    maxPageSize: number
  }

  // Currency
  currency: {
    code: string
    symbol: string
    locale: string
  }

  // Date Format
  dateFormat: {
    date: string
    datetime: string
    timezone: string
  }

  // Upload
  upload: {
    maxFileSize: number // in bytes
    maxImageSize: number
    maxVideoSize: number
    allowedImageTypes: string[]
    allowedVideoTypes: string[]
  }

  // Cache & Storage
  storage: {
    prefix: string
    sessionTimeout: number // in milliseconds
  }

  // Contact
  contact: {
    phone: string
    email: string
    whatsapp: string
  }

  // Logging
  logLevel: string
  debug: boolean
}

// ============================================
// Helper Functions
// ============================================

/**
 * Get environment variable with type safety
 */
const getEnv = (key: string, defaultValue?: string): string => {
  const value = import.meta.env[key]

  if (value === undefined) {
    if (defaultValue !== undefined) {
      return defaultValue
    }

    if (import.meta.env.PROD) {
      console.warn(`⚠️ Environment variable ${key} is not defined`)
    }

    return ''
  }

  return value
}

/**
 * Get boolean environment variable
 */
const getEnvBoolean = (key: string, defaultValue: boolean = false): boolean => {
  const value = import.meta.env[key]

  if (value === undefined) {
    return defaultValue
  }

  return value.toLowerCase() === 'true' || value === '1'
}

/**
 * Get number environment variable
 */
const getEnvNumber = (key: string, defaultValue?: number): number => {
  const value = import.meta.env[key]

  if (value === undefined) {
    return defaultValue || 0
  }

  const number = Number(value)
  return isNaN(number) ? defaultValue || 0 : number
}

// ============================================
// Configuration Object
// ============================================

export const API_CONFIG: ApiConfig = {
  // ============================================
  // API CONFIGURATION - PASTIKAN INI BENAR!
  // ============================================
  apiUrl: getEnv('VITE_API_URL', 'http://localhost:8000/api'), // <-- UBAH KE localhost:8000
  apiTimeout: getEnvNumber('VITE_API_TIMEOUT', 30000),
  apiVersion: 'v1',

  // ============================================
  // APP CONFIGURATION
  // ============================================
  appName: getEnv('VITE_APP_NAME', 'CHLESS Fashion'),
  appEnv: getEnv('VITE_APP_ENV', 'local'),
  appDebug: getEnvBoolean('VITE_APP_DEBUG', true),
  appTimezone: getEnv('APP_TIMEZONE', 'Asia/Jakarta'),
  appUrl: getEnv('VITE_APP_URL', 'http://localhost:5173'),
  appLocale: getEnv('APP_LOCALE', 'id'),
  appFallbackLocale: getEnv('APP_FALLBACK_LOCALE', 'en'),

  // ============================================
  // AUTH & SECURITY
  // ============================================
  tokenKey: 'token',
  refreshTokenKey: 'refresh_token',
  userKey: 'user',
  sessionLifetime: getEnvNumber('SESSION_LIFETIME', 120), // in minutes

  // ============================================
  // PAYMENT GATEWAYS
  // ============================================
  midtrans: {
    clientKey: getEnv('VITE_MIDTRANS_CLIENT_KEY', ''),
    isProduction: getEnvBoolean('MIDTRANS_IS_PRODUCTION', false),
    merchantId: getEnv('MIDTRANS_MERCHANT_ID', ''),
  },
  xendit: {
    isProduction: getEnvBoolean('XENDIT_IS_PRODUCTION', false),
  },

  // ============================================
  // SHIPPING
  // ============================================
  rajaongkir: {
    apiKey: getEnv('RAJAONGKIR_API_KEY', ''),
    mode: getEnv('RAJAONGKIR_MODE', 'starter'),
  },

  // ============================================
  // COMPANY INFORMATION
  // ============================================
  company: {
    name: getEnv('VITE_COMPANY_NAME', 'PT CHLESS FASHION INDONESIA'),
    email: getEnv('VITE_COMPANY_EMAIL', 'info@chless.com'),
    phone: getEnv('VITE_CONTACT_PHONE', '6281234567890'),
    whatsapp: getEnv('VITE_CONTACT_WHATSAPP', '6281234567890'),
    address: getEnv('VITE_COMPANY_ADDRESS', 'Jl. Fashion No. 123, Jakarta Pusat'),
    city: getEnv('VITE_COMPANY_CITY', 'Jakarta'),
    province: getEnv('VITE_COMPANY_PROVINCE', 'DKI Jakarta'),
    postalCode: getEnv('VITE_COMPANY_POSTAL_CODE', '12345'),
  },

  // ============================================
  // SOCIAL MEDIA
  // ============================================
  social: {
    instagram: getEnv('VITE_INSTAGRAM_URL', 'https://instagram.com/chless'),
    tiktok: getEnv('VITE_TIKTOK_URL', 'https://tiktok.com/@chless'),
    shopee: getEnv('VITE_SHOPEE_URL', 'https://shopee.co.id/chless'),
    tokopedia: getEnv('VITE_TOKOPEDIA_URL', 'https://tokopedia.com/chless'),
  },

  // ============================================
  // FEATURES
  // ============================================
  features: {
    paymentGateway: getEnvBoolean('VITE_ENABLE_PAYMENT_GATEWAY', false),
    shippingTracking: getEnvBoolean('VITE_ENABLE_SHIPPING_TRACKING', false),
    returnRequest: getEnvBoolean('VITE_ENABLE_RETURN_REQUEST', true),
    staffManagement: getEnvBoolean('VITE_ENABLE_STAFF_MANAGEMENT', true),
    multiWarehouse: getEnvBoolean('VITE_ENABLE_MULTI_WAREHOUSE', false),
    reviewSystem: getEnvBoolean('VITE_ENABLE_REVIEW_SYSTEM', true),
    wishlist: getEnvBoolean('VITE_ENABLE_WISHLIST', true),
  },

  // ============================================
  // PAGINATION
  // ============================================
  pagination: {
    defaultPageSize: getEnvNumber('VITE_DEFAULT_PAGE_SIZE', 20),
    maxPageSize: getEnvNumber('VITE_MAX_PAGE_SIZE', 100),
  },

  // ============================================
  // CURRENCY
  // ============================================
  currency: {
    code: getEnv('VITE_CURRENCY', 'IDR'),
    symbol: getEnv('VITE_CURRENCY_SYMBOL', 'Rp'),
    locale: getEnv('VITE_CURRENCY_LOCALE', 'id-ID'),
  },

  // ============================================
  // DATE FORMAT
  // ============================================
  dateFormat: {
    date: getEnv('VITE_DATE_FORMAT', 'dd MMM yyyy'),
    datetime: getEnv('VITE_DATETIME_FORMAT', 'dd MMM yyyy HH:mm'),
    timezone: getEnv('VITE_TIMEZONE', 'Asia/Jakarta'),
  },

  // ============================================
  // UPLOAD LIMITS
  // ============================================
  upload: {
    maxFileSize: getEnvNumber('VITE_MAX_FILE_SIZE', 5120) * 1024, // Convert KB to bytes
    maxImageSize: getEnvNumber('VITE_MAX_IMAGE_SIZE', 2048) * 1024,
    maxVideoSize: getEnvNumber('VITE_MAX_VIDEO_SIZE', 10240) * 1024,
    allowedImageTypes: getEnv('VITE_ALLOWED_IMAGE_TYPES', 'jpg,jpeg,png,webp').split(','),
    allowedVideoTypes: getEnv('VITE_ALLOWED_VIDEO_TYPES', 'mp4,mov,avi').split(','),
  },

  // ============================================
  // CACHE & STORAGE
  // ============================================
  storage: {
    prefix: getEnv('VITE_LOCAL_STORAGE_PREFIX', 'chless_'),
    sessionTimeout: getEnvNumber('VITE_SESSION_TIMEOUT', 7200) * 1000, // Convert to milliseconds
  },

  // ============================================
  // CONTACT
  // ============================================
  contact: {
    phone: getEnv('VITE_CONTACT_PHONE', '6281234567890'),
    email: getEnv('VITE_CONTACT_EMAIL', 'cs@chless.com'),
    whatsapp: getEnv('VITE_CONTACT_WHATSAPP', '6281234567890'),
  },

  // ============================================
  // LOGGING
  // ============================================
  logLevel: getEnv('VITE_LOG_LEVEL', 'debug'),
  debug: getEnvBoolean('VITE_APP_DEBUG', true),
}

// ============================================
// API ENDPOINTS - LARAVEL STRUCTURE
// ============================================

export const API_ENDPOINTS = {
  // ============================================
  // AUTHENTICATION
  // ============================================
  AUTH: {
    LOGIN: '/login',
    REGISTER: '/register',
    LOGOUT: '/logout',
    REFRESH: '/refresh',
    ME: '/me',
    FORGOT_PASSWORD: '/forgot-password',
    RESET_PASSWORD: '/reset-password',
  },

  // ============================================
  // ADMIN - DASHBOARD
  // ============================================
  ADMIN: {
    DASHBOARD: '/admin/dashboard',
    STATS: '/admin/dashboard/stats',
  },

  // ============================================
  // CATEGORIES
  // ============================================
  CATEGORIES: {
    INDEX: '/admin/categories',
    STORE: '/admin/categories',
    DETAIL: (id: number) => `/admin/categories/${id}`,
    UPDATE: (id: number) => `/admin/categories/${id}`,
    DELETE: (id: number) => `/admin/categories/${id}`,
  },

  // ============================================
  // PRODUCTS
  // ============================================
  PRODUCTS: {
    INDEX: '/admin/products',
    STORE: '/admin/products',
    DETAIL: (id: number) => `/admin/products/${id}`,
    UPDATE: (id: number) => `/admin/products/${id}`,
    DELETE: (id: number) => `/admin/products/${id}`,
    STATS: '/admin/products/stats',
    BULK_DELETE: '/admin/products/bulk-delete',
    DUPLICATE: (id: number) => `/admin/products/${id}/duplicate`,
    UPDATE_STOCK: (id: number) => `/admin/products/${id}/stock`,
    TOGGLE_FEATURED: (id: number) => `/admin/products/${id}/toggle-featured`,
    TOGGLE_ACTIVE: (id: number) => `/admin/products/${id}/toggle-active`,
    EXPORT: '/admin/products/export',
    IMPORT: '/admin/products/import',
    PRINT_BARCODES: '/admin/products/print-barcodes',
  },

  // ============================================
  // ORDERS
  // ============================================
  ORDERS: {
    INDEX: '/orders',
    STATS: '/orders/stats',
    TODAY_SUMMARY: '/orders/today-summary',
    EXPORT: '/orders/export',
    PRINT_LABELS: '/orders/print-labels',
    DETAIL: (id: string) => `/orders/${id}`,
    UPDATE_STATUS: (id: string) => `/orders/${id}/status`,
    INVOICE: (id: string) => `/orders/${id}/invoice`,
  },

  // ============================================
  // CUSTOMERS
  // ============================================
  CUSTOMERS: {
    INDEX: '/admin/customers',
    STATS: '/admin/customers/stats',
    DETAIL: (id: number) => `/admin/customers/${id}`,
    TOGGLE_ACTIVE: (id: number) => `/admin/customers/${id}/toggle-active`,
  },

  // ============================================
  // SHIPPING
  // ============================================
  SHIPPING: {
    PROVINCES: '/shipping/provinces',
    CITIES: '/shipping/cities',
    COST: '/shipping/cost',
    TRACK: (awb: string) => `/shipping/track/${awb}`,
  },

  // ============================================
  // PAYMENTS
  // ============================================
  PAYMENTS: {
    CREATE: '/payments/create',
    NOTIFICATION: '/payments/notification',
    STATUS: (id: string) => `/payments/${id}/status`,
  },

  // ============================================
  // REPORTS
  // ============================================
  REPORTS: {
    SALES: '/reports/sales',
    PRODUCTS: '/reports/products',
    EXPORT: '/reports/export',
  },

  // ============================================
  // STAFF
  // ============================================
  STAFF: {
    INDEX: '/staff',
    DETAIL: (id: number) => `/staff/${id}`,
  },

  // ============================================
  // SETTINGS
  // ============================================
  SETTINGS: {
    INDEX: '/settings',
    UPDATE: '/settings',
  },
}

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Get full API URL for endpoint
 */
export const getApiUrl = (endpoint: string): string => {
  return `${API_CONFIG.apiUrl}${endpoint}`
}

/**
 * Check if app is in development mode
 */
export const isDevelopment = (): boolean => {
  return API_CONFIG.appEnv === 'local' || API_CONFIG.appEnv === 'development'
}

/**
 * Check if app is in production mode
 */
export const isProduction = (): boolean => {
  return API_CONFIG.appEnv === 'production'
}

/**
 * Format currency (Rp 100.000)
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat(API_CONFIG.currency.locale, {
    style: 'currency',
    currency: API_CONFIG.currency.code,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount).replace(/\s/g, '') // Hapus spasi
}

/**
 * Format date
 */
export const formatDate = (date: string | Date, format: 'date' | 'datetime' = 'date'): string => {
  const d = new Date(date)
  const options: Intl.DateTimeFormatOptions = {
    timeZone: API_CONFIG.dateFormat.timezone,
  }

  if (format === 'date') {
    options.day = 'numeric'
    options.month = 'short'
    options.year = 'numeric'
  } else {
    options.day = 'numeric'
    options.month = 'short'
    options.year = 'numeric'
    options.hour = '2-digit'
    options.minute = '2-digit'
  }

  return new Intl.DateTimeFormat('id-ID', options).format(d)
}

/**
 * Check if feature is enabled
 */
export const isFeatureEnabled = (feature: keyof typeof API_CONFIG.features): boolean => {
  return API_CONFIG.features[feature]
}

/**
 * Get image URL (handle full URL or relative path)
 */
export const getImageUrl = (path: string | null | undefined): string => {
  if (!path) return '/placeholder-image.jpg'
  if (path.startsWith('http')) return path
  return `${API_CONFIG.apiUrl.replace('/api', '')}/storage/${path}`
}

export default API_CONFIG