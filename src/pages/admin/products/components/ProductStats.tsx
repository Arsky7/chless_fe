import { Package, CheckCircle, AlertTriangle, XCircle } from 'lucide-react'
import { ProductStats } from '../types/product.types'

interface ProductStatsProps {
  stats: ProductStats
  onStatClick: (status: string) => void
}

const ProductStatsComponent = ({ stats, onStatClick }: ProductStatsProps) => {
  const statCards = [
    {
      title: 'Total Products',
      value: stats.total,
      change: `+${stats.totalChange} this month`,
      icon: <Package className="w-6 h-6" />,
      iconBg: 'bg-gradient-to-br from-black to-gray-800',
      border: 'border-t-4 border-black',
      status: 'all',
    },
    {
      title: 'Active',
      value: stats.active,
      change: `${stats.activePercentage}% active rate`,
      icon: <CheckCircle className="w-6 h-6" />,
      iconBg: 'bg-gradient-to-br from-green-500 to-green-400',
      border: 'border-t-4 border-green-500',
      status: 'active',
    },
    {
      title: 'Low Stock',
      value: stats.lowStock,
      change: 'Needs restocking',
      icon: <AlertTriangle className="w-6 h-6" />,
      iconBg: 'bg-gradient-to-br from-yellow-500 to-yellow-400',
      border: 'border-t-4 border-yellow-500',
      status: 'low',
    },
    {
      title: 'Out of Stock',
      value: stats.outOfStock,
      change: 'Urgent attention',
      icon: <XCircle className="w-6 h-6" />,
      iconBg: 'bg-gradient-to-br from-red-500 to-red-400',
      border: 'border-t-4 border-red-500',
      status: 'out',
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
      {statCards.map((stat) => (
        <div
          key={stat.title}
          onClick={() => onStatClick(stat.status)}
          className={`bg-white rounded-xl p-6 shadow-sm border border-gray-200 
                     hover:shadow-md hover:-translate-y-1 transition-all cursor-pointer ${stat.border}`}
        >
          <div className="flex items-start justify-between mb-4">
            <span className="text-sm text-gray-500 font-medium">{stat.title}</span>
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white ${stat.iconBg}`}>
              {stat.icon}
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
          <div className="text-sm text-gray-600">{stat.change}</div>
        </div>
      ))}
    </div>
  )
}

export default ProductStatsComponent