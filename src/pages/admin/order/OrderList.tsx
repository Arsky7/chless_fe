import { useState } from 'react'
import OrderStatsComponent from './components/OrderStats'
import OrderFilters from './components/OrderFilters'
import TodaySummaryComponent from './components/TodaySummary'
import OrdersTable from './components/OrdersTable'
import { Order, OrderStats as OrderStatsType, TodaySummary, FilterParams } from './types/order.types'

const mockOrders: Order[] = [
  {
    id: "ORD-2023-00125",
    customer: { name: "John Doe", email: "john@email.com", initial: "JD" },
    date: "2023-11-20 14:30",
    items: [
      { name: "Oversized T-Shirt Black", variant: "Size: M, Color: Black", quantity: 2, icon: "fa-tshirt" },
      { name: "Cargo Pants Beige", variant: "Size: 32, Color: Beige", quantity: 1, icon: "fa-tshirt" }
    ],
    total: "Rp 447,000",
    status: "pending",
    payment: "pending"
  },
  {
    id: "ORD-2023-00124",
    customer: { name: "Sarah Wilson", email: "sarah@email.com", initial: "SW" },
    date: "2023-11-20 13:15",
    items: [
      { name: "Hoodie Grey", variant: "Size: L, Color: Grey", quantity: 1, icon: "fa-tshirt" },
      { name: "Denim Jacket Blue", variant: "Size: M, Color: Blue", quantity: 1, icon: "fa-tshirt" }
    ],
    total: "Rp 900,000",
    status: "processing",
    payment: "paid"
  },
  {
    id: "ORD-2023-00123",
    customer: { name: "Michael Chen", email: "michael@email.com", initial: "MC" },
    date: "2023-11-19 11:45",
    items: [
      { name: "Sneakers White", variant: "Size: 42, Color: White", quantity: 1, icon: "fa-shoe-prints" },
      { name: "Socks Pack (3pcs)", variant: "Size: OS, Color: Mixed", quantity: 2, icon: "fa-socks" }
    ],
    total: "Rp 770,000",
    status: "shipped",
    payment: "paid"
  },
  {
    id: "ORD-2023-00122",
    customer: { name: "Lisa Garcia", email: "lisa@email.com", initial: "LG" },
    date: "2023-11-18 09:20",
    items: [
      { name: "Backpack Urban", variant: "Size: OS, Color: Black", quantity: 1, icon: "fa-bag-shopping" },
      { name: "Cap Black", variant: "Size: OS, Color: Black", quantity: 1, icon: "fa-hat-cowboy" }
    ],
    total: "Rp 409,000",
    status: "delivered",
    payment: "paid"
  },
  {
    id: "ORD-2023-00121",
    customer: { name: "David Brown", email: "david@email.com", initial: "DB" },
    date: "2023-11-17 16:10",
    items: [
      { name: "Jeans Blue", variant: "Size: 34, Color: Blue", quantity: 1, icon: "fa-tshirt" },
      { name: "Belt Leather", variant: "Size: M, Color: Brown", quantity: 1, icon: "fa-tshirt" }
    ],
    total: "Rp 455,000",
    status: "cancelled",
    payment: "failed"
  }
]

const mockStats: OrderStatsType = {
  pending: 24,
  processing: 15,
  shipped: 42,
  delivered: 156,
  cancelled: 8,
  pendingToday: 3,
  processingToday: 2,
  shippedToday: 8,
  deliveredToday: 12,
  cancelledToday: 1,
}

const mockTodaySummary: TodaySummary = {
  newOrders: 15,
  newOrdersChange: 25,
  totalRevenue: "Rp 8.5M",
  revenueChange: 18,
  avgOrderValue: "Rp 567K",
  avgOrderChange: -5,
}

const OrderList = () => {
  const [orders, setOrders] = useState<Order[]>(mockOrders)
  const [filteredOrders, setFilteredOrders] = useState<Order[]>(mockOrders)

  const handleStatClick = (status: string) => {
    const filtered = orders.filter(order => order.status === status)
    setFilteredOrders(filtered)
  }

  const handleApplyFilters = (filters: FilterParams) => {
    let filtered = [...orders]

    if (filters.status !== 'all') {
      filtered = filtered.filter(order => order.status === filters.status)
    }

    if (filters.customer) {
      filtered = filtered.filter(order => 
        order.customer.name.toLowerCase().includes(filters.customer.toLowerCase()) ||
        order.customer.email.toLowerCase().includes(filters.customer.toLowerCase())
      )
    }

    if (filters.orderId) {
      filtered = filtered.filter(order => 
        order.id.toLowerCase().includes(filters.orderId.toLowerCase())
      )
    }

    setFilteredOrders(filtered)
  }

  const handleResetFilters = () => {
    setFilteredOrders(orders)
  }

  const handleExport = () => {
    alert('Exporting orders to CSV...')
  }

  const handleViewOrder = (orderId: string) => {
    const order = orders.find(o => o.id === orderId)
    if (order) {
      alert(`View Order: ${orderId}\n\n${JSON.stringify(order, null, 2)}`)
    }
  }

  const handleEditOrder = (orderId: string) => {
    alert(`Edit Order: ${orderId}`)
  }

  const handlePrintOrder = (orderId: string) => {
    alert(`Print Invoice: ${orderId}`)
  }

  const handleDeleteOrder = (orderId: string) => {
    if (confirm(`Delete order ${orderId}?`)) {
      setOrders(orders.filter(o => o.id !== orderId))
      setFilteredOrders(filteredOrders.filter(o => o.id !== orderId))
    }
  }

  const handleCreateOrder = () => {
    alert('Create new order')
  }

  const handlePrintLabels = () => {
    alert('Print shipping labels')
  }

  return (
    <div className="space-y-6 w-full max-w-full px-4 sm:px-6 lg:px-8">
      {/* Stats Section - Responsive Grid */}
      <div className="w-full">
        <OrderStatsComponent stats={mockStats} onStatClick={handleStatClick} />
      </div>
      
      {/* Filters Section */}
      <div className="w-full">
        <OrderFilters 
          onApplyFilters={handleApplyFilters}
          onResetFilters={handleResetFilters}
          onExport={handleExport}
        />
      </div>

      {/* Summary Section */}
      <div className="w-full">
        <TodaySummaryComponent summary={mockTodaySummary} />
      </div>

      {/* Table Section - No Horizontal Scroll */}
      <div className="w-full">
        <OrdersTable
          orders={filteredOrders}
          onViewOrder={handleViewOrder}
          onEditOrder={handleEditOrder}
          onPrintOrder={handlePrintOrder}
          onDeleteOrder={handleDeleteOrder}
          onCreateOrder={handleCreateOrder}
          onPrintLabels={handlePrintLabels}
          totalOrders={orders.length}
        />
      </div>
    </div>
  )
}

export default OrderList