import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Store, Loader2, CheckCircle2, XCircle, Ban, AlertCircle } from 'lucide-react';
import { useAdminStore } from '../../store/adminStore';
import { Container } from '../../components/ui/Container';

export const AdminMerchantsPage: React.FC = () => {
  const { merchants, isLoading, fetchMerchants, approveMerchant, suspendMerchant, rejectMerchant } = useAdminStore();
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    fetchMerchants(1, statusFilter || undefined);
  }, [statusFilter]);

  return (
    <div className="min-h-screen py-6" style={{ background: 'var(--page-bg)' }}>
      <Container size="xl" className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-display font-extrabold text-3xl text-slate-900 dark:text-white">Merchant Governance</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Review, approve, or suspend merchant accounts across the platform.</p>
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white focus:outline-none"
          >
            <option value="">All Statuses</option>
            <option value="PENDING">Pending Approval</option>
            <option value="APPROVED">Approved</option>
            <option value="SUSPENDED">Suspended</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </div>

        {isLoading ? (
          <div className="py-16 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-indigo-600" /></div>
        ) : merchants.length === 0 ? (
          <div className="py-16 text-center space-y-3 rounded-2xl bg-white dark:bg-brand-darkSurface border border-slate-200/60 dark:border-white/5">
            <Store className="w-10 h-10 mx-auto text-slate-300" />
            <p className="font-bold text-slate-700 dark:text-slate-200">No merchants found</p>
          </div>
        ) : (
          <div className="rounded-3xl bg-white dark:bg-brand-darkSurface border border-slate-200/70 dark:border-white/10 shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-white/5 bg-slate-50 dark:bg-slate-900/60">
                    <th className="px-4 py-3 text-left font-bold text-slate-500 dark:text-slate-400">Business Name</th>
                    <th className="px-4 py-3 text-left font-bold text-slate-500 dark:text-slate-400">Contact</th>
                    <th className="px-4 py-3 text-center font-bold text-slate-500 dark:text-slate-400">Stores</th>
                    <th className="px-4 py-3 text-center font-bold text-slate-500 dark:text-slate-400">Rating</th>
                    <th className="px-4 py-3 text-center font-bold text-slate-500 dark:text-slate-400">Status</th>
                    <th className="px-4 py-3 text-center font-bold text-slate-500 dark:text-slate-400">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                  {merchants.map((m) => (
                    <tr key={m.id} className="hover:bg-slate-50/50 dark:hover:bg-white/3 transition-colors">
                      <td className="px-4 py-3 font-bold text-slate-900 dark:text-white">{m.businessName}</td>
                      <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
                        {m.contactEmail}<br />
                        <span className="text-[10px] text-slate-400">{m.contactPhone}</span>
                      </td>
                      <td className="px-4 py-3 text-center font-bold text-slate-900 dark:text-white">{(m as any)._count?.stores ?? 0}</td>
                      <td className="px-4 py-3 text-center font-bold text-amber-500">{m.rating?.toFixed(1) ?? '0.0'}</td>
                      <td className="px-4 py-3 text-center">
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                          m.status === 'APPROVED' ? 'bg-green-100 text-green-700' :
                          m.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                        }`}>{m.status}</span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          {m.status !== 'APPROVED' && (
                            <button onClick={() => approveMerchant(m.id)} className="px-2 py-1 rounded-lg text-[10px] font-bold bg-green-50 text-green-700 hover:bg-green-100">
                              Approve
                            </button>
                          )}
                          {m.status !== 'SUSPENDED' && (
                            <button onClick={() => suspendMerchant(m.id)} className="px-2 py-1 rounded-lg text-[10px] font-bold bg-amber-50 text-amber-700 hover:bg-amber-100">
                              Suspend
                            </button>
                          )}
                          {m.status !== 'REJECTED' && (
                            <button onClick={() => rejectMerchant(m.id)} className="px-2 py-1 rounded-lg text-[10px] font-bold bg-red-50 text-red-700 hover:bg-red-100">
                              Reject
                            </button>
                          )}
                        </div>
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
