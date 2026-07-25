import React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { Truck, Package, User, LogOut, Sun, Moon } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useThemeStore } from '../../store/themeStore';

export const DeliveryLayout: React.FC = () => {
  const { user, logout } = useAuthStore();
  const { isDarkMode, toggleTheme } = useThemeStore();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-brand-darkBg flex flex-col">
      {/* Delivery Header */}
      <header className="sticky top-0 z-30 bg-emerald-700 dark:bg-emerald-950 text-white px-4 py-3 shadow-md flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center font-bold">
            <Truck className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-display font-extrabold text-base leading-none">WadiGo Partner</h1>
            <p className="text-[10px] text-emerald-200 mt-0.5">Delivery Dispatch Portal</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button onClick={toggleTheme} className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors text-white">
            {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
          <button onClick={() => { logout(); navigate('/auth/login'); }} className="p-2 rounded-xl bg-white/10 hover:bg-red-500/80 transition-colors text-white" title="Sign Out">
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 pb-16">
        <Outlet />
      </main>

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white dark:bg-brand-darkSurface border-t border-slate-200 dark:border-white/10 shadow-lg flex">
        <Link to="/delivery" className="flex-1 py-3 text-center text-xs font-bold text-emerald-600 dark:text-emerald-400 flex flex-col items-center gap-1">
          <Truck className="w-4 h-4" />
          Available Tasks
        </Link>
      </nav>
    </div>
  );
};
