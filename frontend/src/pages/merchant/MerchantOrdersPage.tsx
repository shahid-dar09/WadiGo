import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  ShoppingBag, Clock, CheckCircle2, Truck, Package,
  Loader2, Filter, ChevronRight, Store, AlertCircle
} from 'lucide-react';
import { useMerchantStore } from '../../store/merchantStore';
import { Container } from '../../components/ui/Container';

const STATUS_OPTIONS = [
  { label: 'All Statuses', value: '' },
  { label: 'Pending', value: 'PENDING' },
  { label: 'Confirmed', value: 'CONFIRMED' },
  { label: 'Preparing', value: 'PREPARING' },
  { label: 'Ready for Pickup', value: 'READY_FOR_PICKUP' },
  { label: 'Out for Delivery', value: 'OUT_FOR_DELIVERY' },
  { label: 'Delivered', value: 'DELIVERED' },
];

export const MerchantOrdersPage: React.FC = () => {
  const { profile, selectedStore, orders, isLoading, fetchProfile, fetchStoreOrders, updateOrderStatus } = useMerchantStore();
  const [selectedStatus, setSelectedStatus] = useState('');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    fetchProfile().then(() => {
      const store = useMerchantStore.getState().selectedStore;
      if (store) fetchStoreOrders(store.id, { status: selectedStatus || undefined });
    });
  }, [selectedStatus]);

  const handleStatusUpdate = async (orderId: string, nextStatus: string) => {
    setUpdatingId(orderId);
    try {
      await updateOrderStatus(orderId, nextStatus);
    } finally {
      setUpdatingId(null);
    }
  };

  if (!profile || !selectedStore) {
    return (
      <div className="min-h-screen py-6" style={{ background: 'var(--page-bg)' }}>
        <Container size="lg">
          <div className="py-20 text-center space-y-3">
            <Store className="w-10 h-10 mx-auto text-amber-500" />
            <p className="font-bold text-slate-700 dark:text-slate-200">Set up your merchant profile and store first</p>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-6" style={{ background: 'var(--page-bg)' }}>
      <Container size="xl" className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-display font-extrabold text-3xl text-amber-900 dark:text-white">Store Orders</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Managing orders for <strong>{selectedStore.name}</strong>
            </p>
          </div>
          {/* Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white focus:outline-none"
            >
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        </div>

        {isLoading ? (
          <div className="py-16 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-amber-500" /></div>
        ) : orders.length === 0 ? (
          <div className="py-16 text-center space-y-3 rounded-2xl bg-white dark:bg-brand-darkSurface border border-amber-100/70 dark:border-white/10 shadow-sm">
            <ShoppingBag className="w-10 h-10 mx-auto text-slate-300" />
            <p className="font-bold text-slate-700 dark:text-slate-200">No orders found</p>
            <p className="text-xs text-slate-400">Incoming customer orders for this store will appear here.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-5 rounded-3xl bg-white dark:bg-brand-darkSurface border border-amber-100/70 dark:border-white/10 shadow-sm space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-amber-50 dark:border-white/5 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-base text-amber-900 dark:text-white">#{order.orderNumber}</span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300">
                        {order.status}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      Customer: {order.customer?.name} ({order.customer?.phone})
                    </p>
                  </div>

                  {/* Status Action Buttons */}
                  <div className="flex items-center gap-2 flex-wrap">
                    {order.status === 'PENDING' && (
                      <button
                        onClick={() => handleStatusUpdate(order.id, 'CONFIRMED')}
                        disabled={updatingId === order.id}
                        className="px-3 py-1.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                      >
                        Accept Order
                      </button>
                    )}
                    {['CONFIRMED', 'MERCHANT_ASSIGNED'].includes(order.status) && (
                      <button
                        onClick={() => handleStatusUpdate(order.id, 'PREPARING')}
                        disabled={updatingId === order.id}
                        className="px-3 py-1.5 rounded-xl text-xs font-bold text-white bg-orange-500 hover:bg-orange-600 transition-colors"
                      >
                        Start Preparing
                      </button>
                    )}
                    {order.status === 'PREPARING' && (
                      <button
                        onClick={() => handleStatusUpdate(order.id, 'READY_FOR_PICKUP')}
                        disabled={updatingId === order.id}
                        className="px-3 py-1.5 rounded-xl text-xs font-bold text-white bg-green-600 hover:bg-green-700 transition-colors"
                      >
                        Mark Ready for Pickup
                      </button>
                    )}
                  </div>
                </div>

                {/* Items */}
                <div className="space-y-2">
                  {order.items?.map((item: any) => (
                    <div key={item.id} className="flex items-center justify-between text-xs p-2 rounded-xl bg-slate-50 dark:bg-slate-900/50">
                      <div className="flex items-center gap-2">
                        <Package className="w-3.5 h-3.5 text-slate-400" />
                        <span className="font-semibold text-slate-900 dark:text-white">{item.product?.name}</span>
                        <span className="text-slate-400">x{item.quantity}</span>
                      </div>
                      <span className="font-bold text-slate-900 dark:text-white">₹{item.totalPrice}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </Container>
    </div>
  );
};
