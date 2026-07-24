import React from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon, ShoppingBag, MapPin, Zap } from 'lucide-react';
import { useThemeStore } from '../../store/themeStore';
import { useAuthStore } from '../../store/authStore';
import { useCartStore } from '../../store/cartStore';

export const CustomerHeader: React.FC = () => {
  const { isDarkMode, toggleDarkMode } = useThemeStore();
  const { user } = useAuthStore();
  const { openCart, getTotalItems, selectedAddress } = useCartStore();

  const totalCartCount = getTotalItems();

  return (
    <header className="sticky top-0 z-20 h-16 bg-white/90 dark:bg-brand-darkSurface/90 backdrop-blur-md border-b border-indigo-100/70 dark:border-white/10 px-4 sm:px-8 flex items-center justify-between gap-4">
      
      {/* ── LEFT: Active Location & Mobile Brand ──────────────────────── */}
      <div className="flex items-center gap-3">
        {/* Mobile Logo (< lg) */}
        <Link to="/dashboard" className="lg:hidden flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center text-white shadow-md"
            style={{ background: 'linear-gradient(135deg, #7C3AED, #F43F5E)' }}
          >
            <Zap className="w-4 h-4 fill-current" />
          </div>
        </Link>

        {/* Delivery Location Pill */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-indigo-50/80 dark:bg-white/5 border border-indigo-100 dark:border-white/10 text-xs font-semibold text-slate-700 dark:text-slate-200">
          <MapPin className="w-4 h-4 text-brand-secondary dark:text-brand-rose shrink-0" />
          <span className="truncate max-w-[180px] sm:max-w-xs">
            {selectedAddress ? `${selectedAddress.label}: ${selectedAddress.city}` : 'Select Delivery Location'}
          </span>
        </div>
      </div>

      {/* ── RIGHT CONTROLS: Cart, Theme Toggle, Customer Name ───────────── */}
      <div className="flex items-center gap-2.5">
        
        {/* Shopping Cart Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={openCart}
          className="relative p-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-200 hover:text-brand-secondary dark:hover:text-brand-rose transition-colors"
          title="View Cart"
        >
          <ShoppingBag className="w-4 h-4" />
          {totalCartCount > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-brand-rose text-white font-extrabold text-[10px] flex items-center justify-center shadow-md animate-pulse">
              {totalCartCount}
            </span>
          )}
        </motion.button>

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

        {/* Customer Name Tag */}
        <div className="flex items-center gap-2 pl-1">
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs text-white shadow-sm"
            style={{ background: 'linear-gradient(135deg, #7C3AED, #F43F5E)' }}
          >
            {user?.name ? user.name[0].toUpperCase() : 'U'}
          </div>
          <span className="hidden sm:inline font-bold text-xs text-brand-primary dark:text-white">
            {user?.name || 'Customer'}
          </span>
        </div>

      </div>

    </header>
  );
};
