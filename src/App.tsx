import { Routes, Route } from 'react-router-dom'
import AdminLayout from './components/layout/AdminLayout'
import AdminDashboard from './pages/admin/Dashboard'
import OrderList from './pages/admin/order/OrderList'
import ProductList from './pages/admin/products/ProductList'
import ProductForm from './pages/admin/products/ProductForm'
import PaymentManagement from './pages/admin/payment/PaymentManagements' // Import dari folder (akan mencari index.ts)

function App() {
  return (
    <Routes>
      {/* Admin Routes */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="orders" element={<OrderList />} />
        <Route path="customers" element={<div className="p-6">Customers Page</div>} />
        
        {/* Payment Routes */}
        <Route path="payments" element={<PaymentManagement />} />
        
        {/* Product Routes - Nested */}
        <Route path="products">
          <Route index element={<ProductList />} />
          <Route path="new" element={<ProductForm />} />
          <Route path=":id/edit" element={<ProductForm />} />
        </Route>
        
        <Route path="inventory" element={<div className="p-6">Inventory Page</div>} />
        <Route path="categories" element={<div className="p-6">Categories Page</div>} />
        <Route path="staff" element={<div className="p-6">Staff Page</div>} />
        <Route path="reports" element={<div className="p-6">Reports Page</div>} />
        <Route path="settings" element={<div className="p-6">Settings Page</div>} />
      </Route>

      {/* Public Routes - Redirect ke admin untuk sementara */}
      <Route path="/" element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />
      </Route>
    </Routes>
  )
}

export default App