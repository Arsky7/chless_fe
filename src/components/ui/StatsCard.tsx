import { ReactNode } from 'react'

interface StatsCardProps {
  title: string
  viewAllLink?: string
  children: ReactNode
}

const StatsCard = ({ title, viewAllLink, children }: StatsCardProps) => {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">{title}</h3>
        {viewAllLink && (
          <a href={viewAllLink} className="text-sm text-red-500 hover:underline font-medium">
            View All →
          </a>
        )}
      </div>
      {children}
    </div>
  )
}

export default StatsCard