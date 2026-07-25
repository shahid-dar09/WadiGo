import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { Zap } from 'lucide-react';

interface ProtectedRouteProps {
  allowedRoles?: string[];
  redirectPath?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  allowedRoles,
  redirectPath = '/auth/login',
}) => {
  const { isAuthenticated, user, isLoading } = useAuthStore();

  // While restoring session from JWT token on refresh, display session restoring screen
  if (isLoading || (isAuthenticated && !user)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-brand-darkBg select-none">
        <div className="flex flex-col items-center gap-3">
          <div
            className="w-11 h-11 rounded-2xl flex items-center justify-center text-white shadow-xl animate-pulse"
            style={{ background: 'linear-gradient(135deg, #7C3AED, #F43F5E)' }}
          >
            <Zap className="w-6 h-6 fill-current" />
          </div>
          <p className="text-xs font-bold tracking-wide text-slate-500 dark:text-slate-400 animate-pulse">
            Restoring WadiGo session...
          </p>
        </div>
      </div>
    );
  }

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
