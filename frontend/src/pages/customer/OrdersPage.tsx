import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Package, Clock, CheckCircle2, Truck, ArrowRight,
  Loader2, Zap, ShoppingBag, ChevronRight
} from 'lucide-react';
import { useOrderStore } from '../../store/orderStore';
import { Container } from '../../components/ui/Container';

const STATUS_COLORS: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300',
  CONFIRMED: 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300',
  MERCHANT_ASSIGNED: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300',
  PREPARING: 'bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300',
  READY_FOR_PICKUP: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-950 dark:text-cyan-300',
  OUT_FOR_DELIVERY: 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300',
  DELIVERED: 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300',
  CANCELLED: 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300',
};

const STATUS_LABELS: Record<string, string> = {
  PENDING: 'Pending',
  CONFIRMED: 'Confirmed',
  MERCHANT_ASSIGNED: 'Merchant Assigned',
  PREPARING: 'Preparing',
  READY_FOR_PICKUP: 'Ready for Pickup',
  OUT_FOR_DELIVERY: 'Out for Delivery',
  DELIVERED: 'Delivered',
  CANCELLED: 'Cancelled',
};

export const OrdersPage: React.FC = () => {
  const { orders, isLoading, meta, fetchMyOrders } = useOrderStore();

  useEffect(() => {
    fetchMyOrders(1);
  }, []);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  return (
    <div className="min-h-screen page-bg py-6">
      <Container size="lg" className="space-y-6">
        {/* Header */}
        <div>
          <span className="section-badge text-xs mb-1">
            <Package className="w-3.5 h-3.5" />
            Order History
          </span>
          <h1 className="font-display font-extrabold text-3xl text-brand-primary dark:text-white">My Orders</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Track and manage all your WadiGo orders.
          </p>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center space-y-3">
              <Loader2 className="w-8 h-8 animate-spin mx-auto text-brand-secondary dark:text-brand-rose" />
              <p className="text-sm text-slate-500 dark:text-slate-400">Loading your orders...</p>
            </div>
          </div>
        ) : orders.length === 0 ? (
          <div className="py-20 text-center space-y-4 rounded-3xl bg-white dark:bg-brand-darkSurface border border-indigo-100/70 dark:border-white/10 shadow-sm">
            <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-950 flex items-center justify-center mx-auto">
              <ShoppingBag className="w-8 h-8 text-brand-secondary dark:text-brand-rose" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-slate-700 dark:text-slate-200">No Orders Yet</h3>
              <p className="text-xs text-slate-400 mt-1">Your WadiGo order history will appear here.</p>
            </div>
            <Link
              to="/products"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl font-bold text-sm text-white"
              style={{ background: 'linear-gradient(135deg, #4C1D95, #7C3AED)' }}
            >
              Start Shopping
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {meta && (
              <p className="text-xs text-slate-400">{meta.total} total orders</p>
            )}
            {orders.map((order) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-5 rounded-3xl bg-white dark:bg-brand-darkSurface border border-indigo-100/70 dark:border-white/10 shadow-sm hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-sm text-brand-primary dark:text-white">
                        #{order.orderNumber}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${STATUS_COLORS[order.status] || ''}`}>
                        {STATUS_LABELS[order.status] || order.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">{formatDate(order.createdAt)}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-extrabold text-base text-brand-primary dark:text-white">₹{order.finalAmount}</p>
                    <p className="text-[10px] text-slate-400">{order.paymentMethod}</p>
                  </div>
                </div>

                {/* Items Preview */}
                <div className="flex gap-2 mb-3">
                  {order.items.slice(0, 3).map((item) => (
                    <div key={item.id} className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 overflow-hidden shrink-0">
                      {item.product.imageUrl ? (
                        <img src={item.product.imageUrl} alt={item.product.name} className="w-full h-full object-cover" />
                      ) : (
                        <Package className="w-4 h-4 m-3 text-slate-400" />
                      )}
                    </div>
                  ))}
                  {order.items.length > 3 && (
                    <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-[10px] font-bold text-slate-500">
                      +{order.items.length - 3}
                    </div>
                  )}
                  <div className="flex-1 min-w-0 self-center ml-1">
                    <p className="text-xs font-semibold text-slate-700 dark:text-slate-200 truncate">
                      {order.items[0]?.product.name}
                      {order.items.length > 1 ? ` +${order.items.length - 1} more` : ''}
                    </p>
                    <p className="text-[10px] text-slate-400">{order.items.length} item{order.items.length !== 1 ? 's' : ''}</p>
                  </div>
                </div>

                <Link
                  to={`/orders/${order.id}`}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-indigo-100 dark:border-white/10 text-xs font-bold text-brand-secondary dark:text-brand-rose hover:bg-indigo-50 dark:hover:bg-indigo-950/30 transition-colors"
                >
                  <Truck className="w-3.5 h-3.5" />
                  Track Order
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </motion.div>
            ))}

            {/* Load more */}
            {meta && meta.page < meta.totalPages && (
              <div className="flex justify-center">
                <button
                  onClick={() => fetchMyOrders(meta.page + 1)}
                  className="px-5 py-2.5 rounded-2xl border border-brand-secondary dark:border-brand-rose text-xs font-bold text-brand-secondary dark:text-brand-rose hover:bg-brand-secondary/5"
                >
                  Load More Orders
                </button>
              </div>
            )}
          </div>
        )}
      </Container>
    </div>
  );
};
