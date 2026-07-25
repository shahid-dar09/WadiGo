import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, Loader2, Package, Filter } from 'lucide-react';
import { useAdminStore } from '../../store/adminStore';
import { Container } from '../../components/ui/Container';

export const AdminOrdersPage: React.FC = () => {
  const { orders, isLoading, fetchOrders } = useAdminStore();
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    fetchOrders(1, statusFilter || undefined);
  }, [statusFilter]);

  return (
    <div className="min-h-screen py-6" style={{ background: 'var(--page-bg)' }}>
      <Container size="xl" className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-display font-extrabold text-3xl text-slate-900 dark:text-white">All Platform Orders</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Audit and inspect all customer orders placed across WadiGo.</p>
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white focus:outline-none"
          >
            <option value="">All Statuses</option>
            <option value="PENDING">Pending</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="PREPARING">Preparing</option>
            <option value="READY_FOR_PICKUP">Ready for Pickup</option>
            <option value="OUT_FOR_DELIVERY">Out for Delivery</option>
            <option value="DELIVERED">Delivered</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>

        {isLoading ? (
          <div className="py-16 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-indigo-600" /></div>
        ) : orders.length === 0 ? (
          <div className="py-16 text-center space-y-3 rounded-2xl bg-white dark:bg-brand-darkSurface border border-slate-200/60 dark:border-white/5">
            <ShoppingBag className="w-10 h-10 mx-auto text-slate-300" />
            <p className="font-bold text-slate-700 dark:text-slate-200">No orders found</p>
          </div>
        ) : (
          <div className="rounded-3xl bg-white dark:bg-brand-darkSurface border border-slate-200/70 dark:border-white/10 shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-white/5 bg-slate-50 dark:bg-slate-900/60">
                    <th className="px-4 py-3 text-left font-bold text-slate-500 dark:text-slate-400">Order Number</th>
                    <th className="px-4 py-3 text-left font-bold text-slate-500 dark:text-slate-400">Customer</th>
                    <th className="px-4 py-3 text-right font-bold text-slate-500 dark:text-slate-400">Amount</th>
                    <th className="px-4 py-3 text-center font-bold text-slate-500 dark:text-slate-400">Payment</th>
                    <th className="px-4 py-3 text-center font-bold text-slate-500 dark:text-slate-400">Status</th>
                    <th className="px-4 py-3 text-right font-bold text-slate-500 dark:text-slate-400">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                  {orders.map((o) => (
                    <tr key={o.id} className="hover:bg-slate-50/50 dark:hover:bg-white/3 transition-colors">
                      <td className="px-4 py-3 font-extrabold text-slate-900 dark:text-white">#{o.orderNumber}</td>
                      <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{o.customer?.name ?? 'Customer'}</td>
                      <td className="px-4 py-3 text-right font-bold text-slate-900 dark:text-white">₹{o.finalAmount}</td>
                      <td className="px-4 py-3 text-center font-bold text-slate-500">{o.paymentMethod}</td>
                      <td className="px-4 py-3 text-center">
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                          {o.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right text-slate-400">
                        {new Date(o.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </Container>
    </div>
  );
};
