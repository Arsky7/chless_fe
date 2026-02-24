/**
 * Get environment variable with type safety
 */
export const getEnv = (key: keyof ImportMetaEnv): string => {
  const value = import.meta.env[key]
  
  if (value === undefined) {
    throw new Error(`Environment variable ${key} is not defined`)
  }
  
  return value
}

/**
 * Get boolean environment variable
 */
export const getEnvBoolean = (key: keyof ImportMetaEnv): boolean => {
  const value = getEnv(key)
  return value.toLowerCase() === 'true'
}

/**
 * Get number environment variable
 */
export const getEnvNumber = (key: keyof ImportMetaEnv): number => {
  const value = getEnv(key)
  const number = Number(value)
  
  if (isNaN(number)) {
    throw new Error(`Environment variable ${key} is not a valid number`)
  }
  
  return number
}

/**
 * Check if current environment is development
 */
export const isDevelopment = (): boolean => {
  return import.meta.env.MODE === 'development'
}

/**
 * Check if current environment is production
 */
export const isProduction = (): boolean => {
  return import.meta.env.MODE === 'production'
}

/**
 * Check if current environment is test
 */
export const isTest = (): boolean => {
  return import.meta.env.MODE === 'test'
}

/**
 * Get API URL
 */
export const getApiUrl = (): string => {
  return getEnv('VITE_API_URL')
}

/**
 * Get app name
 */
export const getAppName = (): string => {
  return getEnv('VITE_APP_NAME')
}

/**
 * Check if payment gateway is enabled
 */
export const isPaymentGatewayEnabled = (): boolean => {
  return getEnvBoolean('VITE_ENABLE_PAYMENT_GATEWAY')
}

/**
 * Get currency symbol
 */
export const getCurrencySymbol = (): string => {
  return getEnv('VITE_CURRENCY_SYMBOL')
}