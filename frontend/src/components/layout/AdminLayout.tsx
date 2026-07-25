import React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ShieldCheck, LayoutDashboard, Users, Store, ShoppingBag, Package,
  LogOut, Sun, Moon, ChevronLeft, ChevronRight, Settings
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useThemeStore } from '../../store/themeStore';

const ADMIN_LINKS = [
  { label: 'Overview', href: '/admin', icon: LayoutDashboard },
  { label: 'User Governance', href: '/admin/users', icon: Users },
  { label: 'Merchant Governance', href: '/admin/merchants', icon: Store },
  { label: 'Catalog Management', href: '/admin/products', icon: Package },
  { label: 'All Orders', href: '/admin/orders', icon: ShoppingBag },
];

const AdminSidebar: React.FC = () => {
  const { user, logout } = useAuthStore();
  const { isDarkMode } = useThemeStore();
  const location = useLocation();
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = React.useState(false);

  return (
    <aside className={`hidden lg:flex flex-col h-screen sticky top-0 bg-white dark:bg-brand-darkSurface border-r border-slate-200 dark:border-white/10 shadow-sm z-30 select-none transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-64'}`}>
      {/* Logo */}
      <div className={`p-4 border-b border-slate-100 dark:border-white/5 flex items-center ${isCollapsed ? 'justify-center' : 'justify-start gap-3'}`}>
        <Link to="/admin" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-lg shrink-0"
            style={{ background: 'linear-gradient(135deg, #1E1B4B, #4C1D95)' }}>
            <ShieldCheck className="w-5 h-5" />
          </div>
          {!isCollapsed && (
            <div className="flex flex-col leading-none">
              <span className="font-display font-extrabold text-xl tracking-tight text-slate-900 dark:text-white">Wadi<span className="text-brand-secondary dark:text-brand-rose">Go</span></span>
              <span className="text-[9px] font-semibold tracking-widest uppercase text-slate-400 mt-0.5">Admin Portal</span>
            </div>
          )}
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-1.5 overflow-y-auto">
        {!isCollapsed && <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">Platform Controls</p>}
        {ADMIN_LINKS.map(({ label, href, icon: Icon }) => {
          const isActive = location.pathname === href || (href !== '/admin' && location.pathname.startsWith(href));
          return (
            <Link key={label} to={href} title={isCollapsed ? label : undefined}
              className={`flex items-center gap-3.5 rounded-2xl text-xs font-bold transition-all ${isCollapsed ? 'justify-center p-3' : 'px-3.5 py-3'} ${
                isActive ? 'bg-indigo-950 dark:bg-indigo-900 text-white shadow-md' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5'
              }`}>
              <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-indigo-400' : 'text-slate-400'}`} />
              {!isCollapsed && <span className="whitespace-nowrap">{label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="p-3 border-t border-slate-100 dark:border-white/5 bg-slate-50 dark:bg-slate-900/60 space-y-2.5">
        <div className={`flex items-center gap-3 ${isCollapsed ? 'justify-center' : 'px-1'}`}>
          <div className="w-9 h-9 rounded-xl flex items-center justify-center font-extrabold text-xs text-white shadow-sm shrink-0"
            style={{ background: 'linear-gradient(135deg, #1E1B4B, #4C1D95)' }}>
            {user?.name ? user.name[0].toUpperCase() : 'A'}
          </div>
          {!isCollapsed && (
            <div className="min-w-0 flex-1">
              <p className="font-bold text-xs text-slate-900 dark:text-white truncate">{user?.name || 'Super Admin'}</p>
              <p className="text-[10px] text-slate-400 truncate">Platform Administrator</p>
            </div>
          )}
        </div>
        <button onClick={() => { logout(); navigate('/auth/admin/login'); }}
          className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-red-200 dark:border-red-900/50 text-xs font-bold text-red-600 dark:text-red-400 bg-red-50/50 dark:bg-red-950/30 hover:bg-red-100 dark:hover:bg-red-950/60 transition-all ${isCollapsed ? 'px-0' : 'px-3'}`}>
          <LogOut className="w-4 h-4 text-red-500 shrink-0" />
          {!isCollapsed && <span>Sign Out</span>}
        </button>
        <button onClick={() => setIsCollapsed(!isCollapsed)}
          className={`w-full flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold text-slate-500 dark:text-slate-400 bg-slate-200/70 dark:bg-white/5 hover:bg-slate-300/70 transition-all ${isCollapsed ? 'px-0' : 'px-3'}`}>
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <><ChevronLeft className="w-4 h-4" /><span>Collapse</span></>}
        </button>
      </div>
    </aside>
  );
};

export const AdminLayout: React.FC = () => {
  const { isDarkMode, toggleTheme } = useThemeStore();
  const { user } = useAuthStore();
  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-brand-darkBg">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-20 bg-white/80 dark:bg-brand-darkSurface/80 backdrop-blur-sm border-b border-slate-200 dark:border-white/10 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-indigo-600 dark:text-indigo-400 lg:hidden" />
            <span className="font-bold text-sm text-slate-900 dark:text-white">Admin Governance</span>
            <span className="hidden sm:inline px-2 py-0.5 rounded-full text-[9px] font-bold bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">Platform Superuser</span>
          </div>
          <button onClick={toggleTheme} className="p-2 rounded-xl bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-200 hover:bg-slate-200 transition-colors">
            {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </header>
        <main className="flex-1 pb-16 lg:pb-0 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
