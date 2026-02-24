import { useState } from 'react'
import { Filter, RotateCcw, Download } from 'lucide-react'
import { FilterParams } from '../types/order.types'

interface OrderFiltersProps {
  onApplyFilters: (filters: FilterParams) => void
  onResetFilters: () => void
  onExport: () => void
}

const OrderFilters = ({ onApplyFilters, onResetFilters, onExport }: OrderFiltersProps) => {
  const [filters, setFilters] = useState<FilterParams>({
    status: 'all',
    dateRange: 'today',
    customer: '',
    orderId: '',
  })
  const [isExpanded, setIsExpanded] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target
    setFilters(prev => ({ ...prev, [name]: value }))
  }

  const handleApply = () => {
    onApplyFilters(filters)
  }

  const handleReset = () => {
    setFilters({
      status: 'all',
      dateRange: 'today',
      customer: '',
      orderId: '',
    })
    onResetFilters()
  }

  return (
    <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-200">
      {/* Mobile Toggle */}
      <div className="sm:hidden mb-4">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full px-4 py-2 bg-gray-50 rounded-lg text-sm font-medium
                   flex items-center justify-between"
        >
          <span className="flex items-center gap-2">
            <Filter className="w-4 h-4" />
            Filters
          </span>
          <span>{isExpanded ? '−' : '+'}</span>
        </button>
      </div>

      {/* Filter Grid - Responsive */}
      <div className={`${isExpanded ? 'block' : 'hidden'} sm:block`}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Order Status
            </label>
            <select
              name="status"
              value={filters.status}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg 
                       focus:ring-2 focus:ring-black focus:border-transparent
                       bg-gray-50 text-sm"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          {/* Date Range Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date Range
            </label>
            <select
              name="dateRange"
              value={filters.dateRange}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg 
                       focus:ring-2 focus:ring-black focus:border-transparent
                       bg-gray-50 text-sm"
            >
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="custom">Custom Range</option>
            </select>
          </div>

          {/* Customer Search */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Customer
            </label>
            <input
              type="text"
              name="customer"
              value={filters.customer}
              onChange={handleChange}
              placeholder="Search customer..."
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg 
                       focus:ring-2 focus:ring-black focus:border-transparent
                       bg-gray-50 text-sm"
            />
          </div>

          {/* Order ID Search */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Order ID
            </label>
            <input
              type="text"
              name="orderId"
              value={filters.orderId}
              onChange={handleChange}
              placeholder="Search order ID..."
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg 
                       focus:ring-2 focus:ring-black focus:border-transparent
                       bg-gray-50 text-sm"
            />
          </div>
        </div>

        {/* Action Buttons - Responsive */}
        <div className="flex flex-wrap gap-3 mt-6">
          <button
            onClick={handleApply}
            className="flex-1 sm:flex-none px-4 sm:px-6 py-2.5 bg-black text-white rounded-lg 
                     hover:bg-red-600 transition-all font-medium text-sm
                     flex items-center justify-center gap-2"
          >
            <Filter className="w-4 h-4" />
            <span>Apply</span>
          </button>
          <button
            onClick={handleReset}
            className="flex-1 sm:flex-none px-4 sm:px-6 py-2.5 border border-gray-300 rounded-lg 
                     hover:bg-gray-50 transition-all font-medium text-sm
                     flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset</span>
          </button>
          <button
            onClick={onExport}
            className="flex-1 sm:flex-none px-4 sm:px-6 py-2.5 border border-gray-300 rounded-lg 
                     hover:bg-gray-50 transition-all font-medium text-sm
                     flex items-center justify-center gap-2 sm:ml-auto"
          >
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default OrderFilters