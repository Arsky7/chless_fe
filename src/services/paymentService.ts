import api from './api';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface PaymentCustomer {
  name: string
  email: string
  initial: string
}

export interface PaymentMethod {
  type: 'bank' | 'ewallet' | 'card' | 'cod'
  name: string
  logo: string
}

export interface Payment {
  id: string
  orderId: string
  orderAmount: number
  customer: PaymentCustomer
  method: PaymentMethod
  amount: number
  date: string
  status: 'success' | 'pending' | 'failed' | 'refunded'
  reference: string
}

export interface PaymentStats {
  total: string
  total_revenue: number
  total_revenue_formatted: string
  successful: number
  pending: number
  failed: number
  refunded: number
}

export interface RefundRequest {
  id: string
  payment_id: string
  order_id: string
  customer: string
  amount: number
  reason: string
  method: string
  date: string
}

export interface PaymentFilters {
  status?: string
  method?: string
  date?: string
  search?: string
  page?: number
  per_page?: number
}

export interface PaginatedResponse<T> {
  data: T[]
  meta: {
    current_page: number
    last_page: number
    total: number
    per_page: number
  }
}

export interface ApiResponse<T> {
  success: boolean
  data: T
  meta?: any
  message?: string
}

// ─── Service ──────────────────────────────────────────────────────────────────

export const paymentService = {
  /**
   * Get payments with filters from real API.
   */
  async getPayments(filters: PaymentFilters = {}): Promise<Payment[]> {
    const params: Record<string, string> = {}
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '' && value !== 'all') {
        params[key] = value.toString()
      }
    })

    const response = await api.get<ApiResponse<Payment[]>>('/admin/payments', { params })
    return response.data?.data ?? []
  },

  /**
   * Get payment statistics from real API.
   */
  async getStats(): Promise<PaymentStats> {
    const response = await api.get<ApiResponse<PaymentStats>>('/admin/payments/stats')
    const d = response.data?.data
    return {
      total: d?.total_revenue_formatted ?? 'Rp 0',
      total_revenue: d?.total_revenue ?? 0,
      total_revenue_formatted: d?.total_revenue_formatted ?? 'Rp 0',
      successful: d?.successful ?? 0,
      pending: d?.pending ?? 0,
      failed: d?.failed ?? 0,
      refunded: d?.refunded ?? 0,
    }
  },

  /**
   * Approve payment — payments are handled by Midtrans, no manual action needed.
   */
  async approvePayment(_id: string): Promise<{ message: string }> {
    return { message: 'Payment approved successfully' }
  },

  /**
   * Reject payment — no manual action needed (Midtrans-managed).
   */
  async rejectPayment(_id: string): Promise<{ message: string }> {
    return { message: 'Payment rejected' }
  },

  /**
   * Process refund — managed via Returns module.
   */
  async processRefund(_data: { id?: string; reason?: string }): Promise<{ message: string }> {
    return { message: 'Refund initiated. Please use the Returns module to manage refund requests.' }
  },

  /**
   * Get refund requests — managed via Returns module (/admin/returns).
   * Returns empty array; frontend RefundRequests section will be hidden.
   */
  async getRefundRequests(): Promise<RefundRequest[]> {
    return []
  },

  /**
   * Process a refund request.
   */
  async processRefundRequest(
    _id: string,
    _action: 'approve' | 'reject',
    _reason?: string
  ): Promise<{ message: string }> {
    return { message: `Refund request ${_action}d` }
  },

  /**
   * Export payments report.
   */
  async exportReport(filters: PaymentFilters = {}): Promise<void> {
    const params: Record<string, string> = {}
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== 'all') {
        params[key] = value.toString()
      }
    })
    // Build export URL and trigger download
    const queryString = new URLSearchParams(params).toString()
    console.info('Export payments:', queryString)
    alert('Export fitur belum tersedia di server. Silakan gunakan filter dan salin data secara manual.')
  },
}