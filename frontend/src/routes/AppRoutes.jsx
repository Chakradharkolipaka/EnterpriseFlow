import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ProtectedRoute from '../components/common/ProtectedRoute';
import Login from '../pages/Login';
import DashboardLayout from '../components/layout/DashboardLayout';
import Dashboard from '../pages/Dashboard';
import CustomerList from '../pages/customers/CustomerList';
import CustomerDetail from '../pages/customers/CustomerDetail';
import CustomerForm from '../pages/customers/CustomerForm';
import ProductList from '../pages/products/ProductList';
import ProductDetail from '../pages/products/ProductDetail';
import ProductForm from '../pages/products/ProductForm';
import ChallanList from '../pages/challans/ChallanList';
import ChallanDetail from '../pages/challans/ChallanDetail';
import ChallanBuilder from '../pages/challans/ChallanBuilder';

function AppRoutes() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route 
        path="/login" 
        element={user ? <Navigate to="/dashboard" /> : <Login />} 
      />
      
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" />} />
        <Route path="dashboard" element={<Dashboard />} />
        
        {/* Customer Routes */}
        <Route 
          path="customers" 
          element={
            <ProtectedRoute allowedRoles={['admin', 'sales', 'accounts']}>
              <CustomerList />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="customers/new" 
          element={
            <ProtectedRoute allowedRoles={['admin', 'sales']}>
              <CustomerForm />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="customers/:id" 
          element={
            <ProtectedRoute allowedRoles={['admin', 'sales', 'accounts']}>
              <CustomerDetail />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="customers/:id/edit" 
          element={
            <ProtectedRoute allowedRoles={['admin', 'sales']}>
              <CustomerForm />
            </ProtectedRoute>
          } 
        />
        
        {/* Product Routes */}
        <Route path="products" element={<ProductList />} />
        <Route 
          path="products/new" 
          element={
            <ProtectedRoute allowedRoles={['admin', 'warehouse']}>
              <ProductForm />
            </ProtectedRoute>
          } 
        />
        <Route path="products/:id" element={<ProductDetail />} />
        <Route 
          path="products/:id/edit" 
          element={
            <ProtectedRoute allowedRoles={['admin', 'warehouse']}>
              <ProductForm />
            </ProtectedRoute>
          } 
        />
        
        {/* Challan Routes */}
        <Route 
          path="challans" 
          element={
            <ProtectedRoute allowedRoles={['admin', 'sales', 'accounts']}>
              <ChallanList />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="challans/new" 
          element={
            <ProtectedRoute allowedRoles={['admin', 'sales']}>
              <ChallanBuilder />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="challans/:id" 
          element={
            <ProtectedRoute allowedRoles={['admin', 'sales', 'accounts']}>
              <ChallanDetail />
            </ProtectedRoute>
          } 
        />
      </Route>
      
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default AppRoutes;
