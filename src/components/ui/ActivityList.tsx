import { Activity } from '@/types/admin'
import { ShoppingBag, UserPlus, Package, Settings } from 'lucide-react'

interface ActivityListProps {
  activities: Activity[]
}

const getActivityIcon = (type: Activity['type']) => {
  switch (type) {
    case 'order':
      return <ShoppingBag className="w-4 h-4" />
    case 'user':
      return <UserPlus className="w-4 h-4" />
    case 'product':
      return <Package className="w-4 h-4" />
    case 'system':
      return <Settings className="w-4 h-4" />
  }
}

const getIconBg = (type: Activity['type']) => {
  switch (type) {
    case 'order':
      return 'bg-red-500'
    case 'user':
      return 'bg-blue-500'
    case 'product':
      return 'bg-green-500'
    case 'system':
      return 'bg-yellow-500'
  }
}

const ActivityList = ({ activities }: ActivityListProps) => {
  return (
    <ul className="divide-y divide-gray-200">
      {activities.map((activity) => (
        <li key={activity.id} className="py-4 first:pt-0 last:pb-0">
          <div className="flex gap-4">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white flex-shrink-0 ${getIconBg(activity.type)}`}>
              {getActivityIcon(activity.type)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-900 mb-1" dangerouslySetInnerHTML={{ __html: activity.title }} />
              <p className="text-xs text-gray-500">{activity.time}</p>
            </div>
          </div>
        </li>
      ))}
    </ul>
  )
}

export default ActivityList