import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Filter, Store, Clock, Zap, Sparkles, CheckCircle2,
  SlidersHorizontal, ChevronDown, ShoppingBag, ArrowUpDown, X
} from 'lucide-react';
import { Container } from '../../components/ui/Container';
import { useCartStore } from '../../store/cartStore';

interface StoreOption {
  storeName: string;
  distance: string;
  price: number;
  deliveryTime: string;
  stock: string;
  isBestMatch?: boolean;
}

interface CatalogProduct {
  id: string;
  name: string;
  category: string;
  unit: string;
  bestPrice: number;
  originalPrice: number;
  image: string;
  fastestDelivery: string;
  stores: StoreOption[];
}

const PRODUCTS_DATA: CatalogProduct[] = [
  {
    id: 'cat-1',
    name: 'Organic Whole Milk 1L',
    category: 'Dairy',
    unit: '1L Pouch',
    bestPrice: 65,
    originalPrice: 72,
    image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400&auto=format&fit=crop&q=80',
    fastestDelivery: '8-12 mins',
    stores: [
      { storeName: 'Fresh Mart (MG Road)', distance: '0.6 km', price: 65, deliveryTime: '8 mins', stock: 'In Stock (18 units)', isBestMatch: true },
      { storeName: 'Green Grocery Hub', distance: '1.4 km', price: 68, deliveryTime: '14 mins', stock: 'In Stock (5 units)' },
      { storeName: 'SuperDaily Express', distance: '2.2 km', price: 63, deliveryTime: '22 mins', stock: 'Low Stock (2 units)' },
    ],
  },
  {
    id: 'cat-2',
    name: 'Hass Avocados (Pack of 2)',
    category: 'Produce',
    unit: '2 Pcs (Approx 350g)',
    bestPrice: 180,
    originalPrice: 220,
    image: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=400&auto=format&fit=crop&q=80',
    fastestDelivery: '10-15 mins',
    stores: [
      { storeName: 'Green Basket Organics', distance: '1.1 km', price: 180, deliveryTime: '10 mins', stock: 'Fresh Stock', isBestMatch: true },
      { storeName: 'Natures Gourmet Store', distance: '1.9 km', price: 195, deliveryTime: '18 mins', stock: 'In Stock' },
    ],
  },
  {
    id: 'cat-3',
    name: 'Artisanal Sourdough Bread',
    category: 'Bakery',
    unit: '400g Fresh Loaf',
    bestPrice: 120,
    originalPrice: 145,
    image: 'https://images.unsplash.com/photo-1589367920969-ab8e050bbb04?w=400&auto=format&fit=crop&q=80',
    fastestDelivery: '12-15 mins',
    stores: [
      { storeName: 'The Daily Loaf Bakery', distance: '1.2 km', price: 120, deliveryTime: '12 mins', stock: 'Baked Today', isBestMatch: true },
      { storeName: 'Bakers Corner Indiranagar', distance: '2.5 km', price: 130, deliveryTime: '20 mins', stock: 'In Stock' },
    ],
  },
  {
    id: 'cat-4',
    name: 'Farm Fresh Eggs (Pack of 6)',
    category: 'Dairy',
    unit: '6 Pcs',
    bestPrice: 85,
    originalPrice: 95,
    image: 'https://images.unsplash.com/photo-1516467508483-a7212febe31a?w=400&auto=format&fit=crop&q=80',
    fastestDelivery: '6-10 mins',
    stores: [
      { storeName: 'Pure Farm Organics', distance: '0.4 km', price: 85, deliveryTime: '6 mins', stock: 'In Stock (40 units)', isBestMatch: true },
    ],
  },
  {
    id: 'cat-5',
    name: 'Wireless Noise Canceling Earbuds',
    category: 'Electronics',
    unit: '1 Pair (Black)',
    bestPrice: 2499,
    originalPrice: 3499,
    image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400&auto=format&fit=crop&q=80',
    fastestDelivery: '15-20 mins',
    stores: [
      { storeName: 'Croma Local Outlet', distance: '1.5 km', price: 2499, deliveryTime: '15 mins', stock: 'In Stock', isBestMatch: true },
      { storeName: 'Reliance Digital Express', distance: '2.8 km', price: 2599, deliveryTime: '22 mins', stock: 'In Stock' },
    ],
  },
  {
    id: 'cat-6',
    name: 'Cold Pressed Orange Juice 500ml',
    category: 'Beverages',
    unit: '500ml Bottle',
    bestPrice: 110,
    originalPrice: 130,
    image: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?w=400&auto=format&fit=crop&q=80',
    fastestDelivery: '8-12 mins',
    stores: [
      { storeName: 'Juice Bar & Organics', distance: '0.7 km', price: 110, deliveryTime: '8 mins', stock: 'Cold Stock', isBestMatch: true },
    ],
  },
];

