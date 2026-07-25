import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Mail, Lock, ArrowRight, AlertCircle } from 'lucide-react';
import { Container } from '../../components/ui/Container';
import { useAuthStore } from '../../store/authStore';

export const AdminAuthPage: React.FC = () => {
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const { login, isLoading } = useAuthStore();
  const navigate = useNavigate();

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    const form = e.target as HTMLFormElement;
    const email = (form.elements.namedItem('email') as HTMLInputElement).value;
    const password = (form.elements.namedItem('password') as HTMLInputElement).value;

    try {
      await login({ email, password });
      navigate('/admin');
    } catch (err: any) {
      setErrorMsg(err.message || 'Admin authentication failed');
    }
  };

  return (
    <div className="min-h-screen page-bg flex items-center py-10">
      <Container size="lg" className="relative z-10 w-full">
        <div className="max-w-md w-full mx-auto p-8 rounded-3xl bg-slate-900 border border-indigo-500/30 text-white shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white mx-auto shadow-lg"
              style={{ background: 'linear-gradient(135deg, #1E1B4B, #4C1D95)' }}>
              <ShieldCheck className="w-7 h-7 text-indigo-400" />
            </div>
            <h1 className="font-display font-extrabold text-2xl text-white">System Admin Portal</h1>
            <p className="text-xs text-slate-400">Platform Governance & Governance Access Control</p>
          </div>

          {errorMsg && (
            <div className="p-3 rounded-xl bg-red-950/60 border border-red-800 text-red-300 text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Admin Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                <input name="email" required type="email" placeholder="admin@wadigo.com"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-700 bg-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500" />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Master Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                <input name="password" required type="password" placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-700 bg-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500" />
              </div>
            </div>

            <button type="submit" disabled={isLoading}
              className="w-full py-3.5 rounded-2xl font-bold text-sm text-white shadow-lg flex items-center justify-center gap-2"
              style={{ background: 'linear-gradient(135deg, #1E1B4B, #4C1D95)' }}>
              {isLoading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <>Authenticate Superuser <ArrowRight className="w-4 h-4" /></>}
            </button>
          </form>

          <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/50 text-[10px] text-slate-400 text-center">
            🔒 Restricted access for platform operators & system administrators.
          </div>
        </div>
      </Container>
    </div>
  );
};
