
// Types
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
  successful: number
  pending: number
  failed: number
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
  data: T
  message?: string
  meta?: any
}

// Sample data for development (when API is not ready)
const samplePayments: Payment[] = [
  {
    id: "PAY-2023-00125",
    orderId: "ORD-2023-00125",
    orderAmount: 447000,
    customer: { name: "John Doe", email: "john@email.com", initial: "JD" },
    method: { type: "bank", name: "Bank BCA", logo: "bca" },
    amount: 447000,
    date: "2023-11-20 14:35",
    status: "success",
    reference: "TRX-00125-2023"
  },
  {
    id: "PAY-2023-00124",
    orderId: "ORD-2023-00124",
    orderAmount: 900000,
    customer: { name: "Sarah Wilson", email: "sarah@email.com", initial: "SW" },
    method: { type: "ewallet", name: "GoPay", logo: "gopay" },
    amount: 900000,
    date: "2023-11-20 13:20",
    status: "success",
    reference: "TRX-00124-2023"
  },
  {
    id: "PAY-2023-00123",
    orderId: "ORD-2023-00123",
    orderAmount: 770000,
    customer: { name: "Michael Chen", email: "michael@email.com", initial: "MC" },
    method: { type: "card", name: "Visa", logo: "visa" },
    amount: 770000,
    date: "2023-11-19 11:50",
    status: "success",
    reference: "TRX-00123-2023"
  },
  {
    id: "PAY-2023-00122",
    orderId: "ORD-2023-00122",
    orderAmount: 409000,
    customer: { name: "Lisa Garcia", email: "lisa@email.com", initial: "LG" },
    method: { type: "bank", name: "Bank Mandiri", logo: "mandiri" },
    amount: 409000,
    date: "2023-11-18 09:25",
    status: "success",
    reference: "TRX-00122-2023"
  },
  {
    id: "PAY-2023-00121",
    orderId: "ORD-2023-00121",
    orderAmount: 455000,
    customer: { name: "David Brown", email: "david@email.com", initial: "DB" },
    method: { type: "ewallet", name: "OVO", logo: "ovo" },
    amount: 455000,
    date: "2023-11-17 16:15",
    status: "failed",
    reference: "TRX-00121-2023"
  },
  {
    id: "PAY-2023-00120",
    orderId: "ORD-2023-00120",
    orderAmount: 627000,
    customer: { name: "Emma Johnson", email: "emma@email.com", initial: "EJ" },
    method: { type: "bank", name: "Bank BNI", logo: "bni" },
    amount: 627000,
    date: "2023-11-17 14:30",
    status: "pending",
    reference: "TRX-00120-2023"
  }
]

const sampleStats: PaymentStats = {
  total: 'Rp 248.5M',
  successful: 1128,
  pending: 42,
  failed: 18
}

const sampleRefundRequests: RefundRequest[] = [
  {
    id: "REF-2023-001",
    payment_id: "PAY-2023-00120",
    order_id: "ORD-2023-00120",
    customer: "John Doe",
    amount: 450000,
    reason: "Customer requested refund",
    method: "Bank Transfer",
    date: "2023-11-20"
  },
  {
    id: "REF-2023-002",
    payment_id: "PAY-2023-00118",
    order_id: "ORD-2023-00118",
    customer: "Sarah Wilson",
    amount: 298000,
    reason: "Item not as described",
    method: "GoPay",
    date: "2023-11-20"
  }
]

