import { Link, useLocation } from 'react-router-dom'
import { memo, useMemo } from 'react'
import {
  LayoutDashboard,
  Users,
  CreditCard,
  Package,
  Boxes,
  Tags,
  UserCog,
  BarChart3,
  Settings,
  HelpCircle,
  LogOut,
  ChevronLeft,
  ChevronRight,
  ShoppingCart,
  Truck,
  RotateCcw,
} from 'lucide-react'

interface AdminSidebarProps {
  isOpen: boolean
  onToggle: () => void
}

interface NavItem {
  title: string
  icon: React.ReactNode
  path: string
  badge?: number
}

interface NavGroup {
  title: string
  items: NavItem[]
}

// Ikon components untuk menghindari re-render yang tidak perlu
const Icons = {
  Dashboard: <LayoutDashboard className="w-5 h-5" />,
  Orders: <ShoppingCart className="w-5 h-5" />,
  Customers: <Users className="w-5 h-5" />,
  Payments: <CreditCard className="w-5 h-5" />,
  Shipping: <Truck className="w-5 h-5" />,
  Returns: <RotateCcw className="w-5 h-5" />,
  Products: <Package className="w-5 h-5" />,
  Inventory: <Boxes className="w-5 h-5" />,
  Categories: <Tags className="w-5 h-5" />,
  Staff: <UserCog className="w-5 h-5" />,
  Reports: <BarChart3 className="w-5 h-5" />,
  Settings: <Settings className="w-5 h-5" />,
} as const

// Data navigasi yang stabil
const NAV_GROUPS: NavGroup[] = [
  {
    title: 'Main',
    items: [
      { title: 'Dashboard', icon: Icons.Dashboard, path: '/admin' },
    ],
  },
  {
    title: 'Sales',
    items: [
      { title: 'Orders', icon: Icons.Orders, path: '/admin/orders', badge: 8 },
      { title: 'Customers', icon: Icons.Customers, path: '/admin/customers' },
      { title: 'Payments', icon: Icons.Payments, path: '/admin/payments', badge: 3 },
      { title: 'Shipping', icon: Icons.Shipping, path: '/admin/shipping' },
      { title: 'Returns', icon: Icons.Returns, path: '/admin/returns' },
    ],
  },
  {
    title: 'Products',
    items: [
      { title: 'Products', icon: Icons.Products, path: '/admin/products' },
      { title: 'Inventory', icon: Icons.Inventory, path: '/admin/inventory', badge: 5 },
      { title: 'Categories', icon: Icons.Categories, path: '/admin/categories' },
    ],
  },
  {
    title: 'Management',
    items: [
      { title: 'Staff', icon: Icons.Staff, path: '/admin/staff' },
      { title: 'Reports', icon: Icons.Reports, path: '/admin/reports' },
      { title: 'Settings', icon: Icons.Settings, path: '/admin/settings' },
    ],
  },
]

// Komponen NavItem yang di-memo
const NavItemComponent = memo(({
  item,
  isOpen,
  isActive
}: {
  item: NavItem;
  isOpen: boolean;
  isActive: boolean
}) => (
  <Link
    to={item.path}
    className={`
      flex items-center gap-3 px-3 py-3 rounded-lg
      transition-all duration-200 ease-in-out
      hover:scale-[1.02] active:scale-[0.98]
      ${isActive
        ? 'bg-gradient-to-r from-gray-100 to-gray-50 text-black border-l-4 border-red-500 shadow-sm'
        : 'text-gray-700 hover:bg-gray-50 hover:shadow-sm'
      }
      ${!isOpen && 'justify-center'}
    `}
  >
    <span className={`
      transition-transform duration-200 
      ${isActive ? 'scale-110 text-black' : 'text-gray-600'}
    `}>
      {item.icon}
    </span>

    {isOpen && (
      <>
        <span className="flex-1 text-sm font-medium">{item.title}</span>
        {item.badge && (
          <span className="
            bg-gradient-to-r from-red-500 to-red-600 
            text-white text-xs px-2 py-1 rounded-full 
            min-w-[20px] text-center font-semibold
            animate-pulse-slow
          ">
            {item.badge}
          </span>
        )}
      </>
    )}
  </Link>
))

NavItemComponent.displayName = 'NavItemComponent'

