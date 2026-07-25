import React from 'react';
import { Outlet } from 'react-router-dom';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard, Store, Package, ShoppingBag, User,
  LogOut, Zap, ChevronLeft, ChevronRight, Settings
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useThemeStore } from '../../store/themeStore';
import { Sun, Moon } from 'lucide-react';

const MERCHANT_LINKS = [
  { label: 'Dashboard', href: '/merchant', icon: LayoutDashboard },
  { label: 'My Profile & Store', href: '/merchant/profile', icon: Store },
  { label: 'Inventory', href: '/merchant/inventory', icon: Package },
  { label: 'Orders', href: '/merchant/orders', icon: ShoppingBag },
];

const MerchantSidebar: React.FC = () => {
  const { user, logout } = useAuthStore();
  const { isDarkMode } = useThemeStore();
  const location = useLocation();
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = React.useState(false);

  const handleLogout = () => { logout(); navigate('/auth/login'); };

  return (
    <aside className={`hidden lg:flex flex-col h-screen sticky top-0 bg-white dark:bg-brand-darkSurface border-r border-amber-100/70 dark:border-white/10 shadow-sm z-30 select-none transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-64'}`}>
      {/* Logo */}
      <div className={`p-4 border-b border-amber-50 dark:border-white/5 flex items-center ${isCollapsed ? 'justify-center' : 'justify-start gap-3'}`}>
        <Link to="/merchant" className="flex items-center gap-3 group">
          <motion.div whileHover={{ scale: 1.08, rotate: 5 }} transition={{ type: 'spring', stiffness: 400, damping: 15 }}
            className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-lg shrink-0"
            style={{ background: isDarkMode ? 'linear-gradient(135deg, #F59E0B, #D97706)' : 'linear-gradient(135deg, #92400E, #B45309)' }}>
            <Store className="w-5 h-5" />
          </motion.div>
          {!isCollapsed && (
            <div className="flex flex-col leading-none whitespace-nowrap">
              <span className="font-display font-extrabold text-xl tracking-tight text-amber-900 dark:text-white">Wadi<span className="text-amber-600 dark:text-amber-400">Go</span></span>
              <span className="text-[9px] font-semibold tracking-widest uppercase text-slate-400 mt-0.5">Merchant Portal</span>
            </div>
          )}
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-1.5 overflow-y-auto">
        {!isCollapsed && <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">Merchant Menu</p>}
        {MERCHANT_LINKS.map(({ label, href, icon: Icon }) => {
          const isActive = location.pathname === href || (href !== '/merchant' && location.pathname.startsWith(href));
          return (
            <Link key={label} to={href} title={isCollapsed ? label : undefined}
              className={`flex items-center gap-3.5 rounded-2xl text-xs font-bold transition-all duration-200 ${isCollapsed ? 'justify-center p-3' : 'px-3.5 py-3'} ${
                isActive ? 'bg-amber-600 dark:bg-amber-700 text-white shadow-md' : 'text-slate-600 dark:text-slate-300 hover:bg-amber-50 dark:hover:bg-white/5 hover:text-amber-700 dark:hover:text-amber-400'
              }`}>
              <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
              {!isCollapsed && <span className="whitespace-nowrap">{label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="p-3 border-t border-amber-50 dark:border-white/5 bg-slate-50 dark:bg-slate-900/60 space-y-2.5">
        <div className={`flex items-center gap-3 ${isCollapsed ? 'justify-center' : 'px-1 py-1'}`}>
          <div className="w-9 h-9 rounded-xl flex items-center justify-center font-extrabold text-xs text-white shadow-sm shrink-0"
            style={{ background: 'linear-gradient(135deg, #B45309, #F59E0B)' }} title={user?.name}>
            {user?.name ? user.name[0].toUpperCase() : 'M'}
          </div>
          {!isCollapsed && (
            <div className="min-w-0 flex-1">
              <p className="font-bold text-xs text-slate-900 dark:text-white truncate">{user?.name || 'Merchant'}</p>
              <p className="text-[10px] text-slate-500 truncate">{user?.email}</p>
            </div>
          )}
        </div>
        <button onClick={handleLogout} title="Sign Out"
          className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-red-200 dark:border-red-900/50 text-xs font-bold text-red-600 dark:text-red-400 bg-red-50/50 dark:bg-red-950/30 hover:bg-red-100 dark:hover:bg-red-950/60 transition-all ${isCollapsed ? 'px-0' : 'px-3'}`}>
          <LogOut className="w-4 h-4 text-red-500 shrink-0" />
          {!isCollapsed && <span>Sign Out</span>}
        </button>
        <button onClick={() => setIsCollapsed(!isCollapsed)} title={isCollapsed ? 'Expand' : 'Collapse'}
          className={`w-full flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold text-slate-500 dark:text-slate-400 bg-slate-200/70 dark:bg-white/5 hover:bg-slate-300/70 dark:hover:bg-white/10 transition-all ${isCollapsed ? 'px-0' : 'px-3'}`}>
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <><ChevronLeft className="w-4 h-4" /><span>Collapse</span></>}
        </button>
      </div>
    </aside>
  );
};

const MerchantBottomNav: React.FC = () => {
  const location = useLocation();
  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white dark:bg-brand-darkSurface border-t border-amber-100 dark:border-white/10 shadow-xl">
      <div className="flex">
        {MERCHANT_LINKS.map(({ label, href, icon: Icon }) => {
          const isActive = location.pathname === href || (href !== '/merchant' && location.pathname.startsWith(href));
          return (
            <Link key={label} to={href} className={`flex-1 flex flex-col items-center gap-1 py-3 text-[10px] font-bold transition-colors ${isActive ? 'text-amber-600 dark:text-amber-400' : 'text-slate-400 hover:text-amber-600'}`}>
              <Icon className="w-5 h-5" />
              {label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export const MerchantLayout: React.FC = () => {
  const { isDarkMode, toggleTheme } = useThemeStore();
  const { user } = useAuthStore();
  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-brand-darkBg">
      <MerchantSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <header className="sticky top-0 z-20 bg-white/80 dark:bg-brand-darkSurface/80 backdrop-blur-sm border-b border-amber-100/70 dark:border-white/10 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Store className="w-5 h-5 text-amber-600 dark:text-amber-400 lg:hidden" />
            <span className="font-bold text-sm text-amber-900 dark:text-white">{user?.name || 'Merchant'}</span>
            <span className="hidden sm:inline px-2 py-0.5 rounded-full text-[9px] font-bold bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300">Merchant Portal</span>
          </div>
          <button onClick={toggleTheme} className="p-2 rounded-xl bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-white/20 transition-colors">
            {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </header>
        <main className="flex-1 pb-20 lg:pb-0 overflow-y-auto">
          <Outlet />
        </main>
      </div>
      <MerchantBottomNav />
    </div>
  );
};
