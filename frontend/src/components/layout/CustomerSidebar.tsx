import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard, Search, Package, User, LogOut,
  Zap, MapPin, Sparkles, ShoppingBag
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useThemeStore } from '../../store/themeStore';

const SIDEBAR_LINKS = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Product Catalog', href: '/products', icon: Search },
  { label: 'My Orders', href: '/orders', icon: Package },
  { label: 'Profile & Addresses', href: '/profile', icon: User },
];

export const CustomerSidebar: React.FC = () => {
  const { user, logout } = useAuthStore();
  const { isDarkMode } = useThemeStore();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/auth/login');
  };

  return (
    <aside className="hidden lg:flex flex-col w-64 h-screen sticky top-0 bg-white dark:bg-brand-darkSurface border-r border-indigo-100/70 dark:border-white/10 shadow-sm z-30 select-none">
      
      {/* ── 1. LOGO HEADER ────────────────────────────────────────────── */}
      <div className="p-6 border-b border-indigo-50 dark:border-white/5">
        <Link to="/dashboard" className="flex items-center gap-2.5 group">
          <motion.div
            whileHover={{ scale: 1.08, rotate: 5 }}
            transition={{ type: 'spring', stiffness: 400, damping: 15 }}
            className="w-9 h-9 rounded-xl flex items-center justify-center text-white shadow-lg"
            style={{
              background: isDarkMode
                ? 'linear-gradient(135deg, #F43F5E, #8B5CF6)'
                : 'linear-gradient(135deg, #4C1D95, #7C3AED)',
            }}
          >
            <Zap className="w-5 h-5 fill-current" />
          </motion.div>

          <div className="flex flex-col leading-none">
            <span className="font-display font-extrabold text-xl tracking-tight text-brand-primary dark:text-white">
              Wadi
              <span
                style={isDarkMode ? {
                  background: 'linear-gradient(135deg, #F43F5E, #8B5CF6)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                } : { color: '#7C3AED' }}
              >
                Go
              </span>
            </span>
            <span className="text-[9px] font-semibold tracking-widest uppercase text-slate-400 mt-0.5">
              Customer Portal
            </span>
          </div>
        </Link>
      </div>

      {/* ── 2. NAVIGATION LINKS ───────────────────────────────────────── */}
      <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
        <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
          Menu
        </p>

        {SIDEBAR_LINKS.map(({ label, href, icon: Icon }) => {
          const isActive = location.pathname === href || (href !== '/dashboard' && location.pathname.startsWith(href));
          return (
            <Link
              key={label}
              to={href}
              className={`flex items-center gap-3 px-3.5 py-3 rounded-2xl text-xs font-bold transition-all duration-200 ${
                isActive
                  ? 'bg-brand-primary dark:bg-gradient-to-r dark:from-brand-rose dark:to-brand-violet text-white shadow-md shadow-indigo-900/20'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-white/5 hover:text-brand-secondary dark:hover:text-brand-rose'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>

      {/* ── 3. USER PROFILE & SIGN OUT FOOTER ────────────────────────── */}
      <div className="p-4 border-t border-indigo-50 dark:border-white/5 bg-slate-50 dark:bg-slate-900/60 space-y-3">
        {/* User Card */}
        <div className="flex items-center gap-3 px-2 py-1">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center font-extrabold text-xs text-white shadow-sm shrink-0"
            style={{ background: 'linear-gradient(135deg, #7C3AED, #F43F5E)' }}
          >
            {user?.name ? user.name[0].toUpperCase() : 'U'}
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-bold text-xs text-slate-900 dark:text-white truncate">
              {user?.name || 'Customer Account'}
            </p>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
              {user?.email || 'customer@wadigo.com'}
            </p>
          </div>
        </div>

        {/* Sign Out Button */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-red-200 dark:border-red-900/40 text-xs font-bold text-red-600 dark:text-red-400 bg-red-50/50 dark:bg-red-950/30 hover:bg-red-100 dark:hover:bg-red-950/60 transition-all"
        >
          <LogOut className="w-4 h-4 text-red-500" />
          <span>Sign Out</span>
        </button>
      </div>

    </aside>
  );
};
