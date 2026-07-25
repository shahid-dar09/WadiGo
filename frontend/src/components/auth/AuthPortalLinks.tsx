import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { User, Store, Truck, ShieldCheck } from 'lucide-react';

const PORTAL_ITEMS = [
  { id: 'customer', label: 'Customer Shop', href: '/auth/login', icon: User, color: 'hover:text-purple-600 dark:hover:text-purple-400' },
  { id: 'merchant', label: 'Merchant Portal', href: '/auth/merchant/login', icon: Store, color: 'hover:text-amber-600 dark:hover:text-amber-400' },
  { id: 'delivery', label: 'Delivery Partner', href: '/auth/delivery/login', icon: Truck, color: 'hover:text-emerald-600 dark:hover:text-emerald-400' },
  { id: 'admin', label: 'Admin Portal', href: '/auth/admin/login', icon: ShieldCheck, color: 'hover:text-indigo-600 dark:hover:text-indigo-400' },
];

export const AuthPortalLinks: React.FC = () => {
  const location = useLocation();

  return (
    <div className="pt-4 border-t border-slate-100 dark:border-white/5 space-y-2 text-center">
      <p className="text-[11px] font-bold tracking-wider uppercase text-slate-400">
        Switch to Other WadiGo Portals
      </p>
      <div className="flex flex-wrap items-center justify-center gap-2">
        {PORTAL_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname.includes(item.id) || (item.id === 'customer' && (location.pathname === '/auth/login' || location.pathname === '/auth/register'));

          return (
            <Link
              key={item.label}
              to={item.href}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-slate-100 dark:bg-white/10 text-slate-900 dark:text-white font-bold ring-1 ring-slate-300 dark:ring-white/20'
                  : `text-slate-500 dark:text-slate-400 ${item.color} hover:bg-slate-50 dark:hover:bg-white/5`
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};
