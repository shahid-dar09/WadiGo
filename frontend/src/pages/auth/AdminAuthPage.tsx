import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Mail, Lock, ArrowRight, AlertCircle, Sparkles, Users, Store, BarChart3, Eye, EyeOff } from 'lucide-react';
import { Container } from '../../components/ui/Container';
import { useAuthStore } from '../../store/authStore';
import { useThemeStore } from '../../store/themeStore';
import { AuthPortalLinks } from '../../components/auth/AuthPortalLinks';

const FeaturePill: React.FC<{
  icon: React.ElementType;
  label: string;
  value: string;
  delay?: number;
}> = ({ icon: Icon, label, value, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, x: -16 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay, duration: 0.5, ease: 'easeOut' }}
    className="flex items-center gap-2.5 p-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm"
  >
    <div className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-300">
      <Icon className="w-3.5 h-3.5" />
    </div>
    <div>
      <p className="text-[10px] text-indigo-200/70 leading-none">{label}</p>
      <p className="text-xs font-bold text-white mt-0.5">{value}</p>
    </div>
  </motion.div>
);

export const AdminAuthPage: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const { login, isLoading } = useAuthStore();
  const { isDarkMode } = useThemeStore();
  const navigate = useNavigate();

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    const form = e.target as HTMLFormElement;
    const email = (form.elements.namedItem('email') as HTMLInputElement).value;
    const password = (form.elements.namedItem('password') as HTMLInputElement).value;

    try {
      await login({ email, password, requiredRole: 'ADMIN' });
      navigate('/admin');
    } catch (err: any) {
      setErrorMsg(err.message || 'Admin authentication failed');
    }
  };

  return (
    <div className="min-h-screen page-bg flex items-center py-10">
      <div className="orb orb-violet w-96 h-96 -top-32 -left-32 opacity-25 pointer-events-none fixed" />
      <div className="orb orb-rose w-80 h-80 -top-20 right-0 opacity-15 pointer-events-none fixed" />

      <Container size="lg" className="relative z-10 w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 lg:grid-cols-12 rounded-3xl overflow-hidden shadow-2xl border border-indigo-500/30 dark:border-white/10"
        >
          {/* ── LEFT: Brand Panel ─────────────────────────────────── */}
          <div
            className="hidden lg:flex lg:col-span-5 relative p-8 lg:p-12 flex-col justify-between overflow-hidden min-h-[440px] lg:min-h-0"
            style={{
              backgroundImage: 'linear-gradient(to bottom, rgba(15,10,40,0.92), rgba(30,15,60,0.96)), url("/auth-bg.png")',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            <div className="orb orb-violet w-64 h-64 -top-16 -left-16 opacity-30 pointer-events-none" />

            {/* Logo */}
            <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} className="relative z-10">
              <Link to="/" className="inline-flex items-center gap-2.5 group">
                <motion.div
                  whileHover={{ scale: 1.08, rotate: 5 }}
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-lg"
                  style={{ background: 'linear-gradient(135deg, #1E1B4B, #4C1D95)' }}
                >
                  <ShieldCheck className="w-5 h-5 text-indigo-400 fill-current" />
                </motion.div>
                <span className="font-display font-extrabold text-2xl tracking-tight text-white">
                  Wadi<span className="text-indigo-400">Go</span>
                  <span className="text-xs ml-2 font-normal text-indigo-200/80">Admin Governance</span>
                </span>
              </Link>
            </motion.div>

            {/* Hero Copy */}
            <div className="relative z-10 space-y-6 my-auto py-6">
              <div className="space-y-3">
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-200 border border-indigo-400/30 inline-flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  Platform Governance Portal
                </span>
                <h2 className="font-display font-extrabold text-3xl sm:text-4xl leading-tight text-white">
                  Superuser <span className="text-indigo-400">Control Center</span>.
                </h2>
                <p className="text-indigo-100/80 text-sm leading-relaxed">
                  Authenticate to inspect platform GMV metrics, approve merchants, audit user accounts, and manage system governance.
                </p>
              </div>

              {/* Feature Pills */}
              <div className="space-y-2.5">
                <FeaturePill icon={ShieldCheck} label="Access Control" value="Strict Superuser Authentication" delay={0.25} />
                <FeaturePill icon={Users} label="User Governance" value="Account Status & Role Audits" delay={0.35} />
                <FeaturePill icon={Store} label="Merchant Approval" value="Verify & Suspend Business Portfolios" delay={0.45} />
                <FeaturePill icon={BarChart3} label="Platform Metrics" value="Real-time GMV & Order Audits" delay={0.55} />
              </div>
            </div>

            {/* Footer */}
            <div className="relative z-10 text-[11px] text-indigo-200/60">
              © {new Date().getFullYear()} WadiGo System Governance
            </div>
          </div>

          {/* ── RIGHT: Form Panel ─────────────────────────────────── */}
          <div className="lg:col-span-7 bg-slate-950 p-8 sm:p-12 flex flex-col justify-center text-white">
            <div className="max-w-md w-full mx-auto space-y-6">
              <div>
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-indigo-950 border border-indigo-800 text-indigo-400 mb-3">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h1 className="font-display font-extrabold text-3xl text-white tracking-tight">
                  Admin Sign In
                </h1>
                <p className="text-sm text-slate-400 mt-1">
                  Authenticate as a superuser to access platform governance controls.
                </p>
              </div>

              {errorMsg && (
                <div className="p-3.5 rounded-xl bg-red-950/60 border border-red-800 text-red-300 text-xs font-medium flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <form onSubmit={handleLoginSubmit} autoComplete="off" className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Admin Email</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input name="email" required type="email" autoComplete="off" placeholder="admin@wadigo.com"
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-800 bg-slate-900 text-xs text-white focus:outline-none focus:border-indigo-500" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Master Password</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input name="password" required type={showPassword ? 'text' : 'password'} autoComplete="current-password" placeholder="••••••••"
                      className="w-full pl-10 pr-10 py-3 rounded-xl border border-slate-800 bg-slate-900 text-xs text-white focus:outline-none focus:border-indigo-500" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <motion.div whileHover={{ scale: 1.015 }} whileTap={{ scale: 0.985 }}>
                  <button type="submit" disabled={isLoading}
                    className="w-full py-3.5 rounded-xl font-bold text-sm text-white shadow-lg flex items-center justify-center gap-2"
                    style={{ background: 'linear-gradient(135deg, #1E1B4B, #4C1D95)' }}>
                    {isLoading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <>Authenticate Superuser <ArrowRight className="w-4 h-4" /></>}
                  </button>
                </motion.div>
              </form>

              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-[10px] text-slate-400 text-center">
                🔒 Restricted access for platform operators & system administrators.
              </div>

              {/* Portal Links */}
              <AuthPortalLinks />
            </div>
          </div>
        </motion.div>
      </Container>
    </div>
  );
};
