import React from 'react'
import API_CONFIG from '../config/api.config'

// Type definitions
type CurrencyAmount = string | number
type DateInput = string | number | Date
type PaymentStatus = 'success' | 'pending' | 'failed' | 'refunded' | string

// Interface untuk status badge
interface StatusBadgeConfig {
  background: string
  color: string
  icon: string
  text: string
}

// Status badge mapping dengan tipe yang jelas
const statusMap: Record<string, StatusBadgeConfig> = {
  success: { 
    background: '#D4EDDA', 
    color: '#155724', 
    icon: 'fa-check-circle', 
    text: 'Success' 
  },
  pending: { 
    background: '#FFF3CD', 
    color: '#856404', 
    icon: 'fa-clock', 
    text: 'Pending' 
  },
  failed: { 
    background: '#F8D7DA', 
    color: '#721C24', 
    icon: 'fa-times-circle', 
    text: 'Failed' 
  },
  refunded: { 
    background: '#D1ECF1', 
    color: '#0C5460', 
    icon: 'fa-undo', 
    text: 'Refunded' 
  }
}

/**
 * Format currency to IDR format using API_CONFIG
 * @param amount - Number or string amount to format
 * @returns Formatted currency string (e.g., "Rp1.000.000")
 */
export const formatCurrency = (amount: CurrencyAmount): string => {
  // If already formatted with Rp, return as is
  if (typeof amount === 'string' && amount.includes('Rp')) {
    return amount
  }
  
  // Clean and parse the amount
  let numAmount: number
  
  if (typeof amount === 'string') {
    // Remove non-numeric characters except dot and minus
    const cleaned = amount.replace(/[^0-9.-]+/g, '')
    numAmount = parseFloat(cleaned)
  } else {
    numAmount = amount
  }
  
  // Handle NaN or invalid numbers
  if (isNaN(numAmount)) {
    return `${API_CONFIG.currency.symbol}0`
  }
  
  // Format with Indonesian locale from config
  return new Intl.NumberFormat(API_CONFIG.currency.locale, {
    style: 'currency',
    currency: API_CONFIG.currency.code,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(numAmount).replace(/\s/g, '')
}

/**
 * Format date using API_CONFIG date format
 * @param dateString - Date string, timestamp, or Date object
 * @param formatType - 'date' or 'datetime'
 * @returns Formatted date string
 */
export const formatDate = (
  dateString: DateInput, 
  formatType: 'date' | 'datetime' = 'datetime'
): string => {
  const date = new Date(dateString)
  
  // Check if date is valid
  if (isNaN(date.getTime())) {
    return 'Invalid Date'
  }
  
  const options: Intl.DateTimeFormatOptions = {
    timeZone: API_CONFIG.dateFormat.timezone,
  }
  
  if (formatType === 'date') {
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
  
  return new Intl.DateTimeFormat('id-ID', options).format(date)
}

/**
 * Format date to short format (without time)
 * @param dateString - Date string, timestamp, or Date object
 * @returns Short date string (e.g., "20 Nov 2023")
 */
export const formatShortDate = (dateString: DateInput): string => {
  return formatDate(dateString, 'date')
}

/**
 * Get status badge component with styling
 * @param status - Payment status
 * @returns React span element with status badge
 */
export const getStatusBadge = (status: PaymentStatus): React.ReactElement => {
  const statusInfo = statusMap[status] || statusMap.pending
  
  const badgeStyle: React.CSSProperties = {
    padding: '6px 12px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    background: statusInfo.background,
    color: statusInfo.color
  }

  return React.createElement(
    'span',
    { style: badgeStyle },
    React.createElement('i', { className: `fas ${statusInfo.icon}` }),
    statusInfo.text
  )
}

/**
 * Get status badge configuration only (without rendering)
 * @param status - Payment status
 * @returns Status badge configuration object
 */
export const getStatusBadgeConfig = (status: PaymentStatus): StatusBadgeConfig => {
  return statusMap[status] || statusMap.pending
}

/**
 * Format number with thousand separators using config locale
 * @param num - Number to format
 * @returns Formatted number string (e.g., "1.000.000")
 */
export const formatNumber = (num: number): string => {
  return new Intl.NumberFormat(API_CONFIG.currency.locale).format(num)
}

/**
 * Parse currency string to number
 * @param currencyString - Currency string (e.g., "Rp1.000.000")
 * @returns Parsed number
 */
export const parseCurrency = (currencyString: string): number => {
  const cleaned = currencyString.replace(/[^0-9.-]+/g, '')
  return parseFloat(cleaned) || 0
}

/**
 * Format file size using config limits
 * @param bytes - Size in bytes
 * @returns Formatted file size (e.g., "1.5 MB")
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

/**
 * Format phone number to Indonesian format
 * @param phone - Phone number string
 * @returns Formatted phone number
 */
export const formatPhoneNumber = (phone: string): string => {
  // Remove all non-numeric characters
  const cleaned = phone.replace(/\D/g, '')
  
  // Check if it's a valid Indonesian number
  if (cleaned.startsWith('62')) {
    return cleaned.replace(/(\d{2})(\d{3})(\d{3,})/, '+$1 $2 $3')
  } else if (cleaned.startsWith('0')) {
    return cleaned.replace(/(\d{4})(\d{4})(\d{4})/, '$1-$2-$3')
  }
  
  return phone
}

/**
 * Check if file size is within allowed limit
 * @param size - File size in bytes
 * @param type - File type ('image', 'video', 'file')
 * @returns Boolean indicating if file size is valid
 */
export const isValidFileSize = (size: number, type: 'image' | 'video' | 'file' = 'file'): boolean => {
  switch (type) {
    case 'image':
      return size <= API_CONFIG.upload.maxImageSize
    case 'video':
      return size <= API_CONFIG.upload.maxVideoSize
    default:
      return size <= API_CONFIG.upload.maxFileSize
  }
}

/**
 * Get image URL with proper formatting
 * @param path - Image path
 * @returns Full image URL
 */
export const getImageUrl = (path: string | null | undefined): string => {
  if (!path) return '/placeholder-image.jpg'
  if (path.startsWith('http')) return path
  return `${API_CONFIG.apiUrl.replace('/api', '')}/storage/${path}`
}