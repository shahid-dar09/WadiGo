import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Truck, MapPin, Package, Clock, CheckCircle2, Loader2, Navigation } from 'lucide-react';
import { useDeliveryStore } from '../../store/deliveryStore';
import { Container } from '../../components/ui/Container';

export const DeliveryDashboardPage: React.FC = () => {
  const { availableOrders, activeOrder, isLoading, fetchAvailableOrders, updateOrderStatus } = useDeliveryStore();
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    fetchAvailableOrders();
  }, []);

  const handleUpdateStatus = async (orderId: string, status: string, notes?: string) => {
    setUpdatingId(orderId);
    try {
      await updateOrderStatus(orderId, status, notes);
      fetchAvailableOrders();
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="min-h-screen py-6" style={{ background: 'var(--page-bg)' }}>
      <Container size="md" className="space-y-6">
        <div>
          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 inline-flex items-center gap-1">
            <Truck className="w-3 h-3" /> Live Dispatch
          </span>
          <h1 className="font-display font-extrabold text-2xl text-slate-900 dark:text-white mt-2">
            Available Deliveries
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Pick up orders from merchants and deliver to customers nearby.
          </p>
        </div>

        {isLoading ? (
          <div className="py-16 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-emerald-600" /></div>
        ) : availableOrders.length === 0 ? (
          <div className="py-16 text-center space-y-3 rounded-2xl bg-white dark:bg-brand-darkSurface border border-slate-200/60 dark:border-white/5">
            <Package className="w-10 h-10 mx-auto text-slate-300" />
            <p className="font-bold text-slate-700 dark:text-slate-200">No orders ready for pickup right now</p>
            <p className="text-xs text-slate-400">New orders will appear automatically when merchants mark them ready.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {availableOrders.map((order) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-5 rounded-3xl bg-white dark:bg-brand-darkSurface border border-emerald-100 dark:border-white/10 shadow-lg space-y-4"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-extrabold text-lg text-slate-900 dark:text-white">#{order.orderNumber}</span>
                    <p className="text-xs text-slate-400 mt-0.5">Customer: {order.customer?.name}</p>
                  </div>
                  <div className="text-right">
                    <span className="font-extrabold text-lg text-emerald-600 dark:text-emerald-400">₹{order.finalAmount}</span>
                    <p className="text-[10px] text-slate-400">{order.paymentMethod}</p>
                  </div>
                </div>

                {/* Items */}
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 space-y-1">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Items ({order.items?.length ?? 0})</p>
                  <p className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                    {order.items?.map((i: any) => i.product?.name).join(', ')}
                  </p>
                </div>

                {/* Action */}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleUpdateStatus(order.id, 'OUT_FOR_DELIVERY', 'Picked up from merchant')}
                    disabled={updatingId === order.id}
                    className="flex-1 py-3 rounded-2xl font-bold text-xs text-white bg-emerald-600 hover:bg-emerald-700 transition-colors shadow-md flex items-center justify-center gap-2"
                  >
                    {updatingId === order.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <Navigation className="w-4 h-4" /> Accept & Start Delivery
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </Container>
    </div>
  );
};
