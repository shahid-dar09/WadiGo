import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sun, Moon, Zap, User, LogOut, Sparkles, Menu, X,
  ShoppingBag, Store, Truck, ShieldCheck, ChevronDown
} from 'lucide-react';
import { Container } from '../ui/Container';
import { Button } from '../ui/Button';
import { useThemeStore } from '../../store/themeStore';
import { useAuthStore } from '../../store/authStore';
import { useCartStore } from '../../store/cartStore';

const LANDING_LINKS = [
  { label: 'Home', href: '/#home' },
  { label: 'How It Works', href: '/#how-it-works' },
  { label: 'Features', href: '/#features' },
];

const CUSTOMER_LINKS = [
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Products', href: '/products' },
  { label: 'My Orders', href: '/orders' },
  { label: 'Profile', href: '/profile' },
];

const PORTALS = [
  { name: 'Customer Shop', href: '/auth/login', icon: User, desc: 'Shop & order locally', color: 'text-purple-500' },
  { name: 'Merchant Portal', href: '/auth/merchant/login', icon: Store, desc: 'Store & inventory control', color: 'text-amber-500' },
  { name: 'Delivery Partner', href: '/auth/delivery/login', icon: Truck, desc: 'Dispatch & order delivery', color: 'text-emerald-500' },
  { name: 'Admin Portal', href: '/auth/admin/login', icon: ShieldCheck, desc: 'System governance', color: 'text-indigo-400' },
];

