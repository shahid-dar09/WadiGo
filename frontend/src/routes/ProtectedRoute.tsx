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
    const hasPermission = allowedRoles.some((role) => userRoles.includes(role)) || userRoles.includes('ADMIN');

    if (!hasPermission) {
      // User is authenticated but lacks permission for this portal
      return <Navigate to="/dashboard" replace />;
    }
  }

  return <Outlet />;
};
