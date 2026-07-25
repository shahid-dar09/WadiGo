import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Truck, Mail, Lock, User, Phone, CheckCircle2, ArrowRight,
  AlertCircle, ShieldCheck, Sparkles, Navigation, Clock, DollarSign
} from 'lucide-react';
import { Container } from '../../components/ui/Container';
import { useAuthStore } from '../../store/authStore';
import { useThemeStore } from '../../store/themeStore';

const deliverySchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Valid email is required'),
  phone: z.string().min(6, 'Phone is required'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

type DeliveryFormInput = z.infer<typeof deliverySchema>;

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
    <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-300">
      <Icon className="w-3.5 h-3.5" />
    </div>
    <div>
      <p className="text-[10px] text-emerald-200/70 leading-none">{label}</p>
      <p className="text-xs font-bold text-white mt-0.5">{value}</p>
    </div>
  </motion.div>
);

export const DeliveryAuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [step, setStep] = useState<1 | 2>(1);
  const [userEmail, setUserEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const { login, registerInit, verifyOtp, isLoading } = useAuthStore();
  const { isDarkMode } = useThemeStore();
  const navigate = useNavigate();
  const registerForm = useForm<DeliveryFormInput>({ resolver: zodResolver(deliverySchema) });

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    const form = e.target as HTMLFormElement;
    const email = (form.elements.namedItem('email') as HTMLInputElement).value;
    const password = (form.elements.namedItem('password') as HTMLInputElement).value;

    try {
      await login({ email, password, requiredRole: 'DELIVERY_PARTNER' });
      navigate('/delivery');
    } catch (err: any) {
      setErrorMsg(err.message || 'Delivery sign in failed');
    }
  };

  const onRegisterSubmit = async (data: DeliveryFormInput) => {
    setErrorMsg(null);
    try {
      await registerInit({
        name: data.name,
        email: data.email,
        phone: data.phone,
        password: data.password,
        role: 'DELIVERY_PARTNER',
      });
      setUserEmail(data.email);
      setStep(2);
    } catch (err: any) {
      setErrorMsg(err.message || 'Partner registration failed');
    }
  };

  const onOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    try {
      await verifyOtp({ email: userEmail, otp, purpose: 'REGISTRATION' });
      navigate('/delivery');
    } catch (err: any) {
      setErrorMsg(err.message || 'Invalid or expired OTP code');
    }
  };

  return (
    <div className="min-h-screen page-bg flex items-center py-10">
      <div className="orb orb-teal w-96 h-96 -top-32 -left-32 opacity-25 pointer-events-none fixed" />
      <div className="orb orb-rose w-80 h-80 -top-20 right-0 opacity-15 pointer-events-none fixed" />

      <Container size="lg" className="relative z-10 w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 lg:grid-cols-12 rounded-3xl overflow-hidden shadow-2xl border border-emerald-200/60 dark:border-white/10"
        >
          {/* ── LEFT: Brand Panel ─────────────────────────────────── */}
          <div
            className="hidden lg:flex lg:col-span-5 relative p-8 lg:p-12 flex-col justify-between overflow-hidden min-h-[440px] lg:min-h-0"
            style={{
              backgroundImage: isDarkMode
                ? 'linear-gradient(to bottom, rgba(5,30,20,0.88), rgba(5,45,25,0.94)), url("/auth-bg.png")'
                : 'linear-gradient(to bottom, rgba(4,120,87,0.85), rgba(5,150,105,0.92)), url("/auth-bg.png")',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            <div className="orb orb-teal w-64 h-64 -top-16 -left-16 opacity-30 pointer-events-none" />

            {/* Logo */}
            <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} className="relative z-10">
              <Link to="/" className="inline-flex items-center gap-2.5 group">
                <motion.div
                  whileHover={{ scale: 1.08, rotate: 5 }}
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-lg"
                  style={{ background: 'linear-gradient(135deg, #059669, #10B981)' }}
                >
                  <Truck className="w-5 h-5 fill-current" />
                </motion.div>
                <span className="font-display font-extrabold text-2xl tracking-tight text-white">
                  Wadi<span className="text-emerald-300">Go</span>
                  <span className="text-xs ml-2 font-normal text-emerald-200/80">Delivery Fleet</span>
                </span>
              </Link>
            </motion.div>

            {/* Hero Copy */}
            <div className="relative z-10 space-y-6 my-auto py-6">
              <div className="space-y-3">
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-200 border border-emerald-400/30 inline-flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  Hyperlocal Dispatch Network
                </span>
                <h2 className="font-display font-extrabold text-3xl sm:text-4xl leading-tight text-white">
                  Deliver & Earn with <span className="text-emerald-300">WadiGo</span>.
                </h2>
                <p className="text-emerald-100/80 text-sm leading-relaxed">
                  Join our delivery partner fleet, get live orders dispatched directly to your mobile, and earn competitive payouts.
                </p>
              </div>

              {/* Feature Pills */}
              <div className="space-y-2.5">
                <FeaturePill icon={Navigation} label="Dispatch Queue" value="Real-time Order Assignment" delay={0.25} />
                <FeaturePill icon={Clock} label="Sub-15 Min Delivery" value="Optimized Local Routes" delay={0.35} />
                <FeaturePill icon={DollarSign} label="Flexible Earnings" value="Instant Payouts & Bonuses" delay={0.45} />
                <FeaturePill icon={ShieldCheck} label="Fleet Support" value="Verified Partner Protection" delay={0.55} />
              </div>
            </div>

            {/* Footer */}
            <div className="relative z-10 text-[11px] text-emerald-200/60">
              © {new Date().getFullYear()} WadiGo Delivery Partner Fleet
            </div>
          </div>

          {/* ── RIGHT: Form Panel ─────────────────────────────────── */}
          <div className="lg:col-span-7 bg-white dark:bg-brand-darkSurface p-8 sm:p-12 flex flex-col justify-center">
            <div className="max-w-md w-full mx-auto space-y-6">
              <div>
                <h1 className="font-display font-extrabold text-3xl text-slate-900 dark:text-white tracking-tight">
                  {isLogin ? 'Delivery Partner Sign In' : 'Join WadiGo Delivery Fleet'}
                </h1>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                  {isLogin ? 'Access your active delivery queue.' : 'Register to become a verified delivery partner.'}
                </p>
              </div>

              {/* Toggle Tabs */}
              <div className="flex rounded-2xl bg-emerald-50 dark:bg-slate-900 p-1 border border-emerald-100 dark:border-white/5">
                <button
                  onClick={() => { setIsLogin(true); setErrorMsg(null); setStep(1); }}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    isLogin ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-600 dark:text-slate-300'
                  }`}
                >
                  Sign In
                </button>
                <button
                  onClick={() => { setIsLogin(false); setErrorMsg(null); setStep(1); }}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    !isLogin ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-600 dark:text-slate-300'
                  }`}
                >
                  Join Fleet
                </button>
              </div>

              {errorMsg && (
                <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 text-red-700 dark:text-red-300 text-xs font-medium flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* LOGIN FORM */}
              {isLogin && (
                <form onSubmit={handleLoginSubmit} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Email Address</label>
                    <div className="relative">
                      <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input name="email" required type="email" placeholder="partner@wadigo.com" className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500" />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Password</label>
                    <div className="relative">
                      <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input name="password" required type="password" placeholder="••••••••" className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500" />
                    </div>
                  </div>

                  <motion.div whileHover={{ scale: 1.015 }} whileTap={{ scale: 0.985 }}>
                    <button type="submit" disabled={isLoading} className="w-full py-3.5 rounded-xl font-bold text-sm text-white bg-emerald-600 hover:bg-emerald-700 shadow-lg flex items-center justify-center gap-2">
                      {isLoading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <>Sign In to Partner Portal <ArrowRight className="w-4 h-4" /></>}
                    </button>
                  </motion.div>
                </form>
              )}

              {/* REGISTER FORM */}
              {!isLogin && step === 1 && (
                <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Full Name</label>
                    <div className="relative">
                      <User className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                      <input {...registerForm.register('name')} placeholder="Aarav Sharma" className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500" />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Email Address</label>
                    <div className="relative">
                      <Mail className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                      <input type="email" {...registerForm.register('email')} placeholder="driver@example.com" className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500" />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Phone Number</label>
                    <div className="relative">
                      <Phone className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                      <input type="tel" {...registerForm.register('phone')} placeholder="+91 98765 43210" className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500" />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Password</label>
                    <div className="relative">
                      <Lock className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                      <input type="password" {...registerForm.register('password')} placeholder="Min 8 chars, 1 uppercase, 1 number" className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500" />
                    </div>
                  </div>

                  <motion.div whileHover={{ scale: 1.015 }} whileTap={{ scale: 0.985 }} className="pt-1">
                    <button type="submit" disabled={isLoading} className="w-full py-3.5 rounded-xl font-bold text-sm text-white bg-emerald-600 hover:bg-emerald-700 shadow-lg flex items-center justify-center gap-2">
                      {isLoading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <>Send Verification OTP <ArrowRight className="w-4 h-4" /></>}
                    </button>
                  </motion.div>
                </form>
              )}

              {/* OTP STEP */}
              {!isLogin && step === 2 && (
                <form onSubmit={onOtpSubmit} className="space-y-4 text-center">
                  <p className="text-xs text-slate-500">Enter verification code sent to <strong>{userEmail}</strong></p>
                  <input maxLength={6} value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="000000" className="w-full text-center font-mono font-bold text-2xl tracking-[0.5em] py-3.5 rounded-2xl border-2 border-emerald-200 dark:border-slate-700 bg-emerald-50/50 dark:bg-slate-800 text-slate-900 dark:text-white" />
                  <button type="submit" disabled={isLoading || otp.length !== 6} className="w-full py-3.5 rounded-xl font-bold text-sm text-white bg-emerald-600 hover:bg-emerald-700 shadow-lg">
                    Verify & Activate Partner Account
                  </button>
                </form>
              )}

              {/* Trust Row */}
              <div className="flex items-center justify-center gap-5 pt-2 border-t border-slate-100 dark:border-white/5">
                <div className="flex items-center gap-1 text-[10px] text-slate-400"><ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> Verified Partner</div>
                <div className="flex items-center gap-1 text-[10px] text-slate-400"><Navigation className="w-3.5 h-3.5 text-emerald-500" /> Live Queue</div>
                <div className="flex items-center gap-1 text-[10px] text-slate-400"><Clock className="w-3.5 h-3.5 text-emerald-500" /> Instant Payout</div>
              </div>
            </div>
          </div>
        </motion.div>
      </Container>
    </div>
  );
};
