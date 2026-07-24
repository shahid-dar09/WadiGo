import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Zap, Mail, Lock, Eye, EyeOff, ArrowRight,
  AlertCircle, ShieldCheck, Clock, Sparkles,
  TrendingUp, Store, CheckCircle2, Brain, MapPin,
} from 'lucide-react';
import { Container } from '../../components/ui/Container';
import { Button } from '../../components/ui/Button';
import { useAuthStore } from '../../store/authStore';
import { useThemeStore } from '../../store/themeStore';

/* ─── Schema ───────────────────────────────────────────────────────────── */
const loginSchema = z.object({
  email:    z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});
type LoginFormInput = z.infer<typeof loginSchema>;

/* ─── Floating Feature Pill ────────────────────────────────────────────── */
const FeaturePill: React.FC<{
  icon: React.ElementType;
  label: string;
  value: string;
  delay?: number;
  colorClass?: string;
}> = ({ icon: Icon, label, value, delay = 0, colorClass = 'text-brand-teal' }) => (
  <motion.div
    initial={{ opacity: 0, x: -16 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay, duration: 0.5, ease: 'easeOut' }}
    className="flex items-center gap-2.5 p-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm"
  >
    <div className={`p-1.5 rounded-lg bg-white/8 ${colorClass}`}>
      <Icon className="w-3.5 h-3.5" />
    </div>
    <div>
      <p className="text-[10px] text-slate-400 leading-none">{label}</p>
      <p className="text-xs font-bold text-white mt-0.5">{value}</p>
    </div>
  </motion.div>
);