export const paymentService = {
  /**
   * Get payments with filters
   */
  async getPayments(filters: PaymentFilters = {}): Promise<Payment[]> {
    try {
      // Uncomment for production API
      // const params: Record<string, string> = {}
      // Object.entries(filters).forEach(([key, value]) => {
      //   if (value && value !== 'all') {
      //     params[key] = value.toString()
      //   }
      // })

      // Menggunakan API_ENDPOINTS dari config
      // const response = await apiService.get<ApiResponse<Payment[]>>(
      //   API_ENDPOINTS.ORDERS.INDEX, // Sesuaikan dengan endpoint yang benar
      //   params
      // )
      // return response.data || []

      // Simulate API delay for development
      await new Promise(resolve => setTimeout(resolve, 500))

      // Filter sample data based on filters
      let filtered = [...samplePayments]

      if (filters.status && filters.status !== 'all') {
        filtered = filtered.filter(p => p.status === filters.status)
      }

      if (filters.method && filters.method !== 'all') {
        filtered = filtered.filter(p => p.method.type === filters.method)
      }

      if (filters.search) {
        const searchLower = filters.search.toLowerCase()
        filtered = filtered.filter(p =>
          p.orderId.toLowerCase().includes(searchLower) ||
          p.customer.name.toLowerCase().includes(searchLower) ||
          p.id.toLowerCase().includes(searchLower)
        )
      }

      return filtered
    } catch (error) {
      console.error('Error fetching payments:', error)
      throw error
    }
  },

  /**
   * Get payment statistics
   */
  async getStats(): Promise<PaymentStats> {
    try {
      // Uncomment for production API
      // const response = await apiService.get<ApiResponse<PaymentStats>>(
      //   API_ENDPOINTS.ORDERS.STATS // Sesuaikan dengan endpoint yang benar
      // )
      // return response.data

      // Simulate API delay for development
      await new Promise(resolve => setTimeout(resolve, 300))
      return sampleStats
    } catch (error) {
      console.error('Error fetching payment stats:', error)
      throw error
    }
  },

  /**
   * Approve a payment
   */
  async approvePayment(_id: string): Promise<{ message: string }> {
    try {
      // Uncomment for production API
      // const response = await apiService.post<ApiResponse<{ message: string }>>(
      //   `${API_ENDPOINTS.ORDERS.INDEX}/${id}/approve` // Sesuaikan dengan endpoint
      // )
      // return response.data

      await new Promise(resolve => setTimeout(resolve, 500))
      return { message: 'Payment approved successfully' }
    } catch (error) {
      console.error('Error approving payment:', error)
      throw error
    }
  },

  /**
   * Reject a payment
   */
  async rejectPayment(_id: string): Promise<{ message: string }> {
    try {
      // Uncomment for production API
      // const response = await apiService.post<ApiResponse<{ message: string }>>(
      //   `${API_ENDPOINTS.ORDERS.INDEX}/${id}/reject` // Sesuaikan dengan endpoint
      // )
      // return response.data

      await new Promise(resolve => setTimeout(resolve, 500))
      return { message: 'Payment rejected' }
    } catch (error) {
      console.error('Error rejecting payment:', error)
      throw error
    }
  },

  /**
   * Process a refund for a payment
   */
  async processRefund(_data: { id?: string; reason?: string }): Promise<{ message: string }> {
    try {
      // Uncomment for production API
      // const response = await apiService.post<ApiResponse<{ message: string }>>(
      //   `${API_ENDPOINTS.ORDERS.INDEX}/${id}/refund`, // Sesuaikan dengan endpoint
      //   { reason }
      // )
      // return response.data

      await new Promise(resolve => setTimeout(resolve, 500))
      return { message: 'Refund initiated successfully' }
    } catch (error) {
      console.error('Error processing refund:', error)
      throw error
    }
  },

  /**
   * Get refund requests
   */
  async getRefundRequests(): Promise<RefundRequest[]> {
    try {
      // Uncomment for production API
      // const response = await apiService.get<ApiResponse<RefundRequest[]>>(
      //   '/api/refund-requests' // Sesuaikan dengan endpoint
      // )
      // return response.data || []

      await new Promise(resolve => setTimeout(resolve, 300))
      return sampleRefundRequests
    } catch (error) {
      console.error('Error fetching refund requests:', error)
      throw error
    }
  },

  /**
   * Process a refund request (approve/reject)
   */
  async processRefundRequest(
    _id: string,
    _action: 'approve' | 'reject',
    _reason?: string
  ): Promise<{ message: string }> {
    try {
      // Uncomment for production API
      // const response = await apiService.post<ApiResponse<{ message: string }>>(
      //   `/api/refund-requests/${id}/${action}`, // Sesuaikan dengan endpoint
      //   { reason }
      // )
      // return response.data

      await new Promise(resolve => setTimeout(resolve, 500))
      return { message: `Refund ${_action}d successfully` }
    } catch (error) {
      console.error('Error processing refund request:', error)
      throw error
    }
  },

  /**
   * Export payments report
   */
  async exportReport(filters: PaymentFilters = {}): Promise<void> {
    try {
      // Uncomment for production API
      const params: Record<string, string> = {}
      Object.entries(filters).forEach(([key, value]) => {
        if (value && value !== 'all') {
          params[key] = value.toString()
        }
      })

      console.log('Exporting with filters:', params)

      // const response = await api.get(`${API_ENDPOINTS.ORDERS.INDEX}/export`, { // Sesuaikan dengan endpoint
      //   params,
      //   responseType: 'blob'
      // })

      // // Create download link
      // const url = window.URL.createObjectURL(new Blob([response.data]))
      // const link = document.createElement('a')
      // link.href = url
      // link.setAttribute('download', `payments_${new Date().toISOString().split('T')[0]}.csv`)
      // document.body.appendChild(link)
      // link.click()
      // link.remove()

      alert(`Exporting payment report with filters: ${JSON.stringify(filters)}`)
    } catch (error) {
      console.error('Error exporting report:', error)
      throw error
    }
  }
}