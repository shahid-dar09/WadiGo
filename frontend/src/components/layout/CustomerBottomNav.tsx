import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Search, ShoppingBag, Package, User } from 'lucide-react';
import { useCartStore } from '../../store/cartStore';

export const CustomerBottomNav: React.FC = () => {
  const location = useLocation();
  const { openCart, getTotalItems } = useCartStore();

  const totalCartCount = getTotalItems();

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-brand-darkSurface/95 backdrop-blur-md border-t border-indigo-100/80 dark:border-white/10 px-2 py-2 flex items-center justify-around select-none">
      {/* Home */}
      <Link
        to="/dashboard"
        className={`flex flex-col items-center gap-1 px-2.5 py-1 rounded-xl transition-all ${
          location.pathname === '/dashboard'
            ? 'text-brand-secondary dark:text-brand-rose font-bold'
            : 'text-slate-500 dark:text-slate-400'
        }`}
      >
        <LayoutDashboard className="w-5 h-5" />
        <span className="text-[10px] leading-none">Home</span>
      </Link>

      {/* Search */}
      <Link
        to="/products"
        className={`flex flex-col items-center gap-1 px-2.5 py-1 rounded-xl transition-all ${
          location.pathname === '/products'
            ? 'text-brand-secondary dark:text-brand-rose font-bold'
            : 'text-slate-500 dark:text-slate-400'
        }`}
      >
        <Search className="w-5 h-5" />
        <span className="text-[10px] leading-none">Catalog</span>
      </Link>

      {/* Cart (Mobile Trigger) */}
      <button
        onClick={openCart}
        className="relative flex flex-col items-center gap-1 px-2.5 py-1 rounded-xl text-slate-500 dark:text-slate-400 hover:text-brand-secondary dark:hover:text-brand-rose transition-all"
      >
        <div className="relative">
          <ShoppingBag className="w-5 h-5" />
          {totalCartCount > 0 && (
            <span className="absolute -top-1.5 -right-2 w-4 h-4 rounded-full bg-brand-rose text-white font-extrabold text-[9px] flex items-center justify-center animate-pulse">
              {totalCartCount}
            </span>
          )}
        </div>
        <span className="text-[10px] leading-none">Cart</span>
      </button>

      {/* Orders */}
      <Link
        to="/orders"
        className={`flex flex-col items-center gap-1 px-2.5 py-1 rounded-xl transition-all ${
          location.pathname.startsWith('/orders')
            ? 'text-brand-secondary dark:text-brand-rose font-bold'
            : 'text-slate-500 dark:text-slate-400'
        }`}
      >
        <Package className="w-5 h-5" />
        <span className="text-[10px] leading-none">Orders</span>
      </Link>

      {/* Profile */}
      <Link
        to="/profile"
        className={`flex flex-col items-center gap-1 px-2.5 py-1 rounded-xl transition-all ${
          location.pathname === '/profile'
            ? 'text-brand-secondary dark:text-brand-rose font-bold'
            : 'text-slate-500 dark:text-slate-400'
        }`}
      >
        <User className="w-5 h-5" />
        <span className="text-[10px] leading-none">Profile</span>
      </Link>
    </nav>
  );
};
