import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Store, Package, ShoppingBag, TrendingUp, ArrowRight,
  CheckCircle2, Clock, AlertCircle, Plus, Zap
} from 'lucide-react';
import { useMerchantStore } from '../../store/merchantStore';
import { Container } from '../../components/ui/Container';

export const MerchantDashboardPage: React.FC = () => {
  const { profile, orders, isLoading, fetchProfile, fetchStoreOrders } = useMerchantStore();

  useEffect(() => {
    fetchProfile().then(() => {
      const store = useMerchantStore.getState().selectedStore;
      if (store) fetchStoreOrders(store.id, { limit: 5 });
    });
  }, []);

  const pendingOrders = orders.filter((o) => ['PENDING', 'CONFIRMED', 'PREPARING'].includes(o.status)).length;
  const deliveredOrders = orders.filter((o) => o.status === 'DELIVERED').length;

  const stats = [
    { label: 'Total Stores', value: profile?.stores?.length ?? 0, icon: Store, color: 'from-amber-500 to-orange-500' },
    { label: 'Pending Orders', value: pendingOrders, icon: Clock, color: 'from-indigo-500 to-purple-500' },
    { label: 'Recent Deliveries', value: deliveredOrders, icon: CheckCircle2, color: 'from-green-500 to-emerald-500' },
    { label: 'Rating', value: profile?.rating?.toFixed(1) ?? '0.0', icon: TrendingUp, color: 'from-pink-500 to-rose-500' },
  ];

  const statusMap: Record<string, { label: string; color: string }> = {
    PENDING: { label: 'Pending', color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300' },
    CONFIRMED: { label: 'Confirmed', color: 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300' },
    PREPARING: { label: 'Preparing', color: 'bg-orange-100 text-orange-700' },
    DELIVERED: { label: 'Delivered', color: 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300' },
    CANCELLED: { label: 'Cancelled', color: 'bg-red-100 text-red-700' },
  };

  return (
    <div className="min-h-screen py-6" style={{ background: 'var(--page-bg)' }}>
      <Container size="xl" className="space-y-6">
        {/* Header */}
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #B45309, #F59E0B)' }}>
              <Zap className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">Merchant Portal</span>
          </div>
          <h1 className="font-display font-extrabold text-3xl text-amber-900 dark:text-white">
            {isLoading ? 'Loading...' : `Welcome, ${profile ? profile.businessName : 'Merchant'}!`}
          </h1>
          {profile && (
            <div className="flex items-center gap-2 mt-1">
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                profile.status === 'APPROVED' ? 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300' :
                profile.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
                'bg-red-100 text-red-700'
              }`}>{profile.status}</span>
              {profile.status === 'PENDING' && (
                <span className="text-xs text-slate-400">Your account is pending admin approval. You can set up your store in the meantime.</span>
              )}
            </div>
          )}
        </div>

        {!profile ? (
          /* Onboarding Card */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-8 rounded-3xl bg-white dark:bg-brand-darkSurface border border-amber-200/70 dark:border-white/10 shadow-xl text-center space-y-5"
          >
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto" style={{ background: 'linear-gradient(135deg, #B45309, #F59E0B)' }}>
              <Store className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="font-display font-extrabold text-2xl text-amber-900 dark:text-white">Set Up Your Merchant Profile</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-md mx-auto">
                Create your merchant profile to start listing products and receiving orders on WadiGo.
              </p>
            </div>
            <Link to="/merchant/profile"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm text-white shadow-lg"
              style={{ background: 'linear-gradient(135deg, #B45309, #F59E0B)' }}>
              <Plus className="w-4 h-4" />
              Create Merchant Profile
            </Link>
          </motion.div>
        ) : (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {stats.map((stat, idx) => {
                const Icon = stat.icon;
                return (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.08 }}
                    className="p-5 rounded-2xl bg-white dark:bg-brand-darkSurface border border-amber-100/50 dark:border-white/10 shadow-sm"
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br ${stat.color} mb-3`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <p className="font-extrabold text-2xl text-slate-900 dark:text-white">{stat.value}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{stat.label}</p>
                  </motion.div>
                );
              })}
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { label: 'Manage Inventory', href: '/merchant/inventory', icon: Package, desc: 'Add/edit product stock & prices' },
                { label: 'View Orders', href: '/merchant/orders', icon: ShoppingBag, desc: 'Manage incoming customer orders' },
                { label: 'Edit Profile & Store', href: '/merchant/profile', icon: Store, desc: 'Update business information' },
              ].map((action) => {
                const Icon = action.icon;
                return (
                  <Link key={action.label} to={action.href}
                    className="p-5 rounded-2xl bg-white dark:bg-brand-darkSurface border border-amber-100/50 dark:border-white/10 shadow-sm hover:shadow-md transition-all group flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'linear-gradient(135deg, #B45309, #F59E0B)' }}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-sm text-slate-900 dark:text-white">{action.label}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">{action.desc}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors shrink-0" />
                  </Link>
                );
              })}
            </div>

            {/* Recent Orders */}
            {orders.length > 0 && (
              <div className="p-6 rounded-3xl bg-white dark:bg-brand-darkSurface border border-amber-100/50 dark:border-white/10 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-base text-amber-900 dark:text-white">Recent Orders</h3>
                  <Link to="/merchant/orders" className="text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline">View All →</Link>
                </div>
                <div className="space-y-3">
                  {orders.slice(0, 5).map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50">
                      <div>
                        <p className="font-bold text-xs text-slate-900 dark:text-white">#{order.orderNumber}</p>
                        <p className="text-[10px] text-slate-400">{order.items?.length ?? 0} items · ₹{order.finalAmount}</p>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${statusMap[order.status]?.color || ''}`}>
                        {statusMap[order.status]?.label || order.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </Container>
    </div>
  );
};
