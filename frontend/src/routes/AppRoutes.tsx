import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from '../components/layout/MainLayout';
import { CustomerLayout } from '../components/layout/CustomerLayout';
import { MerchantLayout } from '../components/layout/MerchantLayout';
import { DeliveryLayout } from '../components/layout/DeliveryLayout';
import { AdminLayout } from '../components/layout/AdminLayout';

import { HomePage } from '../pages/HomePage';
import { LoginPage } from '../pages/auth/LoginPage';
import { RegisterPage } from '../pages/auth/RegisterPage';
import { MerchantAuthPage } from '../pages/auth/MerchantAuthPage';
import { DeliveryAuthPage } from '../pages/auth/DeliveryAuthPage';
import { AdminAuthPage } from '../pages/auth/AdminAuthPage';

import { DashboardPage } from '../pages/customer/DashboardPage';
import { ProductCatalogPage } from '../pages/customer/ProductCatalogPage';
import { ProductDetailPage } from '../pages/customer/ProductDetailPage';
import { CheckoutPage } from '../pages/customer/CheckoutPage';
import { OrdersPage } from '../pages/customer/OrdersPage';
import { OrderTrackingPage } from '../pages/customer/OrderTrackingPage';
import { ProfilePage } from '../pages/customer/ProfilePage';

import { MerchantDashboardPage } from '../pages/merchant/MerchantDashboardPage';
import { MerchantProfilePage } from '../pages/merchant/MerchantProfilePage';
import { MerchantInventoryPage } from '../pages/merchant/MerchantInventoryPage';
import { MerchantOrdersPage } from '../pages/merchant/MerchantOrdersPage';

import { DeliveryDashboardPage } from '../pages/delivery/DeliveryDashboardPage';

import { AdminDashboardPage } from '../pages/admin/AdminDashboardPage';
import { AdminUsersPage } from '../pages/admin/AdminUsersPage';
import { AdminMerchantsPage } from '../pages/admin/AdminMerchantsPage';
import { AdminProductsPage } from '../pages/admin/AdminProductsPage';
import { AdminOrdersPage } from '../pages/admin/AdminOrdersPage';

import { ProtectedRoute } from './ProtectedRoute';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public Landing & Auth Routes */}
      <Route path="/" element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path="auth/login" element={<LoginPage />} />
        <Route path="auth/register" element={<RegisterPage />} />
        <Route path="auth/merchant/login" element={<MerchantAuthPage />} />
        <Route path="auth/merchant/register" element={<MerchantAuthPage />} />
        <Route path="auth/delivery/login" element={<DeliveryAuthPage />} />
        <Route path="auth/delivery/register" element={<DeliveryAuthPage />} />
        <Route path="auth/admin/login" element={<AdminAuthPage />} />
      </Route>

      {/* Customer Portal Protected Routes */}
      <Route element={<ProtectedRoute allowedRoles={['CUSTOMER']} redirectPath="/auth/login" />}>
        <Route element={<CustomerLayout />}>
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="products" element={<ProductCatalogPage />} />
          <Route path="products/:slug" element={<ProductDetailPage />} />
          <Route path="checkout" element={<CheckoutPage />} />
          <Route path="orders" element={<OrdersPage />} />
          <Route path="orders/:orderId" element={<OrderTrackingPage />} />
          <Route path="profile" element={<ProfilePage />} />
        </Route>
      </Route>

      {/* Merchant Portal Protected Routes */}
      <Route element={<ProtectedRoute allowedRoles={['MERCHANT']} redirectPath="/auth/merchant/login" />}>
        <Route path="merchant" element={<MerchantLayout />}>
          <Route index element={<MerchantDashboardPage />} />
          <Route path="profile" element={<MerchantProfilePage />} />
          <Route path="inventory" element={<MerchantInventoryPage />} />
          <Route path="orders" element={<MerchantOrdersPage />} />
        </Route>
      </Route>

      {/* Delivery Partner Portal Protected Routes */}
      <Route element={<ProtectedRoute allowedRoles={['DELIVERY_PARTNER']} redirectPath="/auth/delivery/login" />}>
        <Route path="delivery" element={<DeliveryLayout />}>
          <Route index element={<DeliveryDashboardPage />} />
        </Route>
      </Route>

      {/* Admin Portal Protected Routes */}
      <Route element={<ProtectedRoute allowedRoles={['ADMIN']} redirectPath="/auth/admin/login" />}>
        <Route path="admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboardPage />} />
          <Route path="users" element={<AdminUsersPage />} />
          <Route path="merchants" element={<AdminMerchantsPage />} />
          <Route path="products" element={<AdminProductsPage />} />
          <Route path="orders" element={<AdminOrdersPage />} />
        </Route>
      </Route>

      {/* 404 Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
