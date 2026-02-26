export interface OrderItem {
  id: number
  product_id?: number
  product_name: string
  size: string | null
  quantity: number
  price: number
  price_formatted: string
  subtotal: number
  subtotal_formatted: string
}

export interface Customer {
  name: string
  email: string
  initial: string
}

export interface Order {
  id: number
  order_number: string
  customer: Customer
  date: string
  items?: OrderItem[]
  items_count: number
  total: number
  total_formatted: string
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  payment_status: 'unpaid' | 'paid' | 'failed'
  payment_method: string | null
  shipping_address: string | null
  shipping_cost: number
  tracking_number: string | null
  notes: string | null
  paid_at: string | null
  shipped_at: string | null
  delivered_at: string | null
  created_at: string
}

export interface OrderStats {
  pending: number
  processing: number
  shipped: number
  delivered: number
  cancelled: number
  pending_today: number
  processing_today: number
  shipped_today: number
  delivered_today: number
  cancelled_today: number
}

export interface TodaySummary {
  new_orders: number
  new_orders_change: number
  total_revenue: number
  total_revenue_formatted: string
  revenue_change: number
  avg_order_value: number
  avg_order_formatted: string
  avg_order_change: number
}

export interface FilterParams {
  status?: string
  search?: string
  date_from?: string
  date_to?: string
  per_page?: number
  page?: number
}

export interface PaginationMeta {
  current_page: number
  last_page: number
  per_page: number
  total: number
  from: number
  to: number
}

export interface OrdersResponse {
  success: boolean
  data: Order[]
  meta: PaginationMeta
}

export interface OrderStatsResponse {
  success: boolean
  data: {
    stats: OrderStats
    today_summary: TodaySummary
  }
}

export interface OrderDetailResponse {
  success: boolean
  data: Order
}
