export interface OrderItem {
  name: string
  variant: string
  quantity: number
  icon: string
}

export interface Customer {
  name: string
  email: string
  initial: string
}

export interface Order {
  id: string
  customer: Customer
  date: string
  items: OrderItem[]
  total: string
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  payment: 'paid' | 'pending' | 'failed'
}

export interface OrderStats {
  pending: number
  processing: number
  shipped: number
  delivered: number
  cancelled: number
  pendingToday: number
  processingToday: number
  shippedToday: number
  deliveredToday: number
  cancelledToday: number
}

export interface TodaySummary {
  newOrders: number
  newOrdersChange: number
  totalRevenue: string
  revenueChange: number
  avgOrderValue: string
  avgOrderChange: number
}

export interface FilterParams {
  status: string
  dateRange: string
  customer: string
  orderId: string
}