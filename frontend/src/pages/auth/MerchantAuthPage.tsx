import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Store, Mail, Lock, User, Phone, CheckCircle2, ArrowRight,
  AlertCircle, ShieldCheck, Sparkles, RefreshCw, Eye, EyeOff,
  Building, Zap, Clock, TrendingUp, MapPin
} from 'lucide-react';
import { Container } from '../../components/ui/Container';
import { useAuthStore } from '../../store/authStore';
import { useThemeStore } from '../../store/themeStore';
import { AuthPortalLinks } from '../../components/auth/AuthPortalLinks';

const merchantSchema = z.object({
  businessName: z.string().min(2, 'Business name is required'),
  name: z.string().min(2, 'Contact person name is required'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(6, 'Phone number is required'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters long')
    .regex(/[A-Z]/, 'Must include at least 1 uppercase letter')
    .regex(/[0-9]/, 'Must include at least 1 number'),
});

type MerchantFormInput = z.infer<typeof merchantSchema>;

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
    <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-300">
      <Icon className="w-3.5 h-3.5" />
    </div>
    <div>
      <p className="text-[10px] text-amber-200/70 leading-none">{label}</p>
      <p className="text-xs font-bold text-white mt-0.5">{value}</p>
    </div>
  </motion.div>
);

export const MerchantAuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [step, setStep] = useState<1 | 2>(1);
  const [userEmail, setUserEmail] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [otp, setOtp] = useState('');

  const { login, registerInit, verifyOtp, isLoading } = useAuthStore();
  const { isDarkMode } = useThemeStore();
  const navigate = useNavigate();

  const registerForm = useForm<MerchantFormInput>({ resolver: zodResolver(merchantSchema) });

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    const form = e.target as HTMLFormElement;
    const email = (form.elements.namedItem('email') as HTMLInputElement).value;
    const password = (form.elements.namedItem('password') as HTMLInputElement).value;

    try {
      await login({ email, password, requiredRole: 'MERCHANT' });
      navigate('/merchant');
    } catch (err: any) {
      setErrorMsg(err.message || 'Merchant sign in failed');
    }
  };

  const onRegisterSubmit = async (data: MerchantFormInput) => {
    setErrorMsg(null);
    try {
      await registerInit({
        name: data.name,
        email: data.email,
        phone: data.phone,
        password: data.password,
        role: 'MERCHANT',
        businessName: data.businessName,
      });
      setUserEmail(data.email);
      setSuccessMsg(`Verification OTP sent to ${data.email}. Check your email.`);
      setStep(2);
    } catch (err: any) {
      setErrorMsg(err.message || 'Merchant registration failed');
    }
  };

  const onOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    try {
      await verifyOtp({ email: userEmail, otp, purpose: 'REGISTRATION' });
      navigate('/merchant');
    } catch (err: any) {
      setErrorMsg(err.message || 'Invalid or expired OTP code');
    }
  };

  return (
    <div className="min-h-screen page-bg flex items-center py-10">
      {/* Background Orbs */}
      <div className="orb orb-gold w-96 h-96 -top-32 -left-32 opacity-25 pointer-events-none fixed" />
      <div className="orb orb-violet w-80 h-80 -top-20 right-0 opacity-15 pointer-events-none fixed" />

      <Container size="lg" className="relative z-10 w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 lg:grid-cols-12 rounded-3xl overflow-hidden shadow-2xl border border-amber-200/60 dark:border-white/10"
        >
          {/* ── LEFT: Brand Panel (Desktop) ────────────────────────── */}
          <div
            className="hidden lg:flex lg:col-span-5 relative p-8 lg:p-12 flex-col justify-between overflow-hidden min-h-[440px] lg:min-h-0"
            style={{
              backgroundImage: isDarkMode
                ? 'linear-gradient(to bottom, rgba(30,15,5,0.88), rgba(60,25,5,0.94)), url("/auth-bg.png")'
                : 'linear-gradient(to bottom, rgba(120,53,15,0.85), rgba(180,83,9,0.92)), url("/auth-bg.png")',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            <div className="orb orb-gold w-64 h-64 -top-16 -left-16 opacity-30 pointer-events-none" />
            <div className="orb orb-rose w-48 h-48 bottom-0 right-0 opacity-20 pointer-events-none" />

            {/* Logo */}
            <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} className="relative z-10">
              <Link to="/" className="inline-flex items-center gap-2.5 group">
                <motion.div
                  whileHover={{ scale: 1.08, rotate: 5 }}
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-lg"
                  style={{ background: 'linear-gradient(135deg, #B45309, #F59E0B)' }}
                >
                  <Store className="w-5 h-5 fill-current" />
                </motion.div>
                <span className="font-display font-extrabold text-2xl tracking-tight text-white">
                  Wadi<span className="text-amber-400">Go</span>
                  <span className="text-xs ml-2 font-normal text-amber-200/80">Merchant</span>
                </span>
              </Link>
            </motion.div>

            {/* Hero Copy */}
            <div className="relative z-10 space-y-6 my-auto py-6">
              <div className="space-y-3">
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-200 border border-amber-400/30 inline-flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  Merchant Partner Network
                </span>
                <h2 className="font-display font-extrabold text-3xl sm:text-4xl leading-tight text-white">
                  Grow Your Store with <span className="text-amber-300">WadiGo</span>.
                </h2>
                <p className="text-amber-100/80 text-sm leading-relaxed">
                  List your products, sync live inventory, and receive automated sub-15 minute orders from neighborhood shoppers.
                </p>
              </div>

              {/* Feature Pills */}
              <div className="space-y-2.5">
                <FeaturePill icon={Store} label="Store Management" value="Instant Product & Price Control" delay={0.25} />
                <FeaturePill icon={Zap} label="Hyperlocal Orders" value="Direct Neighborhood Dispatch" delay={0.35} />
                <FeaturePill icon={TrendingUp} label="Zero Commission Tier" value="Expand to Thousands of Buyers" delay={0.45} />
                <FeaturePill icon={ShieldCheck} label="Payout Guarantee" value="Automated Daily Settlements" delay={0.55} />
              </div>
            </div>

            {/* Footer */}
            <div className="relative z-10 text-[11px] text-amber-200/60">
              © {new Date().getFullYear()} WadiGo Merchant Services
            </div>
          </div>

          {/* ── RIGHT: Form Panel ──────────────────────────────────── */}
          <div className="lg:col-span-7 bg-white dark:bg-brand-darkSurface p-8 sm:p-12 flex flex-col justify-center">
            <div className="max-w-md w-full mx-auto space-y-6">
              {/* Header */}
              <div>
                <h1 className="font-display font-extrabold text-3xl text-amber-900 dark:text-white tracking-tight">
                  {isLogin ? 'Merchant Portal Sign In' : 'Partner with WadiGo'}
                </h1>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                  {isLogin ? 'Sign in to access your store inventory & orders.' : 'Register your business to start receiving local orders.'}
                </p>
              </div>

              {/* Toggle Tabs */}
              <div className="flex rounded-2xl bg-amber-50 dark:bg-slate-900 p-1 border border-amber-100 dark:border-white/5">
                <button
                  onClick={() => { setIsLogin(true); setErrorMsg(null); setStep(1); }}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    isLogin ? 'bg-amber-600 text-white shadow-md' : 'text-slate-600 dark:text-slate-300'
                  }`}
                >
                  Sign In
                </button>
                <button
                  onClick={() => { setIsLogin(false); setErrorMsg(null); setStep(1); }}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    !isLogin ? 'bg-amber-600 text-white shadow-md' : 'text-slate-600 dark:text-slate-300'
                  }`}
                >
                  Register Store
                </button>
              </div>

              {/* Error/Success Banners */}
              <AnimatePresence>
                {errorMsg && (
                  <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
                    <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 text-red-700 dark:text-red-300 text-xs font-medium flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{errorMsg}</span>
                    </div>
                  </motion.div>
                )}
                {successMsg && (
                  <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
                    <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 text-emerald-700 dark:text-emerald-300 text-xs font-medium flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-500" />
                      <span>{successMsg}</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* LOGIN FORM */}
              {isLogin && (
                <form onSubmit={handleLoginSubmit} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Merchant Email</label>
                    <div className="relative">
                      <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input name="email" required type="email" placeholder="merchant@business.com"
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-amber-400" />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Password</label>
                    <div className="relative">
                      <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input name="password" required type={showPassword ? 'text' : 'password'} placeholder="••••••••"
                        className="w-full pl-10 pr-10 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-amber-400" />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <motion.div whileHover={{ scale: 1.015 }} whileTap={{ scale: 0.985 }}>
                    <button type="submit" disabled={isLoading}
                      className="w-full py-3.5 rounded-xl font-bold text-sm text-white shadow-lg flex items-center justify-center gap-2"
                      style={{ background: 'linear-gradient(135deg, #B45309, #F59E0B)' }}>
                      {isLoading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <>Sign In to Merchant Portal <ArrowRight className="w-4 h-4" /></>}
                    </button>
                  </motion.div>
                </form>
              )}

              {/* REGISTER FORM */}
              {!isLogin && step === 1 && (
                <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Business / Store Name</label>
                    <div className="relative">
                      <Building className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                      <input {...registerForm.register('businessName')} placeholder="Fresh Mart Organics"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-amber-400" />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Contact Person Name</label>
                    <div className="relative">
                      <User className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                      <input {...registerForm.register('name')} placeholder="Rajesh Kumar"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-amber-400" />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Business Email</label>
                    <div className="relative">
                      <Mail className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                      <input type="email" {...registerForm.register('email')} placeholder="store@example.com"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-amber-400" />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Contact Phone</label>
                    <div className="relative">
                      <Phone className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                      <input type="tel" {...registerForm.register('phone')} placeholder="+91 98765 43210"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-amber-400" />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Password</label>
                    <div className="relative">
                      <Lock className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                      <input type="password" {...registerForm.register('password')} placeholder="Min 8 chars, 1 uppercase, 1 number"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-amber-400" />
                    </div>
                  </div>

                  <motion.div whileHover={{ scale: 1.015 }} whileTap={{ scale: 0.985 }} className="pt-1">
                    <button type="submit" disabled={isLoading}
                      className="w-full py-3.5 rounded-xl font-bold text-sm text-white shadow-lg flex items-center justify-center gap-2"
                      style={{ background: 'linear-gradient(135deg, #B45309, #F59E0B)' }}>
                      {isLoading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <>Send Verification OTP <ArrowRight className="w-4 h-4" /></>}
                    </button>
                  </motion.div>
                </form>
              )}

              {/* OTP STEP */}
              {!isLogin && step === 2 && (
                <form onSubmit={onOtpSubmit} className="space-y-4 text-center">
                  <p className="text-xs text-slate-500">Enter the 6-digit verification code sent to <strong>{userEmail}</strong></p>
                  <input
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="000000"
                    className="w-full text-center font-mono font-bold text-2xl tracking-[0.5em] py-3.5 rounded-2xl border-2 border-amber-200 dark:border-slate-700 bg-amber-50/50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                  <button type="submit" disabled={isLoading || otp.length !== 6}
                    className="w-full py-3.5 rounded-xl font-bold text-sm text-white shadow-lg"
                    style={{ background: 'linear-gradient(135deg, #B45309, #F59E0B)' }}>
                    Verify & Open Merchant Account
                  </button>
                </form>
              )}

              {/* Trust Row */}
              <div className="flex items-center justify-center gap-5 pt-2 border-t border-slate-100 dark:border-white/5">
                <div className="flex items-center gap-1 text-[10px] text-slate-400"><ShieldCheck className="w-3.5 h-3.5 text-amber-500" /> Verified Merchant</div>
                <div className="flex items-center gap-1 text-[10px] text-slate-400"><Store className="w-3.5 h-3.5 text-amber-500" /> Store Dashboard</div>
                <div className="flex items-center gap-1 text-[10px] text-slate-400"><Zap className="w-3.5 h-3.5 text-amber-500" /> Auto Dispatch</div>
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
