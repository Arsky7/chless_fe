import { Suspense, lazy } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import AdminLayout from './components/layout/AdminLayout'

// Lazy Load Admin Pages
const AdminDashboard = lazy(() => import('./pages/admin/Dashboard'))
const OrderList = lazy(() => import('./pages/admin/order/OrderList'))
const ProductList = lazy(() => import('./pages/admin/products/ProductList'))
const ProductForm = lazy(() => import('./pages/admin/products/ProductForm'))
const PaymentManagement = lazy(() => import('./pages/admin/payment/PaymentManagements'))
const InventoryPage = lazy(() => import('./pages/admin/inventory/InventoryPage'))
const CategoriesPage = lazy(() => import('./pages/admin/categories/CategoriesPage'))
const CustomersPage = lazy(() => import('./pages/admin/customers/CustomersPage'))
const ReturnsManagementPage = lazy(() => import('./pages/admin/returns/ReturnsManagementPage'))
const ProfilePage = lazy(() => import('./pages/public/ProfilePage'))

// Public Pages
const LandingPage = lazy(() => import('./pages/public/LandingPage'))
const ShopPage = lazy(() => import('./pages/public/ShopPage'))
const NewArrivalsPage = lazy(() => import('./pages/public/NewArrivalsPage'))

const StaffList = lazy(() => import('./pages/admin/staff/StaffList'))

// Loading Component
const PageLoading = () => (
  <div className="flex items-center justify-center min-h-[400px]">
    <div className="flex flex-col items-center gap-2">
      <div className="w-10 h-10 border-4 border-red-500/20 border-t-red-500 rounded-full animate-spin"></div>
      <p className="text-sm text-gray-500 font-medium">Loading Page...</p>
    </div>
  </div>
)

function App() {
  return (
    <Suspense fallback={<PageLoading />}>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/shop" element={<ShopPage />} />
        <Route path="/new-arrivals" element={<NewArrivalsPage />} />
        <Route path="/profile" element={<ProfilePage />} />

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="orders" element={<OrderList />} />
          <Route path="customers" element={<CustomersPage />} />
          <Route path="returns" element={<ReturnsManagementPage />} />

          {/* Payment Routes */}
          <Route path="payments" element={<PaymentManagement />} />

          {/* Product Routes - Flat */}
          <Route path="products" element={<ProductList />} />
          <Route path="products/new" element={<ProductForm />} />
          <Route path="products/:id/edit" element={<ProductForm />} />

          <Route path="inventory" element={<InventoryPage />} />
          <Route path="categories" element={<CategoriesPage />} />
          <Route path="staff" element={<StaffList />} />
          <Route path="reports" element={<div className="p-6 text-gray-500">Reports Page Coming Soon</div>} />
          <Route path="settings" element={<div className="p-6 text-gray-500">Settings Page Coming Soon</div>} />
        </Route>

        {/* Fallback 404 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  )
}

export default App