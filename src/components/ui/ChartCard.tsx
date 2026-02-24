import { ReactNode, useState } from 'react'

interface ChartCardProps {
  title: string
  children: ReactNode
  actions?: { label: string; value: string }[]
  onActionChange?: (value: string) => void
}

const ChartCard = ({ title, children, actions, onActionChange }: ChartCardProps) => {
  const [activeAction, setActiveAction] = useState(actions?.[0]?.value || '')

  const handleActionClick = (value: string) => {
    setActiveAction(value)
    onActionChange?.(value)
  }

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
      <div className="flex justify-between items-center mb-5">
        <h3 className="text-lg font-semibold">{title}</h3>
        {actions && (
          <div className="flex gap-2">
            {actions.map((action) => (
              <button
                key={action.value}
                onClick={() => handleActionClick(action.value)}
                className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-all ${
                  activeAction === action.value
                    ? 'bg-black text-white border-black'
                    : 'bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200'
                }`}
              >
                {action.label}
              </button>
            ))}
          </div>
        )}
      </div>
      {children}
    </div>
  )
}

export default ChartCard