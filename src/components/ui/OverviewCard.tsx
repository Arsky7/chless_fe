import { ReactNode } from 'react'
import { TrendingUp, TrendingDown } from 'lucide-react'

interface OverviewCardProps {
  title: string
  value: string
  change: number
  trend: 'up' | 'down'
  icon: ReactNode
  iconBg: string
}

const OverviewCard = ({ title, value, change, trend, icon, iconBg }: OverviewCardProps) => {
  const changeText = change > 0 ? `+${change.toFixed(1)}%` : `${change.toFixed(1)}%`

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md hover:-translate-y-1 transition-all duration-300">
      <div className="flex justify-between items-start mb-4">
        <span className="text-sm text-gray-500 font-medium">{title}</span>
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white ${iconBg}`}>
          {icon}
        </div>
      </div>
      <div className="text-3xl font-bold text-gray-900 mb-2">{value}</div>
      <div className={`text-sm flex items-center gap-1.5 ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
        {trend === 'up' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
        {changeText} from yesterday
      </div>
    </div>
  )
}

export default OverviewCard