const CATEGORIES = ['All', 'Dairy', 'Produce', 'Bakery', 'Electronics', 'Beverages'];

export const ProductCatalogPage: React.FC = () => {
  const [searchQuery, setSearchQuery]       = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedProductStores, setSelectedProductStores] = useState<CatalogProduct | null>(null);

  const { addItem } = useCartStore();

  /* Filter products */
  const filteredProducts = PRODUCTS_DATA.filter((p) => {
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesSearch   = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            p.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen page-bg py-8">
      <Container size="lg" className="space-y-7">

        {/* ── HEADER & SEARCH ────────────────────────────────────────── */}
        <div className="space-y-4">
          <div>
            <span className="section-badge text-xs mb-1">
              <Zap className="w-3.5 h-3.5 text-brand-rose" />
              Product-First Hyperlocal Aggregation
            </span>
            <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-brand-primary dark:text-white">
              Search & Compare Local Stock
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Search any item. WadiGo compares nearby local merchants and picks the best price & fastest delivery.
            </p>
          </div>

          {/* Search bar */}
          <div className="relative max-w-2xl">
            <Search className="w-5 h-5 absolute left-4 top-3.5 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search milk, avocados, bread, earbuds..."
              className="w-full pl-12 pr-10 py-3.5 rounded-2xl border border-indigo-100 dark:border-white/10 bg-white dark:bg-brand-darkSurface text-sm text-brand-primary dark:text-white placeholder:text-slate-400 shadow-md focus:outline-none focus:border-brand-secondary dark:focus:border-brand-rose transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Category Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {CATEGORIES.map((cat) => {
              const active = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold shrink-0 transition-all ${
                    active
                      ? 'bg-brand-primary dark:bg-white text-white dark:text-slate-900 shadow-md'
                      : 'bg-white dark:bg-white/5 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-white/10 hover:border-brand-secondary'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── PRODUCTS GRID ───────────────────────────────────────────── */}
        {filteredProducts.length === 0 ? (
          <div className="py-20 text-center space-y-3">
            <Search className="w-10 h-10 mx-auto text-slate-400" />
            <h3 className="font-bold text-base text-brand-primary dark:text-white">No products found</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Try adjusting your search query or switching categories.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => {
              const bestStore = product.stores.find((s) => s.isBestMatch) || product.stores[0];
              return (
                <motion.div
                  key={product.id}
                  whileHover={{ y: -4 }}
                  className="rounded-3xl bg-white dark:bg-brand-darkSurface border border-indigo-100/70 dark:border-white/10 shadow-xl overflow-hidden flex flex-col justify-between"
                >
                  <div>
                    {/* Image */}
                    <div className="relative h-48 bg-slate-100 dark:bg-slate-800 overflow-hidden">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-bold bg-white/90 dark:bg-black/80 backdrop-blur-md text-brand-primary dark:text-white shadow-sm">
                        {product.category}
                      </span>
                      <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500 text-white shadow-sm flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {product.fastestDelivery}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="p-5 space-y-3">
                      <div>
                        <h3 className="font-display font-extrabold text-base text-brand-primary dark:text-white">
                          {product.name}
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{product.unit}</p>
                      </div>

                      {/* Best Local Merchant Match Banner */}
                      <div className="p-2.5 rounded-xl bg-indigo-50/80 dark:bg-brand-violet/10 border border-indigo-100 dark:border-brand-violet/20 space-y-1">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="font-bold text-brand-secondary dark:text-brand-violet flex items-center gap-1">
                            <Store className="w-3 h-3" /> Best Match Store
                          </span>
                          <span className="text-slate-500 dark:text-slate-400">{bestStore.distance}</span>
                        </div>
                        <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                          {bestStore.storeName}
                        </p>
                      </div>

                      {/* AI Merchant Comparison Toggle Button */}
                      <button
                        onClick={() => setSelectedProductStores(product)}
                        className="w-full py-1.5 px-3 rounded-lg bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-[11px] font-bold text-slate-600 dark:text-slate-300 hover:text-brand-secondary flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <Zap className="w-3 h-3 text-brand-accent" />
                        Compare All {product.stores.length} Nearby Stores
                      </button>
                    </div>
                  </div>

                  {/* Pricing & Add to Cart Footer */}
                  <div className="p-5 pt-0 flex items-center justify-between border-t border-slate-100 dark:border-white/5 mt-2">
                    <div>
                      <span className="text-[10px] text-slate-400 font-semibold block">Best Local Price</span>
                      <div className="flex items-baseline gap-1.5">
                        <span className="font-extrabold text-lg text-brand-primary dark:text-white">
                          ₹{product.bestPrice}
                        </span>
                        {product.originalPrice > product.bestPrice && (
                          <span className="text-xs text-slate-400 line-through">
                            ₹{product.originalPrice}
                          </span>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={() =>
                        addItem({
                          id: product.id,
                          name: product.name,
                          category: product.category,
                          price: product.bestPrice,
                          originalPrice: product.originalPrice,
                          unit: product.unit,
                          image: product.image,
                          storeName: bestStore.storeName,
                          storeDistance: bestStore.distance,
                          deliveryTime: product.fastestDelivery,
                        })
                      }
                      className="px-4 py-2.5 rounded-xl text-xs font-bold text-white shadow-md transition-all active:scale-95 flex items-center gap-1.5"
                      style={{ background: 'linear-gradient(135deg, #4C1D95, #7C3AED)' }}
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      + Add
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* ── AI MERCHANT COMPARISON MODAL ────────────────────────────── */}
        <AnimatePresence>
          {selectedProductStores && (
            <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedProductStores(null)}
                className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm"
              />

              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="relative z-10 w-full max-w-lg rounded-3xl bg-white dark:bg-brand-darkSurface p-6 shadow-2xl border border-indigo-100 dark:border-white/10 space-y-5"
              >
                <div className="flex items-center justify-between border-b border-indigo-50 dark:border-white/5 pb-4">
                  <div>
                    <span className="section-badge text-[10px] mb-1">
                      <Sparkles className="w-3 h-3" /> Live Merchant AI Routing
                    </span>
                    <h3 className="font-display font-extrabold text-lg text-brand-primary dark:text-white">
                      {selectedProductStores.name}
                    </h3>
                  </div>
                  <button
                    onClick={() => setSelectedProductStores(null)}
                    className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-3">
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Nearby verified local merchants carrying this item:
                  </p>

                  {selectedProductStores.stores.map((s, i) => (
                    <div
                      key={s.storeName}
                      className={`p-4 rounded-2xl border flex items-center justify-between ${
                        s.isBestMatch
                          ? 'border-brand-secondary dark:border-brand-rose bg-indigo-50/50 dark:bg-brand-rose/10'
                          : 'border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-white/4'
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-brand-primary dark:text-white">
                            {s.storeName}
                          </span>
                          {s.isBestMatch && (
                            <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-brand-secondary dark:bg-brand-rose text-white">
                              ★ Best AI Match
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">
                          {s.distance} away · {s.deliveryTime} · {s.stock}
                        </p>
                      </div>

                      <div className="text-right">
                        <span className="font-extrabold text-sm text-brand-primary dark:text-white block">
                          ₹{s.price}
                        </span>
                        <button
                          onClick={() => {
                            addItem({
                              id: selectedProductStores.id,
                              name: selectedProductStores.name,
                              category: selectedProductStores.category,
                              price: s.price,
                              unit: selectedProductStores.unit,
                              image: selectedProductStores.image,
                              storeName: s.storeName,
                              storeDistance: s.distance,
                              deliveryTime: s.deliveryTime,
                            });
                            setSelectedProductStores(null);
                          }}
                          className="text-[11px] font-bold text-brand-secondary dark:text-brand-rose hover:underline"
                        >
                          Select Store →
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-2 text-center">
                  <button
                    onClick={() => setSelectedProductStores(null)}
                    className="px-6 py-2.5 rounded-xl text-xs font-bold bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-200"
                  >
                    Done
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </Container>
    </div>
  );
};
