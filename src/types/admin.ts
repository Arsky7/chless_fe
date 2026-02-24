export interface OverviewData {
  title: string
  value: string
  change: number
  trend: 'up' | 'down'
  icon: string
  iconBg: string
}

export interface Activity {
  id: number
  type: 'order' | 'user' | 'product' | 'system'
  title: string
  description: string
  time: string
}

export interface TopProduct {
  id: number
  name: string
  sold: number
}

export interface RecentOrder {
  id: string
  number: string
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  customer: string
}

export interface SystemStatus {
  name: string
  value: string | number
  status: 'good' | 'warning' | 'error'
}

export interface ChartData {
  labels: string[]
  values: number[]
}