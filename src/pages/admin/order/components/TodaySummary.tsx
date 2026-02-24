import { TodaySummary } from '../types/order.types'
import { TrendingUp, TrendingDown } from 'lucide-react'

interface TodaySummaryProps {
  summary: TodaySummary
}

const TodaySummaryComponent = ({ summary }: TodaySummaryProps) => {
  return (
    <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-200">
      <h3 className="text-base sm:text-lg font-semibold mb-1">Today's Summary</h3>
      <p className="text-xs sm:text-sm text-gray-500 mb-4 sm:mb-6">Orders processed today</p>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* New Orders */}
        <div className="text-center p-4 sm:p-6 bg-gray-50 rounded-lg">
          <div className="text-xs sm:text-sm text-gray-500 mb-1 sm:mb-2">New Orders</div>
          <div className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">
            {summary.newOrders}
          </div>
          <div className={`text-xs sm:text-sm flex items-center justify-center gap-1 
            ${summary.newOrdersChange >= 0 ? 'text-green-600' : 'text-red-600'}`}
          >
            {summary.newOrdersChange >= 0 ? (
              <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4" />
            ) : (
              <TrendingDown className="w-3 h-3 sm:w-4 sm:h-4" />
            )}
            <span>{Math.abs(summary.newOrdersChange)}%</span>
            <span className="hidden sm:inline">from yesterday</span>
          </div>
        </div>

        {/* Total Revenue */}
        <div className="text-center p-4 sm:p-6 bg-gray-50 rounded-lg">
          <div className="text-xs sm:text-sm text-gray-500 mb-1 sm:mb-2">Total Revenue</div>
          <div className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">
            {summary.totalRevenue}
          </div>
          <div className={`text-xs sm:text-sm flex items-center justify-center gap-1 
            ${summary.revenueChange >= 0 ? 'text-green-600' : 'text-red-600'}`}
          >
            {summary.revenueChange >= 0 ? (
              <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4" />
            ) : (
              <TrendingDown className="w-3 h-3 sm:w-4 sm:h-4" />
            )}
            <span>{Math.abs(summary.revenueChange)}%</span>
            <span className="hidden sm:inline">from yesterday</span>
          </div>
        </div>

        {/* Average Order Value */}
        <div className="text-center p-4 sm:p-6 bg-gray-50 rounded-lg sm:col-span-2 lg:col-span-1">
          <div className="text-xs sm:text-sm text-gray-500 mb-1 sm:mb-2">Avg. Order Value</div>
          <div className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">
            {summary.avgOrderValue}
          </div>
          <div className={`text-xs sm:text-sm flex items-center justify-center gap-1 
            ${summary.avgOrderChange >= 0 ? 'text-green-600' : 'text-red-600'}`}
          >
            {summary.avgOrderChange >= 0 ? (
              <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4" />
            ) : (
              <TrendingDown className="w-3 h-3 sm:w-4 sm:h-4" />
            )}
            <span>{Math.abs(summary.avgOrderChange)}%</span>
            <span className="hidden sm:inline">from yesterday</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TodaySummaryComponent