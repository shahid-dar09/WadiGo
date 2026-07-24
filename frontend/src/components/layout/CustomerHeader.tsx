import React from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon, Zap } from 'lucide-react';
import { useThemeStore } from '../../store/themeStore';
import { useAuthStore } from '../../store/authStore';

export const CustomerHeader: React.FC = () => {
  const { isDarkMode, toggleDarkMode } = useThemeStore();
  const { user } = useAuthStore();

  return (
    <header className="sticky top-0 z-20 h-16 bg-white/90 dark:bg-brand-darkSurface/90 backdrop-blur-md border-b border-indigo-100/70 dark:border-white/10 px-4 sm:px-8 flex items-center justify-between gap-4">
      
      {/* ── LEFT: Mobile Brand Logo ────────────────────────────────────── */}
      <div className="flex items-center gap-3">
        {/* Mobile Logo (< lg) */}
        <Link to="/dashboard" className="lg:hidden flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center text-white shadow-md"
            style={{ background: 'linear-gradient(135deg, #7C3AED, #F43F5E)' }}
          >
            <Zap className="w-4 h-4 fill-current" />
          </div>
          <span className="font-display font-extrabold text-lg text-brand-primary dark:text-white">
            Wadi<span style={{ color: '#F43F5E' }}>Go</span>
          </span>
        </Link>
      </div>

      {/* ── RIGHT CONTROLS: Theme Toggle, Customer Avatar & Name ──────── */}
      <div className="flex items-center gap-2.5">
        
        {/* Theme Toggle Button */}
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          onClick={toggleDarkMode}
          className="p-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-400 hover:text-brand-secondary dark:hover:text-brand-rose transition-colors"
          title="Toggle Dark/Light Mode"
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={isDarkMode ? 'sun' : 'moon'}
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0,   opacity: 1 }}
              exit={{   rotate:  90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </motion.div>
          </AnimatePresence>
        </motion.button>

        {/* Customer Name & Avatar Tag */}
        <div className="flex items-center gap-2 pl-1">
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs text-white shadow-sm"
            style={{ background: 'linear-gradient(135deg, #7C3AED, #F43F5E)' }}
          >
            {user?.name ? user.name[0].toUpperCase() : 'U'}
          </div>
          <span className="font-bold text-xs text-brand-primary dark:text-white truncate max-w-[140px]">
            {user?.name || 'Customer'}
          </span>
        </div>

      </div>

    </header>
  );
};
