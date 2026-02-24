import { SystemStatus as StatusType } from '@/types/admin'
import { CheckCircle, AlertTriangle, XCircle } from 'lucide-react'

interface SystemStatusProps {
  statuses: StatusType[]
}

const getStatusIcon = (status: StatusType['status']) => {
  switch (status) {
    case 'good':
      return <CheckCircle className="w-4 h-4 text-green-500" />
    case 'warning':
      return <AlertTriangle className="w-4 h-4 text-yellow-500" />
    case 'error':
      return <XCircle className="w-4 h-4 text-red-500" />
  }
}

const SystemStatus = ({ statuses }: SystemStatusProps) => {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">System Status</h3>
        <span className="text-sm text-green-600 flex items-center gap-1.5">
          <CheckCircle className="w-4 h-4" />
          All systems operational
        </span>
      </div>
      <div className="grid grid-cols-3 gap-4">
        {statuses.map((item, index) => (
          <div
            key={index}
            className={`text-center p-4 bg-gray-50 rounded-lg border-l-4 ${
              item.status === 'good' ? 'border-green-500' :
              item.status === 'warning' ? 'border-yellow-500' :
              'border-red-500'
            }`}
          >
            <div className="text-xs text-gray-500 mb-2 flex items-center justify-center gap-1">
              {getStatusIcon(item.status)}
              {item.name}
            </div>
            <div className="text-xl font-bold text-gray-900">{item.value}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default SystemStatus