/* ═══════════════════════════════════════════════════════════════════════ */
export const LoginPage: React.FC = () => {
  const [showPassword, setShowPassword]   = useState(false);
  const [errorMessage, setErrorMessage]   = useState<string | null>(null);
  const { login, isLoading }              = useAuthStore();
  const { isDarkMode }                    = useThemeStore();
  const navigate                          = useNavigate();

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormInput>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormInput) => {
    setErrorMessage(null);
    try {
      await login(data);
      navigate('/');
    } catch (err: any) {
      setErrorMessage(err.message || 'Login failed. Please check your credentials.');
    }
  };

  /* Left panel gradient adapts to theme */
  const panelBg = isDarkMode
    ? 'linear-gradient(145deg, #0A0A0F 0%, #16161F 40%, #1E1B4B 100%)'
    : 'linear-gradient(145deg, #1E1B4B 0%, #312E81 50%, #4C1D95 100%)';

  return (
    <div className="min-h-screen page-bg flex items-center py-10">

      {/* Background orbs */}
      <div className="orb orb-violet w-96 h-96 -top-32 -left-32 opacity-20 pointer-events-none fixed" />
      <div className="orb orb-gold   w-72 h-72 bottom-0 right-0  opacity-15 pointer-events-none fixed dark:hidden" />
      <div className="orb orb-rose   w-80 h-80 -top-20 right-0   opacity-0  pointer-events-none fixed dark:opacity-12" />
      <div className="orb orb-teal   w-64 h-64 bottom-10 left-1/4 opacity-0 pointer-events-none fixed dark:opacity-8" />

      <Container size="lg" className="relative z-10 w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 lg:grid-cols-12 rounded-3xl overflow-hidden shadow-2xl border border-indigo-100/60 dark:border-brand-rose/10"
        >

          {/* ── LEFT: Brand Panel (Desktop only) ────────────────────── */}
          <div
            className="hidden lg:flex lg:col-span-5 relative p-8 lg:p-12 flex-col justify-between overflow-hidden min-h-[420px] lg:min-h-0"
            style={{
              backgroundImage: isDarkMode
                ? 'linear-gradient(to bottom, rgba(10,10,15,0.85), rgba(15,10,30,0.92)), url("/auth-bg.png")'
                : 'linear-gradient(to bottom, rgba(15,10,40,0.80), rgba(40,20,80,0.88)), url("/auth-bg.png")',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            {/* Panel orbs */}
            <div className="orb orb-violet w-64 h-64 -top-16  -left-16  opacity-30 pointer-events-none" />
            <div className="orb orb-rose   w-48 h-48  bottom-0  right-0   opacity-20 pointer-events-none" />
            <div className="orb orb-teal   w-32 h-32  top-1/2   right-8   opacity-15 pointer-events-none" />

            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="relative z-10"
            >
              <Link to="/" className="inline-flex items-center gap-2.5 group">
                <motion.div
                  whileHover={{ scale: 1.08, rotate: 5 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-glow-rose"
                  style={{ background: 'linear-gradient(135deg, #F43F5E, #8B5CF6)' }}
                >
                  <Zap className="w-5 h-5 fill-current" />
                </motion.div>
                <span className="font-display font-extrabold text-2xl tracking-tight text-white">
                  Wadi
                  <span style={{
                    background: 'linear-gradient(135deg, #FB7185, #A78BFA)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}>
                    Go
                  </span>
                </span>
              </Link>
            </motion.div>

            {/* Hero copy */}
            <div className="relative z-10 space-y-6 my-auto py-8">
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, duration: 0.5 }}
                className="space-y-4"
              >
                <span className="section-badge text-xs">
                  <Sparkles className="w-3 h-3" />
                  Product-First Hyperlocal Engine
                </span>

                <h2 className="font-display font-extrabold text-3xl sm:text-4xl leading-tight text-white">
                  Shop by{' '}
                  <span
                    style={{
                      background: 'linear-gradient(135deg, #F43F5E 0%, #A855F7 50%, #38BDF8 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                    }}
                  >
                    Product
                  </span>
                  , Not Store.
                </h2>

                <p className="text-slate-400 text-sm leading-relaxed">
                  Sign in to access AI-powered smart routing, live merchant pricing,
                  and sub-15 minute hyperlocal delivery.
                </p>
              </motion.div>

              {/* Feature pills */}
              <div className="space-y-2.5">
                <FeaturePill
                  icon={Clock}
                  label="Delivery Time"
                  value="Under 15 Minutes"
                  delay={0.25}
                  colorClass="text-brand-rose"
                />
                <FeaturePill
                  icon={Brain}
                  label="AI Routing"
                  value="Smart Merchant Selection"
                  delay={0.35}
                  colorClass="text-brand-violet"
                />
                <FeaturePill
                  icon={TrendingUp}
                  label="Pricing Engine"
                  value="₹ Real-Time Best Price"
                  delay={0.45}
                  colorClass="text-brand-teal"
                />
                <FeaturePill
                  icon={ShieldCheck}
                  label="Stock Guarantee"
                  value="100% Live Inventory"
                  delay={0.55}
                  colorClass="text-emerald-400"
                />
              </div>
            </div>

            {/* Footer */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="relative z-10 text-[11px] text-slate-600"
            >
              © {new Date().getFullYear()} WadiGo · AI Hyperlocal Commerce
            </motion.div>
          </div>

          {/* ── RIGHT: Form Panel ──────────────────────────────────────── */}
          <div className="lg:col-span-7 bg-white dark:bg-brand-darkSurface p-8 sm:p-12 flex flex-col justify-center">
            <div className="max-w-md w-full mx-auto space-y-7">

              {/* Mobile-Only Header Logo */}
              <div className="lg:hidden flex items-center justify-center mb-2">
                <Link to="/" className="inline-flex items-center gap-2.5">
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center text-white shadow-glow-rose"
                    style={{ background: 'linear-gradient(135deg, #F43F5E, #8B5CF6)' }}
                  >
                    <Zap className="w-5 h-5 fill-current" />
                  </div>
                  <span className="font-display font-extrabold text-2xl tracking-tight text-brand-primary dark:text-white">
                    Wadi
                    <span style={{
                      background: 'linear-gradient(135deg, #FB7185, #A78BFA)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                    }}>
                      Go
                    </span>
                  </span>
                </Link>
              </div>

              {/* Header */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="space-y-1"
              >
                <h1 className="font-display font-extrabold text-3xl text-brand-primary dark:text-white tracking-tight">
                  Welcome back
                </h1>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Sign in to your WadiGo account and start shopping smarter.
                </p>
              </motion.div>

              {/* Error banner */}
              <AnimatePresence>
                {errorMessage && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, height: 0 }}
                    animate={{ opacity: 1, y: 0,  height: 'auto' }}
                    exit={{ opacity: 0, y: -8, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/40 flex items-start gap-2.5 text-red-700 dark:text-red-300 text-xs font-medium">
                      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                      <span>{errorMessage}</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Form */}
              <motion.form
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-5"
              >
                {/* Email */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    <input
                      type="email"
                      placeholder="name@example.com"
                      {...register('email')}
                      className={`input-glow w-full pl-10 pr-4 py-3 rounded-xl border text-sm bg-slate-50 dark:bg-white/5 text-brand-primary dark:text-white placeholder:text-slate-400 transition-all duration-200 ${
                        errors.email
                          ? 'border-red-400 dark:border-red-600 bg-red-50 dark:bg-red-950/20'
                          : 'border-indigo-100 dark:border-white/10'
                      }`}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-xs text-red-500 font-medium flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.email.message}
                    </p>
                  )}
                </div>

                {/* Password */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Password
                    </label>
                    <a
                      href="#"
                      className="text-xs font-medium text-brand-secondary dark:text-brand-rose hover:underline underline-offset-2 transition-colors"
                    >
                      Forgot password?
                    </a>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      {...register('password')}
                      className={`input-glow w-full pl-10 pr-11 py-3 rounded-xl border text-sm bg-slate-50 dark:bg-white/5 text-brand-primary dark:text-white placeholder:text-slate-400 transition-all duration-200 ${
                        errors.password
                          ? 'border-red-400 dark:border-red-600 bg-red-50 dark:bg-red-950/20'
                          : 'border-indigo-100 dark:border-white/10'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-brand-secondary dark:hover:text-brand-rose transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-xs text-red-500 font-medium flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.password.message}
                    </p>
                  )}
                </div>

                {/* Submit */}
                <motion.div whileHover={{ scale: 1.015 }} whileTap={{ scale: 0.985 }}>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full flex items-center justify-center gap-2.5 py-3.5 rounded-xl font-bold text-white text-sm transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed hover:shadow-glow-violet active:scale-[0.98]"
                    style={{ background: 'linear-gradient(135deg, #4C1D95, #7C3AED, #A855F7)' }}
                  >
                    {isLoading ? (
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        Sign In to WadiGo
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </motion.div>
              </motion.form>

              {/* Divider */}
              <div className="divider-gradient" />

              {/* Sign up link */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-xs text-center text-slate-500 dark:text-slate-400"
              >
                New to WadiGo?{' '}
                <Link
                  to="/auth/register"
                  className="font-bold text-brand-secondary dark:text-brand-rose hover:underline underline-offset-2 ml-0.5 transition-colors"
                >
                  Create a Free Account →
                </Link>
              </motion.p>

              {/* Trust row */}
              <div className="flex items-center justify-center gap-5 pt-2">
                {[
                  { icon: ShieldCheck, label: 'Secure Login',     color: 'text-emerald-500' },
                  { icon: Store,       label: 'Verified Merchants', color: 'text-brand-secondary dark:text-brand-violet' },
                  { icon: MapPin,      label: 'Hyperlocal',        color: 'text-brand-accent dark:text-brand-rose' },
                ].map(({ icon: Icon, label, color }) => (
                  <div key={label} className="flex items-center gap-1 text-[10px] text-slate-400">
                    <Icon className={`w-3.5 h-3.5 ${color}`} />
                    {label}
                  </div>
                ))}
              </div>
            </div>
          </div>

        </motion.div>
      </Container>
    </div>
  );
};
