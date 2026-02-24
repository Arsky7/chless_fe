import { OrderStats as OrderStatsType } from '../types/order.types'

interface OrderStatsComponentProps {
  stats: OrderStatsType
  onStatClick: (status: string) => void
}

const OrderStatsComponent = ({ stats, onStatClick }: OrderStatsComponentProps) => {
  const statCards = [
    {
      label: 'Pending',
      value: stats.pending,
      today: stats.pendingToday,
      border: 'border-l-4 sm:border-t-4 border-yellow-500',
      textColor: 'text-yellow-600',
    },
    {
      label: 'Processing',
      value: stats.processing,
      today: stats.processingToday,
      border: 'border-l-4 sm:border-t-4 border-blue-500',
      textColor: 'text-blue-600',
    },
    {
      label: 'Shipped',
      value: stats.shipped,
      today: stats.shippedToday,
      border: 'border-l-4 sm:border-t-4 border-purple-500',
      textColor: 'text-purple-600',
    },
    {
      label: 'Delivered',
      value: stats.delivered,
      today: stats.deliveredToday,
      border: 'border-l-4 sm:border-t-4 border-green-500',
      textColor: 'text-green-600',
    },
    {
      label: 'Cancelled',
      value: stats.cancelled,
      today: stats.cancelledToday,
      border: 'border-l-4 sm:border-t-4 border-red-500',
      textColor: 'text-red-600',
    },
  ]

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
      {statCards.map((stat) => (
        <div
          key={stat.label}
          onClick={() => onStatClick(stat.label.toLowerCase())}
          className={`bg-white rounded-xl p-4 shadow-sm border border-gray-200 
                     hover:shadow-md transition-all cursor-pointer ${stat.border}`}
        >
          <div className="text-xs sm:text-sm text-gray-500 mb-1 sm:mb-2 truncate">
            {stat.label}
          </div>
          <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">
            {stat.value}
          </div>
          <div className={`text-xs ${stat.textColor} flex items-center gap-1`}>
            <span>+{stat.today} today</span>
          </div>
        </div>
      ))}
    </div>
  )
}

export default OrderStatsComponent