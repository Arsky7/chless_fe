import { useState } from 'react'
import { Eye, Edit2, Printer, Trash2, Plus, MoreVertical } from 'lucide-react'
import { Order } from '../types/order.types'

interface OrdersTableProps {
  orders: Order[]
  onViewOrder: (orderId: string) => void
  onEditOrder: (orderId: string) => void
  onPrintOrder: (orderId: string) => void
  onDeleteOrder: (orderId: string) => void
  onCreateOrder: () => void
  onPrintLabels: () => void
  totalOrders: number
}

const OrdersTable = ({
  orders,
  onViewOrder,
  onEditOrder,
  onPrintOrder,
  onDeleteOrder,
  onCreateOrder,
  onPrintLabels,
  totalOrders,
}: OrdersTableProps) => {
  const [selectedOrders, setSelectedOrders] = useState<string[]>([])
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null)

  const toggleSelectAll = () => {
    if (selectedOrders.length === orders.length) {
      setSelectedOrders([])
    } else {
      setSelectedOrders(orders.map(o => o.id))
    }
  }

  const toggleSelectOrder = (orderId: string) => {
    if (selectedOrders.includes(orderId)) {
      setSelectedOrders(selectedOrders.filter(id => id !== orderId))
    } else {
      setSelectedOrders([...selectedOrders, orderId])
    }
  }

  const toggleExpandOrder = (orderId: string) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId)
  }

  const getStatusBadge = (status: Order['status']) => {
    const statusClasses = {
      pending: 'bg-yellow-100 text-yellow-800',
      processing: 'bg-blue-100 text-blue-800',
      shipped: 'bg-purple-100 text-purple-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
    }
    return statusClasses[status]
  }

  const getPaymentBadge = (payment: Order['payment']) => {
    const paymentClasses = {
      paid: 'text-green-600 bg-green-50',
      pending: 'text-yellow-600 bg-yellow-50',
      failed: 'text-red-600 bg-red-50',
    }
    return paymentClasses[payment]
  }

  const getPaymentIcon = (payment: Order['payment']) => {
    switch (payment) {
      case 'paid': return '✓'
      case 'pending': return '⏱'
      case 'failed': return '✗'
      default: return ''
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Table Header - Responsive */}
      <div className="px-4 sm:px-6 py-4 border-b border-gray-200 bg-gray-50
                    flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h3 className="text-lg font-semibold">
          Recent Orders <span className="text-sm font-normal text-gray-500 ml-2">
            (Total: {totalOrders} orders)
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
            <span className="sm:hidden">Labels</span>
          </button>
          <button
            onClick={onCreateOrder}
            className="flex-1 sm:flex-none px-3 sm:px-4 py-2 bg-black text-white rounded-lg 
                     hover:bg-red-600 transition-colors text-sm font-medium
                     flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Create Order</span>
            <span className="sm:hidden">Create</span>
          </button>
        </div>
      </div>

      {/* Orders List - Card Layout untuk Mobile, Grid untuk Desktop */}
      <div className="divide-y divide-gray-200">
        {orders.map((order) => (
          <div key={order.id} className="p-4 sm:p-6 hover:bg-gray-50 transition-colors">
            {/* Desktop Grid Layout (hidden on mobile) */}
            <div className="hidden lg:grid lg:grid-cols-12 lg:gap-4 lg:items-center">
              {/* Checkbox */}
              <div className="col-span-1">
                <input
                  type="checkbox"
                  checked={selectedOrders.includes(order.id)}
                  onChange={() => toggleSelectOrder(order.id)}
                  className="rounded border-gray-300 text-black focus:ring-black"
                />
              </div>

              {/* Order ID */}
              <div className="col-span-1">
                <span className="font-mono font-semibold text-gray-900 text-sm">
                  {order.id}
                </span>
              </div>

              {/* Customer */}
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

              {/* Items Summary */}
              <div className="col-span-2">
                <div className="text-sm font-medium">
                  {order.items.length} item{order.items.length > 1 ? 's' : ''}
                </div>
                <div className="text-xs text-gray-500 truncate">
                  {order.items.map(item => item.name).join(', ')}
                </div>
              </div>

              {/* Date */}
              <div className="col-span-1">
                <div className="text-sm">{order.date.split(' ')[0]}</div>
                <div className="text-xs text-gray-500">{order.date.split(' ')[1]}</div>
              </div>

              {/* Total */}
              <div className="col-span-1">
                <div className="font-bold text-gray-900 text-sm">{order.total}</div>
              </div>

              {/* Status */}
              <div className="col-span-1">
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(order.status)}`}>
                  {order.status}
                </span>
              </div>

              {/* Payment */}
              <div className="col-span-1">
                <div className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${getPaymentBadge(order.payment)}`}>
                  <span>{getPaymentIcon(order.payment)}</span>
                  <span className="capitalize">{order.payment}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="col-span-1">
                <div className="flex gap-1">
                  <button
                    onClick={() => onViewOrder(order.id)}
                    className="w-7 h-7 rounded border border-gray-300 hover:bg-blue-500 
                             hover:text-white hover:border-blue-500 transition-all"
                    title="View Details"
                  >
                    <Eye className="w-3 h-3 mx-auto" />
                  </button>
                  <button
                    onClick={() => onEditOrder(order.id)}
                    className="w-7 h-7 rounded border border-gray-300 hover:bg-yellow-500 
                             hover:text-white hover:border-yellow-500 transition-all"
                    title="Edit Order"
                  >
                    <Edit2 className="w-3 h-3 mx-auto" />
                  </button>
                  <button
                    onClick={() => onPrintOrder(order.id)}
                    className="w-7 h-7 rounded border border-gray-300 hover:bg-purple-500 
                             hover:text-white hover:border-purple-500 transition-all"
                    title="Print Invoice"
                  >
                    <Printer className="w-3 h-3 mx-auto" />
                  </button>
                  {order.status === 'cancelled' && (
                    <button
                      onClick={() => onDeleteOrder(order.id)}
                      className="w-7 h-7 rounded border border-gray-300 hover:bg-red-500 
                               hover:text-white hover:border-red-500 transition-all"
                      title="Delete Order"
                    >
                      <Trash2 className="w-3 h-3 mx-auto" />
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Mobile/Tablet Card Layout (hidden on desktop) */}
            <div className="lg:hidden">
              {/* Header dengan Order ID dan Status */}
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={selectedOrders.includes(order.id)}
                    onChange={() => toggleSelectOrder(order.id)}
                    className="rounded border-gray-300 text-black focus:ring-black"
                  />
                  <div>
                    <span className="font-mono font-semibold text-gray-900 text-sm block">
                      {order.id}
                    </span>
                    <span className="text-xs text-gray-500">{order.date}</span>
                  </div>
                </div>
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(order.status)}`}>
                  {order.status}
                </span>
              </div>

              {/* Customer Info */}
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 
                              flex items-center justify-center text-white font-semibold text-sm">
                  {order.customer.initial}
                </div>
                <div>
                  <div className="font-medium text-gray-900">{order.customer.name}</div>
                  <div className="text-xs text-gray-500">{order.customer.email}</div>
                </div>
              </div>

              {/* Items Preview */}
              <div className="mb-3">
                <button
                  onClick={() => toggleExpandOrder(order.id)}
                  className="text-sm font-medium text-gray-700 flex items-center gap-1"
                >
                  {order.items.length} items
                  <MoreVertical className="w-3 h-3" />
                </button>
                {expandedOrder === order.id && (
                  <div className="mt-2 space-y-2">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg text-sm">
                        <div className="w-6 h-6 bg-gradient-to-br from-pink-500 to-orange-400 
                                      rounded flex items-center justify-center text-white text-xs">
                          <i className={`fas ${item.icon}`}></i>
                        </div>
                        <div className="flex-1">
                          <div className="font-medium">{item.name}</div>
                          <div className="text-xs text-gray-500">{item.variant}</div>
                        </div>
                        <div className="font-semibold">×{item.quantity}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer dengan Total, Payment, dan Actions */}
              <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                <div>
                  <div className="font-bold text-gray-900">{order.total}</div>
                  <div className={`flex items-center gap-1 text-xs mt-1 ${getPaymentBadge(order.payment).split(' ')[0]}`}>
                    <span>{getPaymentIcon(order.payment)}</span>
                    <span className="capitalize">{order.payment}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => onViewOrder(order.id)}
                    className="w-8 h-8 rounded border border-gray-300 hover:bg-blue-500 
                             hover:text-white hover:border-blue-500 transition-all"
                  >
                    <Eye className="w-4 h-4 mx-auto" />
                  </button>
                  <button
                    onClick={() => onEditOrder(order.id)}
                    className="w-8 h-8 rounded border border-gray-300 hover:bg-yellow-500 
                             hover:text-white hover:border-yellow-500 transition-all"
                  >
                    <Edit2 className="w-4 h-4 mx-auto" />
                  </button>
                  <button
                    onClick={() => onPrintOrder(order.id)}
                    className="w-8 h-8 rounded border border-gray-300 hover:bg-purple-500 
                             hover:text-white hover:border-purple-500 transition-all"
                  >
                    <Printer className="w-4 h-4 mx-auto" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {orders.length === 0 && (
        <div className="text-center py-16">
          <div className="text-gray-400 mb-3 text-4xl">📦</div>
          <h4 className="text-lg font-semibold text-gray-600 mb-2">No orders found</h4>
          <p className="text-sm text-gray-500">Try adjusting your filters or create a new order</p>
        </div>
      )}
    </div>
  )
}

export default OrdersTable