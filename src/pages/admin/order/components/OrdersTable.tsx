import { useState } from 'react'
import { Eye, Printer, Trash2, Plus, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react'
import { Order, PaginationMeta } from '../types/order.types'

interface OrdersTableProps {
  orders: Order[]
  pagination: PaginationMeta | null
  onPageChange: (page: number) => void
  isLoading: boolean
  onViewOrder: (orderId: number) => void
  onUpdateStatus: (orderId: number, status: string) => void
  onPrintOrder: (orderId: number) => void
  onDeleteOrder: (orderId: number) => void
  onCreateOrder: () => void
  onPrintLabels: () => void
}

const OrdersTable = ({
  orders,
  pagination,
  onPageChange,
  isLoading,
  onViewOrder,
  onUpdateStatus,
  onPrintOrder,
  onDeleteOrder,
  onCreateOrder,
  onPrintLabels,
}: OrdersTableProps) => {
  const [selectedOrders, setSelectedOrders] = useState<number[]>([])

  const toggleSelectOrder = (orderId: number) => {
    if (selectedOrders.includes(orderId)) {
      setSelectedOrders(selectedOrders.filter(id => id !== orderId))
    } else {
      setSelectedOrders([...selectedOrders, orderId])
    }
  }

  const getStatusBadge = (status: Order['status']) => {
    const statusClasses = {
      pending: 'bg-yellow-100 text-yellow-800',
      processing: 'bg-blue-100 text-blue-800',
      shipped: 'bg-purple-100 text-purple-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
    }
    return statusClasses[status] || 'bg-gray-100 text-gray-800'
  }

  const getPaymentBadge = (payment: Order['payment_status']) => {
    const paymentClasses = {
      paid: 'text-green-600 bg-green-50',
      unpaid: 'text-yellow-600 bg-yellow-50',
      pending: 'text-yellow-600 bg-yellow-50',
      failed: 'text-red-600 bg-red-50',
    }
    return paymentClasses[payment] || 'text-gray-600 bg-gray-50'
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Table Header */}
      <div className="px-4 sm:px-6 py-4 border-b border-gray-200 bg-gray-50
                    flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h3 className="text-lg font-semibold">
          Recent Orders <span className="text-sm font-normal text-gray-500 ml-2">
            ({pagination?.total || 0} orders)
          </span>
        </h3>
        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          <button
            onClick={onPrintLabels}
            className="flex-1 sm:flex-none px-3 sm:px-4 py-2 border border-gray-300 rounded-lg 
                     hover:bg-gray-50 transition-colors text-sm font-medium
                     flex items-center justify-center gap-2"
          >
            <Printer className="w-4 h-4" />
            <span className="hidden sm:inline">Print Labels</span>
          </button>
          <button
            onClick={onCreateOrder}
            className="flex-1 sm:flex-none px-3 sm:px-4 py-2 bg-black text-white rounded-lg 
                     hover:bg-red-600 transition-colors text-sm font-medium
                     flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Create Order</span>
          </button>
        </div>
      </div>

      {/* Loading State */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="w-10 h-10 text-gray-400 animate-spin mb-4" />
          <p className="text-gray-500">Loading orders...</p>
        </div>
      ) : (
        <div className="divide-y divide-gray-200">
          {orders.map((order) => (
            <div key={order.id} className="p-4 sm:p-6 hover:bg-gray-50 transition-colors">
              {/* Desktop View */}
              <div className="hidden lg:grid lg:grid-cols-12 lg:gap-4 lg:items-center">
                <div className="col-span-1">
                  <input
                    type="checkbox"
                    checked={selectedOrders.includes(order.id)}
                    onChange={() => toggleSelectOrder(order.id)}
                    className="rounded border-gray-300 text-black focus:ring-black"
                  />
                </div>

                <div className="col-span-1">
                  <span className="font-mono font-semibold text-gray-900 text-sm">
                    #{order.order_number}
                  </span>
                </div>

                <div className="col-span-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 
                                  flex items-center justify-center text-white font-semibold text-xs flex-shrink-0">
                      {order.customer.initial}
                    </div>
                    <div className="truncate">
                      <div className="font-medium text-gray-900 text-sm truncate">{order.customer.name}</div>
                      <div className="text-xs text-gray-500 truncate">{order.customer.email}</div>
                    </div>
                  </div>
                </div>

                <div className="col-span-2">
                  <div className="text-sm font-medium">
                    {order.items_count} item{order.items_count > 1 ? 's' : ''}
                  </div>
                </div>

                <div className="col-span-1">
                  <div className="text-sm">{order.date.split(' ')[0]}</div>
                </div>

                <div className="col-span-1">
                  <div className="font-bold text-gray-900 text-sm">{order.total_formatted}</div>
                </div>

                <div className="col-span-2">
                  <select
                    value={order.status}
                    onChange={(e) => onUpdateStatus(order.id, e.target.value)}
                    className={`px-2 py-1 text-xs font-semibold rounded-full border-none focus:ring-1 focus:ring-black cursor-pointer ${getStatusBadge(order.status)}`}
                  >
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>

                <div className="col-span-1">
                  <div className={`text-xs font-medium px-2 py-1 rounded-full text-center ${getPaymentBadge(order.payment_status)}`}>
                    {order.payment_status.toUpperCase()}
                  </div>
                </div>

                <div className="col-span-1 flex justify-end gap-1">
                  <button
                    onClick={() => onViewOrder(order.id)}
                    className="w-8 h-8 rounded border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onPrintOrder(order.id)}
                    className="w-8 h-8 rounded border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors"
                  >
                    <Printer className="w-4 h-4" />
                  </button>
                  {order.status === 'cancelled' && (
                    <button
                      onClick={() => onDeleteOrder(order.id)}
                      className="w-8 h-8 rounded border border-gray-300 flex items-center justify-center hover:bg-red-50 text-red-500 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Mobile View - Simplified */}
              <div className="lg:hidden space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-mono font-bold">#{order.order_number}</span>
                  <select
                    value={order.status}
                    onChange={(e) => onUpdateStatus(order.id, e.target.value)}
                    className={`px-2 py-1 text-xs font-semibold rounded-full border-none focus:ring-0 ${getStatusBadge(order.status)}`}
                  >
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-medium text-sm">{order.customer.name}</div>
                    <div className="text-xs text-gray-500">{order.date}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">{order.total_formatted}</div>
                    <div className={`text-[10px] font-bold px-2 py-0.5 rounded-full inline-block ${getPaymentBadge(order.payment_status)}`}>
                      {order.payment_status.toUpperCase()}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && orders.length === 0 && (
        <div className="text-center py-16">
          <div className="text-gray-400 mb-3 text-4xl">📦</div>
          <h4 className="text-lg font-semibold text-gray-600 mb-2">No orders found</h4>
        </div>
      )}

      {/* Pagination */}
      {pagination && pagination.last_page > 1 && (
        <div className="px-4 sm:px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
          <div className="text-sm text-gray-500 hidden sm:block">
            Showing <span className="font-medium">{pagination.from}</span> to <span className="font-medium">{pagination.to}</span> of <span className="font-medium">{pagination.total}</span> orders
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => onPageChange(pagination.current_page - 1)}
              disabled={pagination.current_page === 1}
              className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-white disabled:opacity-50 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="flex items-center px-2 text-sm font-medium">
              Page {pagination.current_page} of {pagination.last_page}
            </div>
            <button
              onClick={() => onPageChange(pagination.current_page + 1)}
              disabled={pagination.current_page === pagination.last_page}
              className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-white disabled:opacity-50 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default OrdersTable
