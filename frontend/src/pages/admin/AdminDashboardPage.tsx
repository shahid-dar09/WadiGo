import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Users, Store, Package, ShoppingBag, DollarSign,
  TrendingUp, ShieldCheck, Loader2, ArrowRight
} from 'lucide-react';
import { useAdminStore } from '../../store/adminStore';
import { Container } from '../../components/ui/Container';
import { Link } from 'react-router-dom';

export const AdminDashboardPage: React.FC = () => {
  const { overview, isLoading, fetchOverview } = useAdminStore();

  useEffect(() => {
    fetchOverview();
  }, []);

  const kpis = [
    { label: 'Total Platform Users', value: overview?.totalUsers ?? 0, icon: Users, color: 'from-blue-500 to-indigo-600' },
    { label: 'Registered Merchants', value: overview?.totalMerchants ?? 0, icon: Store, color: 'from-amber-500 to-orange-600' },
    { label: 'Active Catalog Items', value: overview?.totalProducts ?? 0, icon: Package, color: 'from-emerald-500 to-teal-600' },
    { label: 'Total Platform Orders', value: overview?.totalOrders ?? 0, icon: ShoppingBag, color: 'from-purple-500 to-pink-600' },
    { label: 'Platform Gross GMV', value: `₹${overview?.totalRevenue ?? 0}`, icon: DollarSign, color: 'from-rose-500 to-red-600' },
  ];

  return (
    <div className="min-h-screen py-6" style={{ background: 'var(--page-bg)' }}>
      <Container size="xl" className="space-y-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <ShieldCheck className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">Admin Governance</span>
          </div>
          <h1 className="font-display font-extrabold text-3xl text-slate-900 dark:text-white">
            Platform Operations Overview
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Monitor real-time metrics across users, merchants, orders, and system health.
          </p>
        </div>

        {isLoading ? (
          <div className="py-16 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-indigo-600" /></div>
        ) : (
          <>
            {/* KPI Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              {kpis.map((kpi, idx) => {
                const Icon = kpi.icon;
                return (
                  <motion.div
                    key={kpi.label}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.06 }}
                    className="p-5 rounded-2xl bg-white dark:bg-brand-darkSurface border border-slate-200/70 dark:border-white/10 shadow-sm"
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br ${kpi.color} mb-3 shadow-md`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <p className="font-extrabold text-2xl text-slate-900 dark:text-white">{kpi.value}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{kpi.label}</p>
                  </motion.div>
                );
              })}
            </div>

            {/* Platform Control Links */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Link to="/admin/users" className="p-5 rounded-2xl bg-white dark:bg-brand-darkSurface border border-slate-200/70 dark:border-white/10 shadow-sm hover:shadow-md transition-all flex items-center justify-between group">
                <div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">User Governance</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Manage customer accounts & status</p>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 transition-colors" />
              </Link>
              <Link to="/admin/merchants" className="p-5 rounded-2xl bg-white dark:bg-brand-darkSurface border border-slate-200/70 dark:border-white/10 shadow-sm hover:shadow-md transition-all flex items-center justify-between group">
                <div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">Merchant Governance</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Approve, suspend & review stores</p>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 transition-colors" />
              </Link>
              <Link to="/admin/orders" className="p-5 rounded-2xl bg-white dark:bg-brand-darkSurface border border-slate-200/70 dark:border-white/10 shadow-sm hover:shadow-md transition-all flex items-center justify-between group">
                <div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">Order Audits</h3>
                  <p className="text-xs text-slate-400 mt-0.5">View all orders across platform</p>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 transition-colors" />
              </Link>
            </div>
          </>
        )}
      </Container>
    </div>
  );
};
