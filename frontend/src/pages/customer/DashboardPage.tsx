import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Search, ShoppingBag, MapPin, ArrowRight, Sparkles, Clock,
  CheckCircle2, Store, Zap, ShieldCheck, Heart, User, Package
} from 'lucide-react';
import { Container } from '../../components/ui/Container';
import { Button } from '../../components/ui/Button';
import { useAuthStore } from '../../store/authStore';
import { useCartStore } from '../../store/cartStore';

export const DashboardPage: React.FC = () => {
  const { user } = useAuthStore();
  const { selectedAddress } = useCartStore();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen page-bg py-8">
      <Container size="lg" className="space-y-8">

        {/* ── 1. WELCOME BANNER ────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="relative overflow-hidden rounded-3xl p-8 sm:p-10 text-white shadow-2xl border border-indigo-100/60 dark:border-brand-rose/15"
          style={{
            background: 'linear-gradient(135deg, #1E1B4B 0%, #312E81 40%, #4C1D95 70%, #7C3AED 100%)',
          }}
        >
          {/* Background orbs */}
          <div className="orb orb-violet w-72 h-72 -top-20 -right-20 opacity-30 pointer-events-none" />
          <div className="orb orb-rose   w-64 h-64 bottom-0 left-1/3 opacity-20 pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-3 max-w-xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-white/15 border border-white/20 text-white backdrop-blur-md">
                <Sparkles className="w-3.5 h-3.5" />
                Hyperlocal AI Engine Active
              </div>

              <h1 className="font-display font-extrabold text-3xl sm:text-4xl leading-tight">
                Welcome back,{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-rose-300 to-indigo-200">
                  {user?.name || 'Customer'}
                </span>
                ! 👋
              </h1>

              <p className="text-indigo-200 text-sm leading-relaxed">
                What are you shopping for today? Search any product directly — our engine finds the best price & fastest local merchant in seconds.
              </p>

              {/* Delivery location selector badge */}
              <div className="pt-1">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white/10 border border-white/15 text-xs font-semibold text-white">
                  <MapPin className="w-4 h-4 text-brand-rose" />
                  <span>
                    Delivering to:{' '}
                    <strong className="underline underline-offset-2">
                      {selectedAddress ? `${selectedAddress.label} (${selectedAddress.city})` : 'No delivery address selected'}
                    </strong>
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Search CTA Box */}
            <div className="w-full md:w-80 p-5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 space-y-3 shrink-0">
              <p className="text-xs font-bold uppercase tracking-wider text-indigo-200">Instant Product Search</p>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') navigate('/products');
                  }}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl text-xs bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none font-medium shadow-md"
                />
                <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400 pointer-events-none" />
              </div>
              <button
                onClick={() => navigate('/products')}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-xs text-white"
                style={{ background: 'linear-gradient(135deg, #F43F5E, #8B5CF6)' }}
              >
                Browse All Products <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </motion.div>

        {/* ── 2. ACTIVE ORDERS SECTION (EMPTY STATE) ──────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-brand-darkSurface border border-indigo-100/70 dark:border-white/10 shadow-xl space-y-4 text-center"
        >
          <div className="w-14 h-14 rounded-2xl mx-auto flex items-center justify-center bg-indigo-50 dark:bg-white/5 text-slate-400">
            <Package className="w-7 h-7" />
          </div>
          <div className="space-y-1 max-w-sm mx-auto">
            <h3 className="font-display font-extrabold text-lg text-brand-primary dark:text-white">
              No Active Orders
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              When you place an order, live sub-15 minute tracking and real-time merchant dispatch updates will appear right here.
            </p>
          </div>
          <div>
            <Link to="/products">
              <Button variant="outline" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                Explore Product Catalog
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* ── 3. QUICK ACTION TILES ────────────────────────────────────── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Product Catalog', icon: Search, href: '/products', color: 'text-indigo-600 dark:text-indigo-400 bg-indigo-50/90 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-800/40', desc: 'Shop items directly' },
            { label: 'My Orders', icon: ShoppingBag, href: '/orders', color: 'text-rose-600 dark:text-rose-400 bg-rose-50/90 dark:bg-rose-950/60 border border-rose-100 dark:border-rose-800/40', desc: 'Order history & receipts' },
            { label: 'Saved Addresses', icon: MapPin, href: '/profile', color: 'text-cyan-600 dark:text-cyan-400 bg-cyan-50/90 dark:bg-cyan-950/60 border border-cyan-100 dark:border-cyan-800/40', desc: 'Home, office & pins' },
            { label: 'Account Profile', icon: User, href: '/profile', color: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50/90 dark:bg-emerald-950/60 border border-emerald-100 dark:border-emerald-800/40', desc: 'Settings & security' },
          ].map(({ label, icon: Icon, href, color, desc }) => (
            <Link key={label} to={href}>
              <motion.div
                whileHover={{ y: -4, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="p-5 rounded-2xl bg-white dark:bg-brand-darkSurface border border-indigo-100/60 dark:border-white/10 shadow-lg space-y-3 group cursor-pointer"
              >
                <div className={`p-3 rounded-xl w-fit ${color} group-hover:scale-110 transition-transform`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-brand-primary dark:text-white group-hover:text-brand-secondary dark:group-hover:text-brand-rose transition-colors">
                    {label}
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{desc}</p>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>

      </Container>
    </div>
  );
};
