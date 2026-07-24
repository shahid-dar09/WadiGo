import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { MainLayout } from '../components/layout/MainLayout';
import { CustomerLayout } from '../components/layout/CustomerLayout';
import { HomePage } from '../pages/HomePage';
import { LoginPage } from '../pages/auth/LoginPage';
import { RegisterPage } from '../pages/auth/RegisterPage';
import { DashboardPage } from '../pages/customer/DashboardPage';
import { ProductCatalogPage } from '../pages/customer/ProductCatalogPage';
import { OrdersPage } from '../pages/customer/OrdersPage';
import { OrderTrackingPage } from '../pages/customer/OrderTrackingPage';
import { ProfilePage } from '../pages/customer/ProfilePage';
import { ProtectedRoute } from './ProtectedRoute';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* ── Public Landing & Auth Routes (MainLayout with Landing Navbar & Footer) ── */}
      <Route path="/" element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path="auth/login" element={<LoginPage />} />
        <Route path="auth/register" element={<RegisterPage />} />
      </Route>

      {/* ── Customer Portal Protected Routes (CustomerLayout with Sidebar, Header & Bottom Nav) ── */}
      <Route element={<ProtectedRoute />}>
        <Route element={<CustomerLayout />}>
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="products" element={<ProductCatalogPage />} />
          <Route path="orders" element={<OrdersPage />} />
          <Route path="orders/:orderId" element={<OrderTrackingPage />} />
          <Route path="profile" element={<ProfilePage />} />
        </Route>
      </Route>

      {/* ── 404 Fallback ── */}
      <Route
        path="*"
        element={
          <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4 text-center p-6">
            <h2 className="text-3xl font-extrabold text-slate-800 dark:text-slate-100">
              Page Under Construction
            </h2>
            <p className="text-slate-500 text-sm">
              WadiGo Phase Milestone setup complete. Route available for future milestone.
            </p>
          </div>
        }
      />
    </Routes>
  );
};
