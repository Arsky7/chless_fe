/// <reference types="vite/client" />

interface ImportMetaEnv {
  // API Configuration
  readonly VITE_API_URL: string
  readonly VITE_API_TIMEOUT: string
  readonly VITE_API_VERSION: string

  // App Configuration
  readonly VITE_APP_NAME: string
  readonly VITE_APP_DESCRIPTION: string
  readonly VITE_APP_VERSION: string
  readonly VITE_APP_URL: string
  readonly VITE_APP_DEBUG: string

  // Authentication
  readonly VITE_TOKEN_KEY: string
  readonly VITE_REFRESH_TOKEN_KEY: string
  readonly VITE_USER_KEY: string

  // Payment Gateway
  readonly VITE_MIDTRANS_CLIENT_KEY: string
  readonly VITE_MIDTRANS_IS_PRODUCTION: string
  readonly VITE_ENABLE_PAYMENT_GATEWAY: string

  // Currency
  readonly VITE_CURRENCY: string
  readonly VITE_CURRENCY_SYMBOL: string
  readonly VITE_CURRENCY_LOCALE: string

  // Mode (development, production, test)
  readonly MODE: string
  readonly DEV: boolean
  readonly PROD: boolean
  readonly SSR: boolean
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}