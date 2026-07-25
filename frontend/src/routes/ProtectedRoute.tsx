import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

interface ProtectedRouteProps {
  allowedRoles?: string[];
  redirectPath?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  allowedRoles,
  redirectPath = '/auth/login',
}) => {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to={redirectPath} replace />;
  }

  // Check role authorization if specified
  if (allowedRoles && allowedRoles.length > 0) {
    const userRoles = user?.roles || [];
    const hasPermission = allowedRoles.some((role) => userRoles.includes(role));

    if (!hasPermission) {
      // User is authenticated but lacks permission for this portal
      // Redirect to their proper home portal based on their primary role
      if (userRoles.includes('ADMIN')) return <Navigate to="/admin" replace />;
      if (userRoles.includes('MERCHANT')) return <Navigate to="/merchant" replace />;
      if (userRoles.includes('DELIVERY_PARTNER')) return <Navigate to="/delivery" replace />;
      return <Navigate to="/dashboard" replace />;
    }
  }

  return <Outlet />;
};
