import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Search, Package, User } from 'lucide-react';

const MOBILE_LINKS = [
  { label: 'Home', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Search', href: '/products', icon: Search },
  { label: 'Orders', href: '/orders', icon: Package },
  { label: 'Profile', href: '/profile', icon: User },
];

export const CustomerBottomNav: React.FC = () => {
  const location = useLocation();

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-brand-darkSurface/95 backdrop-blur-md border-t border-indigo-100/80 dark:border-white/10 px-3 py-2 flex items-center justify-around select-none">
      {MOBILE_LINKS.map(({ label, href, icon: Icon }) => {
        const isActive = location.pathname === href;
        return (
          <Link
            key={label}
            to={href}
            className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-all ${
              isActive
                ? 'text-brand-secondary dark:text-brand-rose font-bold'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
            }`}
          >
            <Icon className={`w-5 h-5 ${isActive ? 'scale-110' : ''}`} />
            <span className="text-[10px] leading-none">{label}</span>
          </Link>
        );
      })}
    </nav>
  );
};
