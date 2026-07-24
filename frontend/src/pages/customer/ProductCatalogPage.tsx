import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Filter, Store, Clock, Zap, Sparkles, CheckCircle2,
  SlidersHorizontal, ChevronDown, ShoppingBag, ArrowUpDown, X, Package
} from 'lucide-react';
import { Container } from '../../components/ui/Container';
import { useCartStore } from '../../store/cartStore';

export interface StoreOption {
  storeName: string;
  distance: string;
  price: number;
  deliveryTime: string;
  stock: string;
  isBestMatch?: boolean;
}

export interface CatalogProduct {
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

const CATEGORIES = ['All', 'Dairy', 'Produce', 'Bakery', 'Electronics', 'Beverages', 'Pharmacy'];

export const ProductCatalogPage: React.FC = () => {
  const [searchQuery, setSearchQuery]           = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedProductStores, setSelectedProductStores] = useState<CatalogProduct | null>(null);

  /* Real dynamic products array (starts empty until backend connects or user adds) */
  const products: CatalogProduct[] = [];

  const { addItem } = useCartStore();

  const filteredProducts = products.filter((p) => {
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
              placeholder="Search any product..."
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

        {/* ── PRODUCTS GRID (EMPTY STATE) ─────────────────────────────── */}
        {filteredProducts.length === 0 ? (
          <div className="py-20 text-center space-y-4 max-w-md mx-auto rounded-3xl bg-white dark:bg-brand-darkSurface p-8 border border-indigo-100/70 dark:border-white/10 shadow-xl">
            <div className="w-14 h-14 rounded-2xl mx-auto flex items-center justify-center bg-indigo-50 dark:bg-white/5 text-slate-400">
              <Package className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <h3 className="font-display font-extrabold text-lg text-brand-primary dark:text-white">
                No Products Listed Yet
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                As local merchants register their inventory, live product availability, prices, and sub-15 minute dispatch windows will populate here automatically.
              </p>
            </div>
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

      </Container>
    </div>
  );
};
