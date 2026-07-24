import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { CustomerSidebar } from './CustomerSidebar';
import { CustomerHeader } from './CustomerHeader';
import { CustomerBottomNav } from './CustomerBottomNav';
import { CustomerFooter } from './CustomerFooter';
import { CartDrawer } from '../cart/CartDrawer';

export const CustomerLayout: React.FC = () => {
  const location = useLocation();
  const isDashboard = location.pathname === '/dashboard';

  return (
    <div className="min-h-screen flex bg-brand-background dark:bg-brand-darkBg text-slate-900 dark:text-slate-100 transition-colors duration-200">
      
      {/* Desktop Left Sidebar (Collapsible) */}
      <CustomerSidebar />

      {/* Main Content Column */}
      <div className="flex-1 flex flex-col min-w-0 pb-16 lg:pb-0">
        <CustomerHeader />
        
        <main className="flex-1">
          <Outlet />
        </main>

        {/* Full app info footer only on Dashboard */}
        <CustomerFooter showFull={isDashboard} />
      </div>

      {/* Mobile Bottom Navigation */}
      <CustomerBottomNav />

      {/* Global Slide-Over Cart Drawer */}
      <CartDrawer />
    </div>
  );
};
