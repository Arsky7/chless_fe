import { useState, useEffect } from 'react'
import { Bell, Calendar, Menu } from 'lucide-react'
import { format } from 'date-fns'
import { id } from 'date-fns/locale'

interface AdminHeaderProps {
  onMenuClick: () => void
}

const AdminHeader = ({ onMenuClick }: AdminHeaderProps) => {
  const [currentDate, setCurrentDate] = useState('')
  const [showNotifications, setShowNotifications] = useState(false)

  useEffect(() => {
    setCurrentDate(format(new Date(), 'EEEE, dd MMMM yyyy', { locale: id }))
  }, [])

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            className="lg:hidden w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold">Dashboard Overview</h1>
            <p className="text-sm text-gray-500 mt-1">Welcome back, Admin. Here's what's happening with your store today.</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors relative"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                3
              </span>
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden z-50">
                <div className="p-4 border-b border-gray-200">
                  <h4 className="font-semibold">Notifications</h4>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="p-4 hover:bg-gray-50 border-b border-gray-100 last:border-0">
                      <p className="text-sm font-medium">New order #ORD-2023-0012{i}</p>
                      <p className="text-xs text-gray-500 mt-1">Just now</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="hidden md:flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-lg">
            <Calendar className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium">{currentDate}</span>
          </div>
        </div>
      </div>
    </header>
  )
}

export default AdminHeader