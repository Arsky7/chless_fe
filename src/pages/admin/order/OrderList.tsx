import { useState, useEffect, useCallback } from 'react'
import OrderStatsComponent from './components/OrderStats'
import OrderFilters from './components/OrderFilters'
import TodaySummaryComponent from './components/TodaySummary'
import OrdersTable from './components/OrdersTable'
import {
  Order,
  OrderStats as OrderStatsType,
  TodaySummary,
  FilterParams,
  PaginationMeta
} from './types/order.types'
import adminOrderService from '../../../services/adminOrderService'
import { toast } from 'react-hot-toast'

const OrderList = () => {
  const [orders, setOrders] = useState<Order[]>([])
  const [stats, setStats] = useState<OrderStatsType | null>(null)
  const [summary, setSummary] = useState<TodaySummary | null>(null)
  const [pagination, setPagination] = useState<PaginationMeta | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isStatsLoading, setIsStatsLoading] = useState(true)

  const [filters, setFilters] = useState<FilterParams>({
    page: 1,
    per_page: 15,
    status: 'all'
  })

  const fetchOrders = useCallback(async () => {
    setIsLoading(true)
    try {
      // Map 'all' status to undefined for API
      const apiParams = { ...filters }
      if (apiParams.status === 'all') delete apiParams.status

      const response = await adminOrderService.getOrders(apiParams)
      if (response.success) {
        setOrders(response.data)
        setPagination(response.meta)
      }
    } catch (error) {
      console.error('Failed to fetch orders:', error)
      toast.error('Failed to load orders')
    } finally {
      setIsLoading(false)
    }
  }, [filters])

  const fetchStats = useCallback(async () => {
    setIsStatsLoading(true)
    try {
      const response = await adminOrderService.getOrderStats()
      if (response.success) {
        setStats(response.data.stats)
        setSummary(response.data.today_summary)
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error)
    } finally {
      setIsStatsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchOrders()
  }, [fetchOrders])

  useEffect(() => {
    fetchStats()
  }, [fetchStats])

  const handleStatClick = (status: string) => {
    setFilters(prev => ({ ...prev, status, page: 1 }))
  }

  const handleApplyFilters = (newFilters: FilterParams) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters,
      page: 1
    }))
  }

  const handleResetFilters = () => {
    setFilters({
      page: 1,
      per_page: 15,
      status: 'all'
    })
  }

  const handlePageChange = (newPage: number) => {
    setFilters(prev => ({ ...prev, page: newPage }))
  }

  const handleExport = () => {
    toast.success('Preparing export...')
    // Implementation for export
  }

  const handleViewOrder = (orderId: number) => {
    // Placeholder for viewing order details
    window.location.href = `/admin/orders/${orderId}`
  }

  const handleUpdateStatus = async (orderId: number, status: string) => {
    try {
      const response = await adminOrderService.updateStatus(orderId, { status })
      if (response.success) {
        toast.success('Order status updated')
        fetchOrders()
        fetchStats()
      }
    } catch (error) {
      toast.error('Failed to update status')
    }
  }

  const handlePrintOrder = (orderId: number) => {
    alert(`Print Invoice: ORD-${orderId}`)
  }

  const handleDeleteOrder = async (orderId: number) => {
    if (confirm(`Delete order #${orderId}?`)) {
      try {
        const response = await adminOrderService.deleteOrder(orderId)
        if (response.success) {
          toast.success('Order deleted')
          fetchOrders()
          fetchStats()
        }
      } catch (error) {
        toast.error('Failed to delete order')
      }
    }
  }

  return (
    <div className="space-y-6 w-full max-w-full px-4 sm:px-6 lg:px-8">
      {/* Stats Section */}
      <div className="w-full">
        {stats && (
          <OrderStatsComponent
            stats={stats}
            onStatClick={handleStatClick}
            isLoading={isStatsLoading}
          />
        )}
      </div>

      {/* Filters Section */}
      <div className="w-full">
        <OrderFilters
          onApplyFilters={handleApplyFilters}
          onResetFilters={handleResetFilters}
          onExport={handleExport}
        />
      </div>

      {/* Summary Section */}
      <div className="w-full">
        {summary && (
          <TodaySummaryComponent
            summary={summary}
            isLoading={isStatsLoading}
          />
        )}
      </div>

      {/* Table Section */}
      <div className="w-full">
        <OrdersTable
          orders={orders}
          pagination={pagination}
          onPageChange={handlePageChange}
          isLoading={isLoading}
          onViewOrder={handleViewOrder}
          onUpdateStatus={handleUpdateStatus}
          onPrintOrder={handlePrintOrder}
          onDeleteOrder={handleDeleteOrder}
          onCreateOrder={() => { }}
          onPrintLabels={() => { }}
        />
      </div>
    </div>
  )
}

export default OrderList
