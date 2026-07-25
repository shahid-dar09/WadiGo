import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Loader2, Shield, CheckCircle2, XCircle } from 'lucide-react';
import { useAdminStore } from '../../store/adminStore';
import { Container } from '../../components/ui/Container';

export const AdminUsersPage: React.FC = () => {
  const { users, isLoading, meta, fetchUsers, setUserActive } = useAdminStore();
  const [roleFilter, setRoleFilter] = useState('');

  useEffect(() => {
    fetchUsers(1, roleFilter || undefined);
  }, [roleFilter]);

  const handleToggleActive = async (userId: string, currentStatus: boolean) => {
    await setUserActive(userId, !currentStatus);
  };

  return (
    <div className="min-h-screen py-6" style={{ background: 'var(--page-bg)' }}>
      <Container size="xl" className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-display font-extrabold text-3xl text-slate-900 dark:text-white">User Governance</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Manage registered accounts, roles, and status across WadiGo.</p>
          </div>

          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white focus:outline-none"
          >
            <option value="">All Roles</option>
            <option value="CUSTOMER">Customer</option>
            <option value="MERCHANT">Merchant</option>
            <option value="DELIVERY_PARTNER">Delivery Partner</option>
            <option value="ADMIN">Admin</option>
          </select>
        </div>

        {isLoading ? (
          <div className="py-16 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-indigo-600" /></div>
        ) : (
          <div className="rounded-3xl bg-white dark:bg-brand-darkSurface border border-slate-200/70 dark:border-white/10 shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-white/5 bg-slate-50 dark:bg-slate-900/60">
                    <th className="px-4 py-3 text-left font-bold text-slate-500 dark:text-slate-400">User</th>
                    <th className="px-4 py-3 text-left font-bold text-slate-500 dark:text-slate-400">Email</th>
                    <th className="px-4 py-3 text-left font-bold text-slate-500 dark:text-slate-400">Roles</th>
                    <th className="px-4 py-3 text-center font-bold text-slate-500 dark:text-slate-400">Orders</th>
                    <th className="px-4 py-3 text-center font-bold text-slate-500 dark:text-slate-400">Status</th>
                    <th className="px-4 py-3 text-center font-bold text-slate-500 dark:text-slate-400">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                  {users.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-50/50 dark:hover:bg-white/3 transition-colors">
                      <td className="px-4 py-3 font-bold text-slate-900 dark:text-white">{u.name}</td>
                      <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{u.email}</td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1 flex-wrap">
                          {u.roles?.map((r: string) => (
                            <span key={r} className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                              {r}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center font-bold text-slate-900 dark:text-white">{u.ordersCount}</td>
                      <td className="px-4 py-3 text-center">
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${u.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          {u.isActive ? 'Active' : 'Deactivated'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => handleToggleActive(u.id, u.isActive)}
                          className={`px-3 py-1 rounded-xl text-[10px] font-bold transition-colors ${
                            u.isActive
                              ? 'bg-red-50 text-red-600 hover:bg-red-100'
                              : 'bg-green-50 text-green-600 hover:bg-green-100'
                          }`}
                        >
                          {u.isActive ? 'Deactivate' : 'Activate'}
                        </button>
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
