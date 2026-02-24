// services/dashboard.ts
import { apiService } from './api'
import type { 
  DashboardStats, 
  SalesReportData,
  SalesChartData,
  Activity,
  SystemStatus,
  RecentOrder,
  TopProduct
} from '@/types/dashboard'

export const dashboardService = {
  /**
   * Get dashboard statistics
   */
  getStats: async (): Promise<DashboardStats> => {
    try {
      const response = await apiService.get<{ data: DashboardStats }>('/admin/dashboard/stats')
      
      if (response && response.data) {
        return response.data
      }
      
      throw new Error('Invalid response format')
      
    } catch (error) {
      console.error('[DashboardService] Failed to fetch stats:', error)
      throw error
    }
  },

  /**
   * Get sales report data
   * @param params - Query parameters (period, from_date, to_date)
   */
  getSalesReport: async (params?: {
    period?: 'week' | 'month' | 'year'
    from_date?: string
    to_date?: string
  }): Promise<SalesReportData> => {
    try {
      const queryParams: Record<string, string> = {}
      
      if (params?.period) queryParams.period = params.period
      if (params?.from_date) queryParams.from_date = params.from_date
      if (params?.to_date) queryParams.to_date = params.to_date
      
      const response = await apiService.get<{ data: SalesReportData }>('/admin/reports/sales', queryParams)
      
      if (response && response.data) {
        return response.data
      }
      
      // Return empty structure
      return {
        period: params?.period || 'week',
        from_date: params?.from_date || '',
        to_date: params?.to_date || '',
        summary: {
          total_orders: 0,
          total_sales: 0,
          total_sales_formatted: 'Rp 0',
          average_order: 0,
          average_order_formatted: 'Rp 0',
          total_items: 0
        },
        sales_data: []
      }
      
    } catch (error) {
      console.error('[DashboardService] Failed to fetch sales report:', error)
      return {
        period: params?.period || 'week',
        from_date: params?.from_date || '',
        to_date: params?.to_date || '',
        summary: {
          total_orders: 0,
          total_sales: 0,
          total_sales_formatted: 'Rp 0',
          average_order: 0,
          average_order_formatted: 'Rp 0',
          total_items: 0
        },
        sales_data: []
      }
    }
  },

  /**
   * Get recent orders
   */
  getRecentOrders: async (limit: number = 5): Promise<RecentOrder[]> => {
    try {
      const response = await apiService.get<{ data: RecentOrder[] }>('/admin/orders/recent', { limit })
      return response.data || []
    } catch (error) {
      console.error('[DashboardService] Failed to fetch recent orders:', error)
      return []
    }
  },

  /**
   * Get top products
   */
  getTopProducts: async (limit: number = 5): Promise<TopProduct[]> => {
    try {
      const response = await apiService.get<{ data: TopProduct[] }>('/admin/products/top', { limit })
      return response.data || []
    } catch (error) {
      console.error('[DashboardService] Failed to fetch top products:', error)
      return []
    }
  },

  /**
   * Get system status
   */
  getSystemStatus: async (): Promise<SystemStatus[]> => {
    try {
      const response = await apiService.get<{ data: SystemStatus[] }>('/admin/system/status')
      return response.data || []
    } catch (error) {
      console.error('[DashboardService] Failed to fetch system status:', error)
      // Return default status
      return [
        { name: 'Server Load', value: '42%', status: 'good' },
        { name: 'Database', value: 'Healthy', status: 'good' },
        { name: 'Storage', value: '78%', status: 'warning' },
        { name: 'Cache', value: 'Operational', status: 'good' }
      ]
    }
  },

  /**
   * Get recent activities
   */
  getRecentActivities: async (limit: number = 10): Promise<Activity[]> => {
    try {
      const response = await apiService.get<{ data: Activity[] }>('/admin/activities/recent', { limit })
      return response.data || []
    } catch (error) {
      console.error('[DashboardService] Failed to fetch recent activities:', error)
      return []
    }
  },

  /**
   * Get low stock products
   */
  getLowStockProducts: async (threshold: number = 10): Promise<TopProduct[]> => {
    try {
      const response = await apiService.get<{ data: TopProduct[] }>('/admin/products/low-stock', { threshold })
      return response.data || []
    } catch (error) {
      console.error('[DashboardService] Failed to fetch low stock products:', error)
      return []
    }
  },

  /**
   * Get sales chart data
   */
  getSalesChart: async (period: 'week' | 'month' | 'year' = 'week'): Promise<SalesChartData[]> => {
    try {
      const response = await apiService.get<{ data: SalesChartData[] }>('/admin/charts/sales', { period })
      return response.data || []
    } catch (error) {
      console.error('[DashboardService] Failed to fetch sales chart:', error)
      return []
    }
  },

  /**
   * Refresh dashboard data (clear cache)
   */
  refreshDashboard: async (): Promise<boolean> => {
    try {
      await apiService.post('/admin/dashboard/refresh')
      return true
    } catch (error) {
      console.error('[DashboardService] Failed to refresh dashboard:', error)
      return false
    }
  }
}