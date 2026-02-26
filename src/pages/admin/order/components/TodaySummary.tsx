import { TodaySummary } from '../types/order.types'
import { TrendingUp, TrendingDown } from 'lucide-react'

interface TodaySummaryProps {
  summary: TodaySummary
  isLoading?: boolean
}

const TodaySummaryComponent = ({ summary, isLoading }: TodaySummaryProps) => {
  if (isLoading) {
    return (
      <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-200 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/4 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-1/3 mb-6"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-40 bg-gray-50 rounded-lg"></div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-200">
      <h3 className="text-base sm:text-lg font-semibold mb-1">Today's Summary</h3>
      <p className="text-xs sm:text-sm text-gray-500 mb-4 sm:mb-6">Orders processed today</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* New Orders */}
        <div className="text-center p-4 sm:p-6 bg-gray-50 rounded-lg">
          <div className="text-xs sm:text-sm text-gray-500 mb-1 sm:mb-2">New Orders</div>
          <div className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">
            {summary.new_orders}
          </div>
          <div className={`text-xs sm:text-sm flex items-center justify-center gap-1 
            ${summary.new_orders_change >= 0 ? 'text-green-600' : 'text-red-600'}`}
          >
            {summary.new_orders_change >= 0 ? (
              <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4" />
            ) : (
              <TrendingDown className="w-3 h-3 sm:w-4 sm:h-4" />
            )}
            <span>{Math.abs(summary.new_orders_change)}%</span>
            <span className="hidden sm:inline">from yesterday</span>
          </div>
        </div>

        {/* Total Revenue */}
        <div className="text-center p-4 sm:p-6 bg-gray-50 rounded-lg">
          <div className="text-xs sm:text-sm text-gray-500 mb-1 sm:mb-2">Total Revenue</div>
          <div className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1 sm:mb-2 text-red-600">
            {summary.total_revenue_formatted}
          </div>
          <div className={`text-xs sm:text-sm flex items-center justify-center gap-1 
            ${summary.revenue_change >= 0 ? 'text-green-600' : 'text-red-600'}`}
          >
            {summary.revenue_change >= 0 ? (
              <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4" />
            ) : (
              <TrendingDown className="w-3 h-3 sm:w-4 sm:h-4" />
            )}
            <span>{Math.abs(summary.revenue_change)}%</span>
            <span className="hidden sm:inline">from yesterday</span>
          </div>
        </div>

        {/* Average Order Value */}
        <div className="text-center p-4 sm:p-6 bg-gray-50 rounded-lg sm:col-span-2 lg:col-span-1">
          <div className="text-xs sm:text-sm text-gray-500 mb-1 sm:mb-2">Avg. Order Value</div>
          <div className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">
            {summary.avg_order_formatted}
          </div>
          <div className={`text-xs sm:text-sm flex items-center justify-center gap-1 
            ${summary.avg_order_change >= 0 ? 'text-green-600' : 'text-red-600'}`}
          >
            {summary.avg_order_change >= 0 ? (
              <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4" />
            ) : (
              <TrendingDown className="w-3 h-3 sm:w-4 sm:h-4" />
            )}
            <span>{Math.abs(summary.avg_order_change)}%</span>
            <span className="hidden sm:inline">from yesterday</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TodaySummaryComponent
