import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Package, Clock, MapPin, Store, CheckCircle2, ArrowRight,
  Truck, ShieldCheck, Zap, ChevronRight
} from 'lucide-react';
import { Container } from '../../components/ui/Container';
import { Button } from '../../components/ui/Button';

export interface OrderSummary {
  id: string;
  date: string;
  items: string[];
  total: number;
  status: 'OUT_FOR_DELIVERY' | 'DELIVERED' | 'PREPARING';
  storeName: string;
  storeDistance: string;
  deliveryTime: string;
}

export const OrdersPage: React.FC = () => {
  /* Real dynamic orders array (starts empty until orders are placed) */
  const orders: OrderSummary[] = [];

  return (
    <div className="min-h-screen page-bg py-8">
      <Container size="lg" className="space-y-7">

        {/* ── HEADER ──────────────────────────────────────────────────── */}
        <div>
          <span className="section-badge text-xs mb-1">
            <Package className="w-3.5 h-3.5" />
            Hyperlocal Delivery Log
          </span>
          <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-brand-primary dark:text-white">
            My Orders & Tracking
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Track active sub-15 minute orders in real-time or view past purchase receipts.
          </p>
        </div>

        {/* ── ORDERS LIST (EMPTY STATE) ───────────────────────────────── */}
        {orders.length === 0 ? (
          <div className="py-20 text-center space-y-4 max-w-md mx-auto rounded-3xl bg-white dark:bg-brand-darkSurface p-8 border border-indigo-100/70 dark:border-white/10 shadow-xl">
            <div className="w-14 h-14 rounded-2xl mx-auto flex items-center justify-center bg-indigo-50 dark:bg-white/5 text-slate-400">
              <Package className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <h3 className="font-display font-extrabold text-lg text-brand-primary dark:text-white">
                No Orders Placed Yet
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                When you place your first order on WadiGo, live map tracking, merchant status updates, and digital receipts will appear here.
              </p>
            </div>
            <div>
              <Link to="/products">
                <Button variant="gradient" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                  Browse Product Catalog
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              const isActive = order.status === 'OUT_FOR_DELIVERY' || order.status === 'PREPARING';
              return (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-6 rounded-3xl bg-white dark:bg-brand-darkSurface border shadow-xl transition-all space-y-4 ${
                    isActive
                      ? 'border-brand-secondary dark:border-brand-rose shadow-indigo-500/10'
                      : 'border-indigo-100/70 dark:border-white/10'
                  }`}
                >
                  {/* Header Row */}
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 dark:border-white/5 pb-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-white shadow-sm ${
                          isActive
                            ? 'bg-emerald-500'
                            : 'bg-indigo-500 dark:bg-brand-violet'
                        }`}
                      >
                        <Package className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-display font-extrabold text-base text-brand-primary dark:text-white">
                            Order #{order.id}
                          </h3>
                          {isActive ? (
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 animate-pulse">
                              ● Out for Delivery
                            </span>
                          ) : (
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300">
                              Delivered
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5">{order.date}</p>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 block font-medium">Total Amount</span>
                      <span className="font-extrabold text-lg text-brand-primary dark:text-white">
                        ₹{order.total}
                      </span>
                    </div>
                  </div>

                  {/* Body Row */}
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="space-y-1.5 min-w-0">
                      <div className="flex items-center gap-1.5 text-xs text-brand-secondary dark:text-brand-rose font-semibold">
                        <Store className="w-3.5 h-3.5" />
                        <span>{order.storeName} ({order.storeDistance})</span>
                      </div>

                      <p className="text-xs text-slate-700 dark:text-slate-300 font-medium truncate">
                        Items: {order.items.join(' · ')}
                      </p>
                    </div>

                    {/* Actions */}
                    <div>
                      <Link to={`/orders/${order.id}`}>
                        <Button variant="outline" size="sm" rightIcon={<ChevronRight className="w-4 h-4" />}>
                          View Receipt
                        </Button>
                      </Link>
                    </div>
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
