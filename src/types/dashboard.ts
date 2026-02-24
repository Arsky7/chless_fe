// types/dashboard.ts
export interface DashboardStats {
  sales: {
    today: number
    yesterday: number
    week: number
    last_week: number
    month: number
    last_month: number
    total: number
    today_formatted: string
    yesterday_formatted: string
    week_formatted: string
    month_formatted: string
    total_formatted: string
  }
  orders: {
    today: number
    yesterday: number
    week: number
    last_week: number
    month: number
    last_month: number
    pending: number
    processing: number
    shipped: number
    delivered: number
    cancelled: number
    total: number
  }
  customers: {
    today: number
    yesterday: number
    week: number
    last_week: number
    month: number
    last_month: number
    total: number
    active: number
  }
  products: {
    today: number
    yesterday: number
    week: number
    last_week: number
    month: number
    last_month: number
    total: number
    active: number
    out_of_stock: number
    low_stock: number
    featured: number
  }
  returns: {
    pending: number
    approved: number
    rejected: number
    completed: number
    total: number
  }
  recent_orders: RecentOrder[]
  top_products: TopProduct[]
  sales_chart: SalesChartData[]
}

export interface RecentOrder {
  id: number
  order_number: string
  customer_name: string
  total: number
  total_formatted: string
  status: string
  status_label: string
  created_at: string
}

export interface TopProduct {
  id: number
  name: string
  slug: string
  sold_count: number
  // 🔴 PERUBAHAN: price (bukan base_price)
  price: number
  price_formatted: string
  stock_status: string
}

export interface SalesChartData {
  date: string
  label: string
  sales: number
  orders: number
}

export interface Activity {
  id: number
  type: 'order' | 'user' | 'product' | 'system'
  title: string
  description: string
  time: string
}

export interface SystemStatus {
  name: string
  value: string | number
  status: 'good' | 'warning' | 'error'
}

export interface SalesReportData {
  period: string
  from_date: string
  to_date: string
  summary: {
    total_orders: number
    total_sales: number
    total_sales_formatted: string
    average_order: number
    average_order_formatted: string
    total_items: number
  }
  sales_data: Array<{
    period: string
    total_orders: number
    total_sales: number
    average_order_value: number
    period_label?: string
  }>
}

export interface ProductReportData {
  products: Array<{
    id: number
    name: string
    sku: string
    category: string
    brand: string
    sold_quantity: number
    total_revenue: number
    total_revenue_formatted: string
    current_stock: number
  }>
  meta: {
    current_page: number
    last_page: number
    total: number
    from_date: string
    to_date: string
    per_page: number
  }
}

// 🔴 TAMBAHKAN INI untuk mengatasi error import
export interface SalesReportParams {
  period?: 'week' | 'month' | 'year'
  from_date?: string
  to_date?: string
}