// Komponen utama dengan optimasi
const AdminSidebar = memo(({ isOpen, onToggle }: AdminSidebarProps) => {
  const location = useLocation()
  const currentPath = location.pathname

  // Menggunakan CSS classes yang lebih smooth dengan responsive breakpoints
  const sidebarClasses = useMemo(() => `
    fixed left-0 top-0 h-full 
    bg-white/95 backdrop-blur-md
    border-r border-gray-200/50
    z-50 transition-all duration-300 ease-in-out
    ${isOpen ? 'translate-x-0 w-72' : '-translate-x-full w-72 lg:translate-x-0 lg:w-20'}
    shadow-2xl lg:shadow-xl
  `, [isOpen])

  // Logo classes
  const logoClasses = `
    h-20 flex items-center px-6 
    border-b border-gray-200/50
    bg-gradient-to-r from-white to-gray-50
  `

  return (
    <aside className={sidebarClasses}>
      {/* Logo dengan efek glassmorphism */}
      <div className={logoClasses}>
        <div className="flex items-center group">
          <span className="text-2xl font-black tracking-tighter bg-gradient-to-r from-black to-red-500 bg-clip-text text-transparent">
            CH
          </span>
          <span className="text-2xl font-black text-white bg-gradient-to-r from-red-500 to-red-600 px-3 py-1 rounded-md ml-1 shadow-md group-hover:shadow-lg transition-shadow">
            LES
          </span>
          {isOpen && (
            <span className="text-xs text-gray-500 ml-2 font-medium animate-fade-in">
              ADMIN
            </span>
          )}
        </div>
      </div>

      {/* Admin Info dengan efek hover */}
      <div className="p-6 border-b border-gray-200/50">
        <div className="flex items-center gap-3 group">
          <div className="
            w-12 h-12 rounded-full 
            bg-gradient-to-br from-black to-red-500 
            flex items-center justify-center 
            text-white font-semibold text-lg
            shadow-md group-hover:shadow-lg
            transition-all duration-300
            group-hover:scale-110
            animate-gradient
          ">
            AD
          </div>
          {isOpen && (
            <div className="flex-1 min-w-0 animate-slide-in">
              <h3 className="font-semibold text-sm truncate">Admin CHLES</h3>
              <p className="text-xs text-gray-500 truncate">Super Administrator</p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation dengan smooth scroll */}
      <nav className="
        p-4 h-[calc(100vh-220px)] 
        overflow-y-auto overflow-x-hidden
        scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100
        hover:scrollbar-thumb-gray-400
      ">
        {NAV_GROUPS.map((group, idx) => (
          <div key={idx} className="mb-6">
            {isOpen && (
              <div className="
                text-xs font-semibold text-gray-500 
                uppercase tracking-wider px-3 mb-2
                animate-fade-in
              ">
                {group.title}
              </div>
            )}
            <ul className="space-y-1">
              {group.items.map((item, itemIdx) => (
                <li key={itemIdx}>
                  <NavItemComponent
                    item={item}
                    isOpen={isOpen}
                    isActive={currentPath === item.path}
                  />
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      {/* Footer dengan efek hover */}
      <div className="
        absolute bottom-0 left-0 right-0 p-4 
        border-t border-gray-200/50 
        bg-gradient-to-t from-gray-50 to-white
        backdrop-blur-sm
      ">
        <div className="flex gap-2">
          <button className="
            flex-1 py-2 px-3 
            bg-gray-100/80 backdrop-blur-sm
            rounded-lg text-sm font-medium 
            hover:bg-gray-200 hover:shadow-md
            active:scale-95
            transition-all duration-200
            flex items-center justify-center gap-2
            group
          ">
            <HelpCircle className="w-4 h-4 group-hover:rotate-12 transition-transform" />
            {isOpen && 'Help'}
          </button>
          <button className="
            flex-1 py-2 px-3 
            bg-gray-100/80 backdrop-blur-sm
            rounded-lg text-sm font-medium 
            hover:bg-gradient-to-r hover:from-red-500 hover:to-red-600
            hover:text-white hover:shadow-lg
            active:scale-95
            transition-all duration-200
            flex items-center justify-center gap-2
            group
          ">
            <LogOut className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            {isOpen && 'Logout'}
          </button>
        </div>
      </div>

      {/* Toggle Button dengan efek smooth */}
      <button
        onClick={onToggle}
        className="
          hidden lg:flex
          absolute -right-3 top-20 
          w-7 h-7 
          bg-white border border-gray-200 
          rounded-full 
          items-center justify-center 
          text-gray-500 hover:text-black
          hover:scale-110 active:scale-95
          transition-all duration-200
          shadow-md hover:shadow-lg
          z-50
          group
        "
        aria-label={isOpen ? 'Close sidebar' : 'Open sidebar'}
      >
        {isOpen ?
          <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" /> :
          <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
        }
      </button>
    </aside>
  )
})

AdminSidebar.displayName = 'AdminSidebar'

export default AdminSidebar