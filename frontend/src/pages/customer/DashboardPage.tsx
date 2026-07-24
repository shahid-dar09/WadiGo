import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Search, ShoppingBag, MapPin, ArrowRight, Sparkles, Clock,
  CheckCircle2, Store, Zap, ShieldCheck, Heart, User, TrendingUp, Package
} from 'lucide-react';
import { Container } from '../../components/ui/Container';
import { Button } from '../../components/ui/Button';
import { useAuthStore } from '../../store/authStore';
import { useCartStore } from '../../store/cartStore';

export const DashboardPage: React.FC = () => {
  const { user } = useAuthStore();
  const { addItem, selectedAddress } = useCartStore();
  const navigate = useNavigate();

  /* Sample top recommendations */
  const RECS = [
    {
      id: 'rec-1',
      name: 'Farm Fresh Organic Eggs (Pack of 6)',
      category: 'Dairy & Poultry',
      price: 85,
      unit: '6 Pcs',
      image: 'https://images.unsplash.com/photo-1516467508483-a7212febe31a?w=400&auto=format&fit=crop&q=80',
      storeName: 'Pure Farm Organics',
      storeDistance: '0.4 km',
      deliveryTime: '6-10 mins',
    },
    {
      id: 'rec-2',
      name: 'Fresh Alphonso Mangoes (1kg)',
      category: 'Fresh Produce',
      price: 340,
      unit: '1 kg (4-5 Pcs)',
      image: 'https://images.unsplash.com/photo-1553279768-865429fa0078?w=400&auto=format&fit=crop&q=80',
      storeName: 'Bengaluru Fruit Co',
      storeDistance: '0.8 km',
      deliveryTime: '8-12 mins',
    },
    {
      id: 'rec-3',
      name: 'Artisanal Sourdough Bread',
      category: 'Bakery',
      price: 120,
      unit: '400g Loaf',
      image: 'https://images.unsplash.com/photo-1589367920969-ab8e050bbb04?w=400&auto=format&fit=crop&q=80',
      storeName: 'The Daily Loaf Bakery',
      storeDistance: '1.2 km',
      deliveryTime: '12-15 mins',
    },
  ];

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
                  <span>Delivering to: <strong className="underline underline-offset-2">{selectedAddress?.label || 'Home'}</strong> ({selectedAddress?.city || 'Bengaluru'})</span>
                </div>
              </div>
            </div>

            {/* Quick Search CTA Box */}
            <div className="w-full md:w-80 p-5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 space-y-3 shrink-0">
              <p className="text-xs font-bold uppercase tracking-wider text-indigo-200">Instant Product Search</p>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search milk, avocados, bread..."
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

        {/* ── 2. ACTIVE ORDER TRACKER WIDGET ──────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-6 rounded-3xl bg-white dark:bg-brand-darkSurface border border-indigo-100/70 dark:border-white/10 shadow-xl space-y-4"
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-500 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center">
                <Package className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-display font-extrabold text-base text-brand-primary dark:text-white">
                    Active Order #WG-9402
                  </h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                    Out for Delivery
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Fulfilling store: <strong className="text-slate-800 dark:text-slate-200">Fresh Mart (0.6 km away)</strong>
                </p>
              </div>
            </div>

            <Link to="/orders/WG-9402">
              <Button variant="outline" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                Live Map Tracking
              </Button>
            </Link>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2 pt-1">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-slate-600 dark:text-slate-300">Driver En Route</span>
              <span className="text-emerald-500 font-bold">Estimated Arrival: 8 Mins</span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-white/10 overflow-hidden">
              <motion.div
                initial={{ width: '0%' }}
                animate={{ width: '75%' }}
                transition={{ duration: 1.2, ease: 'easeOut' }}
                className="h-full rounded-full"
                style={{ background: 'linear-gradient(90deg, #10B981, #34D399)' }}
              />
            </div>
          </div>
        </motion.div>

        {/* ── 3. QUICK ACTION TILES ────────────────────────────────────── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Product Catalog', icon: Search, href: '/products', color: 'text-brand-violet bg-indigo-50 dark:bg-brand-violet/10', desc: 'Shop items directly' },
            { label: 'My Orders', icon: ShoppingBag, href: '/orders', color: 'text-brand-rose bg-rose-50 dark:bg-brand-rose/10', desc: 'Order history & receipts' },
            { label: 'Saved Addresses', icon: MapPin, href: '/profile', color: 'text-brand-teal bg-teal-50 dark:bg-brand-teal/10', desc: 'Home, office & pins' },
            { label: 'Account Profile', icon: User, href: '/profile', color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/20', desc: 'Settings & security' },
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

        {/* ── 4. RECOMMENDED PRODUCTS ─────────────────────────────────── */}
        <div className="space-y-4 pt-2">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display font-extrabold text-2xl text-brand-primary dark:text-white">
                Nearby Instant Delivery
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Top rated local inventory available for sub-15 min dispatch
              </p>
            </div>
            <Link to="/products" className="text-xs font-bold text-brand-secondary dark:text-brand-rose hover:underline flex items-center gap-1">
              View All <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {RECS.map((product) => (
              <motion.div
                key={product.id}
                whileHover={{ y: -4 }}
                className="rounded-2xl bg-white dark:bg-brand-darkSurface border border-indigo-100/70 dark:border-white/10 shadow-lg overflow-hidden flex flex-col justify-between"
              >
                <div>
                  {/* Image */}
                  <div className="relative h-44 overflow-hidden bg-slate-100 dark:bg-slate-800">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-bold bg-white/90 dark:bg-black/80 backdrop-blur-md text-brand-primary dark:text-white shadow-sm">
                      {product.category}
                    </span>
                    <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500 text-white shadow-sm flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {product.deliveryTime}
                    </span>
                  </div>

                  {/* Body */}
                  <div className="p-4 space-y-2">
                    <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                      <span className="flex items-center gap-1 text-brand-secondary dark:text-brand-violet font-semibold">
                        <Store className="w-3 h-3" /> {product.storeName}
                      </span>
                      <span>{product.storeDistance}</span>
                    </div>

                    <h3 className="font-bold text-sm text-brand-primary dark:text-white line-clamp-1">
                      {product.name}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{product.unit}</p>
                  </div>
                </div>

                {/* Footer Add */}
                <div className="p-4 pt-0 flex items-center justify-between border-t border-slate-100 dark:border-white/5 mt-2">
                  <div>
                    <span className="text-xs text-slate-400 font-medium">Price</span>
                    <p className="font-extrabold text-base text-brand-primary dark:text-white">
                      ₹{product.price}
                    </p>
                  </div>
                  <button
                    onClick={() => addItem(product as any)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-white shadow-md transition-all active:scale-95"
                    style={{ background: 'linear-gradient(135deg, #4C1D95, #7C3AED)' }}
                  >
                    + Add to Cart
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

      </Container>
    </div>
  );
};
