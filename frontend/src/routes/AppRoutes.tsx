import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { MainLayout } from '../components/layout/MainLayout';
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
      {/* Main Application Layout with Navbar, Footer & Slide-Over Cart */}
      <Route path="/" element={<MainLayout />}>
        {/* Public Routes */}
        <Route index element={<HomePage />} />
        <Route path="auth/login" element={<LoginPage />} />
        <Route path="auth/register" element={<RegisterPage />} />

        {/* Customer Portal Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="products" element={<ProductCatalogPage />} />
          <Route path="orders" element={<OrdersPage />} />
          <Route path="orders/:orderId" element={<OrderTrackingPage />} />
          <Route path="profile" element={<ProfilePage />} />
        </Route>

        {/* 404 Fallback */}
        <Route
          path="*"
          element={
            <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
              <h2 className="text-3xl font-extrabold text-slate-800 dark:text-slate-100">
                Page Under Construction
              </h2>
              <p className="text-slate-500 text-sm">
                WadiGo Phase Milestone setup complete. Route available for future milestone.
              </p>
            </div>
          }
        />
      </Route>
    </Routes>
  );
};