export const Navbar: React.FC = () => {
  const { isDarkMode, toggleDarkMode } = useThemeStore();
  const { user, isAuthenticated, logout } = useAuthStore();
  const { openCart, getTotalItems } = useCartStore();
  const location = useLocation();

  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [portalMenuOpen, setPortalMenuOpen] = useState(false);

  const isLanding = location.pathname === '/';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setPortalMenuOpen(false);
  }, [location]);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (!href.startsWith('/#')) return;
    e.preventDefault();
    const id = href.replace('/#', '');

    if (location.pathname !== '/') {
      window.location.href = href;
      return;
    }

    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setMobileOpen(false);
    }
  };

  const totalCartCount = getTotalItems();

  return (
    <header className={`sticky top-0 z-50 glass-nav transition-all duration-300 ${scrolled ? 'shadow-md' : ''}`}>
      <Container size="lg">
        <div className="flex items-center justify-between h-[68px] gap-4">

          {/* Logo */}
          <Link to={isAuthenticated ? "/dashboard" : "/"} className="flex items-center gap-2.5 group shrink-0">
            <motion.div
              whileHover={{ scale: 1.08, rotate: 5 }}
              transition={{ type: 'spring', stiffness: 400, damping: 15 }}
              className="relative w-9 h-9 rounded-xl flex items-center justify-center text-white shadow-lg overflow-hidden"
              style={{
                background: isDarkMode
                  ? 'linear-gradient(135deg, #F43F5E, #8B5CF6)'
                  : 'linear-gradient(135deg, #4C1D95, #7C3AED)',
              }}
            >
              <Zap className="w-5 h-5 fill-current relative z-10" />
            </motion.div>

            <div className="flex flex-col leading-none">
              <span className="font-display font-extrabold text-xl tracking-tight text-brand-primary dark:text-white">
                Wadi
                <span style={isDarkMode ? {
                  background: 'linear-gradient(135deg, #F43F5E, #8B5CF6)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                } : { color: '#7C3AED' }}>
                  Go
                </span>
              </span>
              <span className="text-[9px] font-semibold tracking-widest uppercase text-slate-400 mt-0.5">
                AI Hyperlocal
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            {isAuthenticated ? (
              CUSTOMER_LINKS.map(({ label, href }) => {
                const active = location.pathname === href;
                return (
                  <Link
                    key={label}
                    to={href}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-200 ${
                      active
                        ? 'bg-brand-primary dark:bg-white text-white dark:text-slate-900 shadow-sm'
                        : 'text-slate-600 dark:text-slate-300 hover:text-brand-secondary dark:hover:text-brand-rose hover:bg-indigo-50 dark:hover:bg-white/5'
                    }`}
                  >
                    {label}
                  </Link>
                );
              })
            ) : isLanding ? (
              <>
                {LANDING_LINKS.map(({ label, href }) => (
                  <a
                    key={label}
                    href={href}
                    onClick={(e) => handleNavClick(e, href)}
                    className="px-3.5 py-2 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-brand-secondary dark:hover:text-brand-rose hover:bg-indigo-50 dark:hover:bg-white/5 transition-all duration-200"
                  >
                    {label}
                  </a>
                ))}

                {/* Portals Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setPortalMenuOpen(!portalMenuOpen)}
                    className="px-3.5 py-2 rounded-xl text-sm font-bold text-slate-700 dark:text-slate-200 hover:text-brand-secondary flex items-center gap-1 transition-all"
                  >
                    Portals
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform ${portalMenuOpen ? 'rotate-180' : ''}`} />
                  </button>

                  <AnimatePresence>
                    {portalMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute left-0 mt-2 w-64 p-2 rounded-2xl bg-white dark:bg-brand-darkSurface border border-slate-200 dark:border-white/10 shadow-2xl space-y-1 z-50"
                      >
                        {PORTALS.map((portal) => {
                          const Icon = portal.icon;
                          return (
                            <Link
                              key={portal.name}
                              to={portal.href}
                              onClick={() => setPortalMenuOpen(false)}
                              className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-white/5 transition-colors group"
                            >
                              <div className={`p-2 rounded-lg bg-slate-100 dark:bg-slate-800 ${portal.color}`}>
                                <Icon className="w-4 h-4" />
                              </div>
                              <div>
                                <p className="font-bold text-xs text-slate-900 dark:text-white">{portal.name}</p>
                                <p className="text-[10px] text-slate-400">{portal.desc}</p>
                              </div>
                            </Link>
                          );
                        })}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            ) : null}
          </nav>

          {/* Right Controls */}
          <div className="flex items-center gap-2">
            {/* Shopping Cart */}
            {isAuthenticated && !isLanding && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={openCart}
                className="relative p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-white/5 transition-all"
                title="View Cart"
              >
                <ShoppingBag className="w-5 h-5" />
                {totalCartCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-brand-rose text-white font-extrabold text-[10px] flex items-center justify-center shadow-md animate-pulse">
                    {totalCartCount}
                  </span>
                )}
              </motion.button>
            )}

            {/* Theme toggle */}
            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              onClick={toggleDarkMode}
              className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-indigo-50 dark:hover:bg-white/5 transition-all"
              title="Toggle theme"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={isDarkMode ? 'sun' : 'moon'}
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {isDarkMode ? <Sun className="w-[18px] h-[18px]" /> : <Moon className="w-[18px] h-[18px]" />}
                </motion.div>
              </AnimatePresence>
            </motion.button>

            {/* Auth buttons (desktop) */}
            <div className="hidden sm:block">
              <AnimatePresence mode="wait">
                {isAuthenticated && user ? (
                  <div className="flex items-center gap-2">
                    <Link to="/profile">
                      <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-white/5 border border-indigo-100 dark:border-white/10 text-xs font-semibold text-brand-primary dark:text-slate-200">
                        <div className="w-6 h-6 rounded-full flex items-center justify-center font-bold text-[10px] text-white" style={{ background: 'linear-gradient(135deg, #7C3AED, #F43F5E)' }}>
                          {user.name ? user.name[0].toUpperCase() : 'U'}
                        </div>
                        <span className="hidden lg:inline">{user.name}</span>
                      </div>
                    </Link>
                    <Button variant="outline" size="sm" onClick={logout} leftIcon={<LogOut className="w-3.5 h-3.5" />}>
                      Sign Out
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Link to="/auth/login">
                      <Button variant="ghost" size="sm" leftIcon={<User className="w-3.5 h-3.5" />}>
                        Sign In
                      </Button>
                    </Link>
                    <Link to="/auth/merchant/login">
                      <button className="px-3 py-1.5 rounded-xl text-xs font-bold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 hover:bg-amber-100 transition-colors">
                        Merchant
                      </button>
                    </Link>
                    <Link to="/auth/register">
                      <button className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-white transition-all shadow-md" style={{ background: 'linear-gradient(135deg, #4C1D95, #7C3AED)' }}>
                        <Sparkles className="w-3.5 h-3.5" /> Get Started
                      </button>
                    </Link>
                  </div>
                )}
              </AnimatePresence>
            </div>

            {/* Mobile hamburger */}
            <button
              className="md:hidden p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-indigo-50 dark:hover:bg-white/5 transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </Container>

      {/* Mobile Nav Dropdown */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden border-t border-indigo-100 dark:border-white/5 glass-nav md:hidden"
          >
            <Container size="lg">
              <div className="py-4 space-y-2">
                <p className="px-4 text-[10px] font-bold uppercase tracking-wider text-slate-400">All WadiGo Portals</p>
                {PORTALS.map((p) => {
                  const Icon = p.icon;
                  return (
                    <Link key={p.name} to={p.href} className="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-white/5">
                      <Icon className={`w-4 h-4 ${p.color}`} />
                      <div>
                        <p className="font-bold text-xs text-slate-900 dark:text-white">{p.name}</p>
                        <p className="text-[10px] text-slate-400">{p.desc}</p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </Container>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
