// pages/admin/Dashboard.tsx
import { useState, useEffect } from 'react'
import { toast } from 'react-hot-toast'
import OverviewCard from '@/components/ui/OverviewCard'
import ChartCard from '@/components/ui/ChartCard'
import StatsCard from '@/components/ui/StatsCard'
import ActivityList from '@/components/ui/ActivityList'
import SystemStatus from '@/components/ui/SystemStatus'
import SalesChart from '@/components/admin/charts/SalesChart'
import CustomPieChart from '@/components/admin/charts/PieChart'
import {
  DollarSign,
  ShoppingBag,
  Users,
  TrendingUp,
  Package,
  AlertTriangle,
  Loader2,
} from 'lucide-react'

// Import service (untuk fungsi)
import { dashboardService } from '@/services/dashboard'

// Import type (hanya dari types)
import type { 
  DashboardStats, 
  Activity, 
  SystemStatus as StatusType,
  RecentOrder,
  TopProduct,
  SalesReportParams  // ✅ Sekarang sudah ada
} from '@/types/dashboard'

import { calculatePercentageChange, getTrendDirection } from '@/utils/percentage'

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<DashboardStats | null>(null)
  
  const [chartPeriod, setChartPeriod] = useState<'week' | 'month' | 'year'>('week')
  
  const [salesData, setSalesData] = useState<any[]>([])
  const [categoryData, setCategoryData] = useState<any[]>([])

  useEffect(() => {
    fetchDashboardData()
  }, [])

  useEffect(() => {
    if (chartPeriod) {
      fetchSalesData()
    }
  }, [chartPeriod])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      const data = await dashboardService.getStats()
      
      if (data && typeof data === 'object') {
        setStats(data)
        
        if (data.top_products && Array.isArray(data.top_products)) {
          const categories = data.top_products.slice(0, 5).map((product: TopProduct, index: number) => ({
            name: product.name || 'Unknown',
            value: product.sold_count || 0,
            color: [
              '#22c55e', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'
            ][index % 5],
          }))
          setCategoryData(categories)
        } else {
          setCategoryData([])
        }
      } else {
        setStats(null)
        setCategoryData([])
        toast.error('Invalid data format received')
      }
    } catch (error) {
      toast.error('Failed to load dashboard data')
      console.error('Dashboard data error:', error)
      setStats(null)
      setCategoryData([])
    } finally {
      setLoading(false)
    }
  }

  const fetchSalesData = async () => {
    try {
      const data = await dashboardService.getSalesReport({ period: chartPeriod })
      
      if (data && data.sales_data && Array.isArray(data.sales_data)) {
        setSalesData(data.sales_data)
      } else {
        setSalesData([])
      }
    } catch (error) {
      console.error('Failed to load sales data:', error)
      setSalesData([])
    }
  }

  const activities: Activity[] = Array.isArray(stats?.recent_orders) 
    ? stats.recent_orders.map((order: RecentOrder, index: number) => ({
        id: order.id || index + 1,
        type: 'order',
        title: `<strong>New order ${order.order_number || 'N/A'}</strong> from ${order.customer_name || 'Unknown'}`,
        description: `Order amount: ${order.total_formatted || 'Rp 0'}`,
        time: order.created_at || new Date().toISOString(),
      }))
    : []

  const getLowStockCount = (): number => {
    if (stats?.products?.low_stock && !isNaN(Number(stats.products.low_stock))) {
      return Number(stats.products.low_stock)
    }
    return 0
  }

  const systemStatuses: StatusType[] = [
    { name: 'Server Load', value: '42%', status: 'good' },
    { name: 'Database', value: 'Healthy', status: 'good' },
    { name: 'Storage', value: '78%', status: 'warning' },
    { 
      name: 'Low Stock', 
      value: getLowStockCount().toString(), 
      status: getLowStockCount() > 5 ? 'warning' : 'good' 
    },
  ]

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'pending': return 'text-yellow-500'
      case 'processing': return 'text-blue-500'
      case 'shipped': return 'text-purple-500'
      case 'delivered': return 'text-green-500'
      case 'cancelled': return 'text-red-500'
      default: return 'text-gray-500'
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-gray-500" />
      </div>
    )
  }

  const overviewData = [
    {
      title: 'Total Revenue',
      value: stats?.sales?.today_formatted || 'Rp 0',
      change: calculatePercentageChange(
        stats?.sales?.today || 0, 
        stats?.sales?.yesterday || 0
      ),
      trend: getTrendDirection(
        calculatePercentageChange(
          stats?.sales?.today || 0, 
          stats?.sales?.yesterday || 0
        )
      ),
      icon: <DollarSign className="w-5 h-5" />,
      iconBg: 'bg-gradient-to-br from-black to-gray-800',
    },
    {
      title: 'Total Orders',
      value: stats?.orders?.today?.toString() || '0',
      change: calculatePercentageChange(
        stats?.orders?.today || 0, 
        stats?.orders?.yesterday || 0
      ),
      trend: getTrendDirection(
        calculatePercentageChange(
          stats?.orders?.today || 0, 
          stats?.orders?.yesterday || 0
        )
      ),
      icon: <ShoppingBag className="w-5 h-5" />,
      iconBg: 'bg-gradient-to-br from-red-500 to-red-400',
    },
    {
      title: 'New Customers',
      value: stats?.customers?.today?.toString() || '0',
      change: calculatePercentageChange(
        stats?.customers?.today || 0, 
        stats?.customers?.yesterday || 0
      ),
      trend: getTrendDirection(
        calculatePercentageChange(
          stats?.customers?.today || 0, 
          stats?.customers?.yesterday || 0
        )
      ),
      icon: <Users className="w-5 h-5" />,
      iconBg: 'bg-gradient-to-br from-blue-500 to-blue-400',
    },
    {
      title: 'New Products',
      value: stats?.products?.today?.toString() || '0',
      change: calculatePercentageChange(
        stats?.products?.today || 0, 
        stats?.products?.yesterday || 0
      ),
      trend: getTrendDirection(
        calculatePercentageChange(
          stats?.products?.today || 0, 
          stats?.products?.yesterday || 0
        )
      ),
      icon: <Package className="w-5 h-5" />,
      iconBg: 'bg-gradient-to-br from-green-500 to-green-400',
    },
  ]

  return (
    <div className="space-y-6 w-full max-w-full overflow-x-hidden">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {overviewData.map((item, index: number) => (
          <OverviewCard key={index} {...item} />
        ))}
      </div>

      {getLowStockCount() > 0 && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg">
          <div className="flex items-center">
            <AlertTriangle className="w-5 h-5 text-yellow-400" />
            <p className="ml-3 text-sm text-yellow-700">
              <span className="font-bold">{getLowStockCount()}</span> products are running low on stock. 
              <a href="/admin/inventory" className="ml-2 font-medium underline hover:text-yellow-600">
                Check inventory →
              </a>
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 w-full">
        <div className="lg:col-span-2 min-w-0">
          <ChartCard
            title="Sales Performance"
            actions={[
              { label: 'Week', value: 'week' },
              { label: 'Month', value: 'month' },
              { label: 'Year', value: 'year' },
            ]}
            onActionChange={(value) => setChartPeriod(value as 'week' | 'month' | 'year')}
          >
            {salesData.length > 0 ? (
              <div className="w-full overflow-hidden">
                <SalesChart 
                  data={salesData.map((item: any) => ({
                    date: item.period || '',
                    label: item.period_label || item.period || '',
                    sales: item.total_sales || 0,
                    orders: item.total_orders || 0,
                  }))} 
                  type="area"
                  height={350}
                />
              </div>
            ) : (
              <div className="h-80 bg-gradient-to-b from-gray-50 to-gray-100 rounded-lg flex flex-col items-center justify-center text-gray-400">
                <TrendingUp className="w-16 h-16 mb-3 opacity-50" />
                <p>No sales data available</p>
              </div>
            )}
          </ChartCard>
        </div>

        <div className="min-w-0">
          <ChartCard
            title="Top Products by Sales"
            actions={[
              { label: 'Revenue', value: 'revenue' },
              { label: 'Units', value: 'units' },
            ]}
          >
            {categoryData.length > 0 ? (
              <div className="w-full overflow-hidden">
                <CustomPieChart data={categoryData} height={350} />
              </div>
            ) : (
              <div className="h-80 bg-gradient-to-b from-gray-50 to-gray-100 rounded-lg flex flex-col items-center justify-center text-gray-400">
                <Package className="w-16 h-16 mb-3 opacity-50" />
                <p>No product data available</p>
              </div>
            )}
          </ChartCard>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <StatsCard title="Top Selling Products" viewAllLink="/admin/products">
          <ul className="divide-y divide-gray-200">
            {Array.isArray(stats?.top_products) && stats.top_products.map((product: TopProduct) => (
              <li key={product.id || Math.random()} className="py-3 first:pt-0 last:pb-0 flex justify-between items-center">
                <div>
                  <span className="text-sm text-gray-700">{product.name || 'Unknown'}</span>
                  <p className="text-xs text-gray-500">{product.price_formatted || 'Rp 0'}</p>
                </div>
                <span className="text-sm font-semibold">{(product.sold_count || 0)} sold</span>
              </li>
            ))}
          </ul>
        </StatsCard>

        <StatsCard title="Recent Orders" viewAllLink="/admin/orders">
          <ul className="divide-y divide-gray-200">
            {Array.isArray(stats?.recent_orders) && stats.recent_orders.map((order: RecentOrder) => (
              <li key={order.id || Math.random()} className="py-3 first:pt-0 last:pb-0 flex justify-between items-center">
                <div>
                  <span className="text-sm text-gray-700">{order.order_number || 'N/A'}</span>
                  <p className="text-xs text-gray-500">{order.customer_name || 'Unknown'}</p>
                </div>
                <div className="text-right">
                  <span className="text-sm font-semibold">{order.total_formatted || 'Rp 0'}</span>
                  <p className={`text-xs ${getStatusColor(order.status || '')}`}>
                    {order.status_label || order.status || 'Unknown'}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </StatsCard>
      </div>

      <StatsCard title="Recent Activities" viewAllLink="#">
        <ActivityList activities={activities} />
      </StatsCard>

      <SystemStatus statuses={systemStatuses} />
    </div>
  )
}

export default AdminDashboard