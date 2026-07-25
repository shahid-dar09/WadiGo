import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft, Package, Clock, CheckCircle2, Truck,
  Store, MapPin, Loader2, Zap
} from 'lucide-react';
import { useOrderStore } from '../../store/orderStore';
import { Container } from '../../components/ui/Container';

const STATUS_STEPS = [
  { key: 'PENDING', label: 'Order Placed', icon: Package },
  { key: 'CONFIRMED', label: 'Confirmed', icon: CheckCircle2 },
  { key: 'PREPARING', label: 'Preparing', icon: Clock },
  { key: 'OUT_FOR_DELIVERY', label: 'On the Way', icon: Truck },
  { key: 'DELIVERED', label: 'Delivered', icon: CheckCircle2 },
];

const STATUS_ORDER = ['PENDING', 'CONFIRMED', 'MERCHANT_ASSIGNED', 'PREPARING', 'READY_FOR_PICKUP', 'OUT_FOR_DELIVERY', 'DELIVERED'];

export const OrderTrackingPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const { selectedOrder, isLoading, error, fetchOrderById } = useOrderStore();

  useEffect(() => {
    if (orderId) fetchOrderById(orderId);
  }, [orderId]);

  if (isLoading) {
    return (
      <div className="min-h-screen page-bg flex items-center justify-center">
        <div className="text-center space-y-3">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-brand-secondary dark:text-brand-rose" />
          <p className="text-sm text-slate-500 dark:text-slate-400">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (error || !selectedOrder) {
    return (
      <div className="min-h-screen page-bg flex items-center justify-center">
        <div className="text-center space-y-4">
          <Package className="w-12 h-12 mx-auto text-slate-300" />
          <h2 className="font-bold text-lg text-slate-700 dark:text-slate-200">Order Not Found</h2>
          <Link to="/orders" className="text-sm text-brand-secondary dark:text-brand-rose font-bold">
            ← Back to Orders
          </Link>
        </div>
      </div>
    );
  }

  const order = selectedOrder;
  const currentStatusIdx = STATUS_ORDER.indexOf(order.status);

  return (
    <div className="min-h-screen page-bg py-6">
      <Container size="lg" className="space-y-6">
        {/* Back */}
        <Link to="/orders" className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 hover:text-brand-secondary dark:hover:text-brand-rose font-semibold transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Orders
        </Link>

        {/* Order Header */}
        <div className="p-6 rounded-3xl bg-white dark:bg-brand-darkSurface border border-indigo-100/70 dark:border-white/10 shadow-lg">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-brand-secondary dark:text-brand-rose" />
                <span className="font-extrabold text-xl text-brand-primary dark:text-white">#{order.orderNumber}</span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Placed on {new Date(order.createdAt).toLocaleString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
            <div className="text-right">
              <p className="font-extrabold text-2xl text-brand-primary dark:text-white">₹{order.finalAmount}</p>
              <p className="text-xs text-slate-400">{order.paymentMethod}</p>
            </div>
          </div>
        </div>

        {/* Status Progress */}
        <div className="p-6 rounded-3xl bg-white dark:bg-brand-darkSurface border border-indigo-100/70 dark:border-white/10 shadow-lg">
          <h2 className="font-bold text-base text-brand-primary dark:text-white mb-6">Order Status</h2>
          <div className="flex items-center">
            {STATUS_STEPS.map((step, idx) => {
              const stepStatusIdx = STATUS_ORDER.indexOf(step.key);
              const isDone = currentStatusIdx > stepStatusIdx;
              const isCurrent = currentStatusIdx === stepStatusIdx;
              const Icon = step.icon;

              return (
                <React.Fragment key={step.key}>
                  <div className="flex flex-col items-center gap-1.5 flex-1">
                    <motion.div
                      animate={{ scale: isCurrent ? [1, 1.15, 1] : 1 }}
                      transition={{ repeat: isCurrent ? Infinity : 0, duration: 1.5 }}
                      className={`w-10 h-10 rounded-full flex items-center justify-center shadow-sm ${
                        isDone
                          ? 'bg-green-500 text-white'
                          : isCurrent
                          ? 'bg-brand-secondary dark:bg-brand-rose text-white'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </motion.div>
                    <span className={`text-[10px] font-bold text-center ${isDone || isCurrent ? 'text-slate-900 dark:text-white' : 'text-slate-400'}`}>
                      {step.label}
                    </span>
                  </div>
                  {idx < STATUS_STEPS.length - 1 && (
                    <div className={`h-0.5 flex-1 mx-1 rounded-full ${isDone ? 'bg-green-500' : 'bg-slate-200 dark:bg-white/10'}`} />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Order Items */}
          <div className="p-6 rounded-3xl bg-white dark:bg-brand-darkSurface border border-indigo-100/70 dark:border-white/10 shadow-lg space-y-4">
            <h3 className="font-bold text-base text-brand-primary dark:text-white">Order Items</h3>
            <div className="space-y-3">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50">
                  <div className="w-12 h-12 rounded-lg bg-slate-200 dark:bg-slate-700 overflow-hidden shrink-0">
                    {item.product.imageUrl ? (
                      <img src={item.product.imageUrl} alt={item.product.name} className="w-full h-full object-cover" />
                    ) : (
                      <Package className="w-5 h-5 m-3.5 text-slate-400" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-xs text-slate-900 dark:text-white truncate">{item.product.name}</p>
                    <p className="text-[10px] text-slate-400">{item.quantity} × ₹{item.unitPrice}</p>
                    <div className="flex items-center gap-1 mt-0.5">
                      <Store className="w-3 h-3 text-slate-400" />
                      <span className="text-[10px] text-slate-400">{(item as any).store?.name}</span>
                    </div>
                  </div>
                  <p className="font-extrabold text-sm text-brand-primary dark:text-white shrink-0">₹{item.totalPrice}</p>
                </div>
              ))}
            </div>

            {/* Price Breakdown */}
            <div className="border-t border-slate-100 dark:border-white/5 pt-3 space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-500 dark:text-slate-400">
                <span>Subtotal</span>
                <span>₹{order.totalAmount}</span>
              </div>
              <div className="flex justify-between text-slate-500 dark:text-slate-400">
                <span>Delivery Fee</span>
                <span>₹{order.deliveryFee}</span>
              </div>
              <div className="flex justify-between font-extrabold text-sm text-brand-primary dark:text-white">
                <span>Total</span>
                <span>₹{order.finalAmount}</span>
              </div>
            </div>
          </div>

          {/* Status History */}
          <div className="p-6 rounded-3xl bg-white dark:bg-brand-darkSurface border border-indigo-100/70 dark:border-white/10 shadow-lg space-y-4">
            <h3 className="font-bold text-base text-brand-primary dark:text-white">Status History</h3>
            <div className="space-y-3">
              {order.history.map((h, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-brand-secondary dark:bg-brand-rose mt-1.5 shrink-0" />
                  <div>
                    <p className="font-bold text-xs text-slate-900 dark:text-white">{h.status.replace(/_/g, ' ')}</p>
                    {h.notes && <p className="text-[10px] text-slate-400">{h.notes}</p>}
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      {new Date(h.createdAt).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};
