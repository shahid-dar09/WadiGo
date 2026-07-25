import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Zap, Mail, Lock, User, Phone,
  CheckCircle2, ArrowRight, AlertCircle,
  RefreshCw, ShieldCheck, Sparkles,
  Store, Brain, MapPin, Eye, EyeOff,
} from 'lucide-react';
import { Container } from '../../components/ui/Container';
import { useAuthStore } from '../../store/authStore';
import { useThemeStore } from '../../store/themeStore';
import { AuthPortalLinks } from '../../components/auth/AuthPortalLinks';

/* ─── Schemas ──────────────────────────────────────────────────────────── */
const registerSchema = z.object({
  name:     z.string().min(2, 'Name must be at least 2 characters long'),
  email:    z.string().email('Please enter a valid email address'),
  phone:    z.string().optional(),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters long')
    .regex(/[A-Z]/, 'Must include at least 1 uppercase letter')
    .regex(/[0-9]/, 'Must include at least 1 number'),
});

const otpSchema = z.object({
  otp: z.string().length(6, 'OTP must be exactly 6 digits'),
});

type RegisterFormInput = z.infer<typeof registerSchema>;
type OtpFormInput      = z.infer<typeof otpSchema>;

/* ─── Styled Input ─────────────────────────────────────────────────────── */
const FieldInput: React.FC<{
  icon: React.ElementType;
  error?: boolean;
  rightSlot?: React.ReactNode;
  inputProps: React.InputHTMLAttributes<HTMLInputElement>;
}> = ({ icon: Icon, error, rightSlot, inputProps }) => (
  <div className="relative">
    <Icon className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none z-10" />
    <input
      {...inputProps}
      className={`input-glow w-full pl-10 ${rightSlot ? 'pr-11' : 'pr-4'} py-3 rounded-xl border text-sm bg-slate-50 dark:bg-white/5 text-brand-primary dark:text-white placeholder:text-slate-400 transition-all duration-200 ${
        error
          ? 'border-red-400 dark:border-red-600 bg-red-50 dark:bg-red-950/20'
          : 'border-indigo-100 dark:border-white/10'
      }`}
    />
    {rightSlot && (
      <div className="absolute right-3.5 top-1/2 -translate-y-1/2">{rightSlot}</div>
    )}
  </div>
);

/* ─── Field Error ──────────────────────────────────────────────────────── */
const FieldError: React.FC<{ message?: string }> = ({ message }) =>
  message ? (
    <p className="text-xs text-red-500 font-medium flex items-center gap-1 mt-1">
      <AlertCircle className="w-3 h-3 shrink-0" />
      {message}
    </p>
  ) : null;

/* ═══════════════════════════════════════════════════════════════════════ */
export const RegisterPage: React.FC = () => {
  const [step,            setStep]           = useState<1 | 2>(1);
  const [userEmail,       setUserEmail]      = useState<string>('');
  const [showPassword,    setShowPassword]   = useState(false);
  const [errorMessage,   setErrorMessage]   = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const { registerInit, verifyOtp, resendOtp, isLoading } = useAuthStore();
  const { isDarkMode } = useThemeStore();
  const navigate = useNavigate();

  const registerForm = useForm<RegisterFormInput>({ resolver: zodResolver(registerSchema) });
  const otpForm      = useForm<OtpFormInput>({ resolver: zodResolver(otpSchema) });

  /* handlers */
  const onRegisterSubmit = async (data: RegisterFormInput) => {
    setErrorMessage(null);
    try {
      await registerInit(data);
      setUserEmail(data.email);
      setSuccessMessage(`Verification OTP sent to ${data.email}. Check your inbox.`);
      setStep(2);
    } catch (err: any) {
      setErrorMessage(err.message || 'Registration failed. Please try again.');
    }
  };

  const onOtpSubmit = async (data: OtpFormInput) => {
    setErrorMessage(null);
    try {
      await verifyOtp({ email: userEmail, otp: data.otp, purpose: 'REGISTRATION' });
      navigate('/dashboard');
    } catch (err: any) {
      setErrorMessage(err.message || 'Invalid or expired OTP code.');
    }
  };

  const handleResendOtp = async () => {
    setErrorMessage(null);
    setSuccessMessage(null);
    try {
      await resendOtp(userEmail);
      setSuccessMessage(`A new verification code has been sent to ${userEmail}.`);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to resend OTP.');
    }
  };

  /* ───────────────────────────────────────────────────────────────────── */
  /* Left panel gradient adapts to theme */
  const panelBg = isDarkMode
    ? 'linear-gradient(145deg, #0A0A0F 0%, #16161F 40%, #1E1B4B 100%)'
    : 'linear-gradient(145deg, #1E1B4B 0%, #312E81 50%, #4C1D95 100%)';

  return (
    <div className="min-h-screen page-bg flex items-center py-10">

      {/* Background orbs */}
      <div className="orb orb-violet w-96 h-96 -top-32 -right-32 opacity-20 pointer-events-none fixed" />
      <div className="orb orb-gold   w-72 h-72 bottom-0 left-0   opacity-15 pointer-events-none fixed dark:hidden" />
      <div className="orb orb-rose   w-80 h-80 -top-20 left-1/4  opacity-0  pointer-events-none fixed dark:opacity-12" />
      <div className="orb orb-teal   w-64 h-64 bottom-10 right-10 opacity-0  pointer-events-none fixed dark:opacity-8" />

      <Container size="lg" className="relative z-10 w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 lg:grid-cols-12 rounded-3xl overflow-hidden shadow-2xl border border-indigo-100/60 dark:border-brand-rose/10"
        >

          {/* ── LEFT: Brand Panel (Desktop only) ────────────────────── */}
          <div
            className="hidden lg:flex lg:col-span-5 relative p-8 lg:p-12 flex-col justify-between overflow-hidden min-h-[400px] lg:min-h-0"
            style={{
              backgroundImage: isDarkMode
                ? 'linear-gradient(to bottom, rgba(10,10,15,0.85), rgba(15,10,30,0.92)), url("/auth-bg.png")'
                : 'linear-gradient(to bottom, rgba(15,10,40,0.80), rgba(40,20,80,0.88)), url("/auth-bg.png")',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            <div className="orb orb-rose   w-64 h-64 -top-16  -right-16  opacity-25 pointer-events-none" />
            <div className="orb orb-violet w-48 h-48  bottom-0  left-0    opacity-20 pointer-events-none" />
            <div className="orb orb-teal   w-32 h-32  top-1/2   right-8   opacity-10 pointer-events-none" />

            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative z-10"
            >
              <Link to="/" className="inline-flex items-center gap-2.5 group">
                <motion.div
                  whileHover={{ scale: 1.08, rotate: 5 }}
                  transition={{ type: 'spring', stiffness: 400 }}
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-glow-violet"
                  style={{ background: 'linear-gradient(135deg, #7C3AED, #F43F5E)' }}
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

            {/* Copy */}
            <div className="relative z-10 space-y-6 my-auto py-8">
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="space-y-4"
              >
                <span className="section-badge text-xs">
                  <Sparkles className="w-3 h-3" />
                  Join Next-Gen Commerce
                </span>

                <h2 className="font-display font-extrabold text-3xl sm:text-4xl leading-tight text-white">
                  The Smarter Way{' '}
                  <span
                    style={{
                      background: 'linear-gradient(135deg, #F43F5E 0%, #A855F7 50%, #38BDF8 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                    }}
                  >
                    to Shop Locally
                  </span>
                  .
                </h2>

                <p className="text-slate-400 text-sm leading-relaxed">
                  Create your free account and instantly access AI-powered product search,
                  live merchant routing, and sub-15 minute delivery across your city.
                </p>
              </motion.div>

              {/* Feature blocks */}
              <div className="space-y-2.5">
                {[
                  { icon: Store,      title: 'Product-First Aggregation',   desc: 'Search products directly — no store browsing.',           color: 'text-brand-violet', bg: 'bg-brand-violet/10' },
                  { icon: ShieldCheck,title: 'Verified 2-Step Email OTP',   desc: '6-digit code secures your account from the start.',       color: 'text-brand-rose',   bg: 'bg-brand-rose/10'   },
                  { icon: Brain,       title: 'AI Smart Merchant Matching', desc: 'Best price, nearest location, fastest delivery—automatically.', color: 'text-brand-teal', bg: 'bg-brand-teal/10'   },
                  { icon: MapPin,      title: 'Hyperlocal Engine',          desc: 'Every order is optimized for your exact location.',        color: 'text-emerald-400',  bg: 'bg-emerald-900/20'  },
                ].map(({ icon: Icon, title, desc, color, bg }, i) => (
                  <motion.div
                    key={title}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + i * 0.1 }}
                    className="flex items-start gap-2.5 p-3 rounded-xl bg-white/4 border border-white/8 backdrop-blur-sm"
                  >
                    <div className={`p-1.5 rounded-lg ${bg} ${color} shrink-0 mt-0.5`}>
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white">{title}</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">{desc}</p>
                    </div>
                  </motion.div>
                ))}
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
            <div className="max-w-md w-full mx-auto space-y-6">

              {/* Mobile-Only Header Logo */}
              <div className="lg:hidden flex items-center justify-center mb-2">
                <Link to="/" className="inline-flex items-center gap-2.5">
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center text-white shadow-glow-violet"
                    style={{ background: 'linear-gradient(135deg, #7C3AED, #F43F5E)' }}
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

              {/* Step header */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="flex items-start justify-between"
              >
                <div>
                  <h1 className="font-display font-extrabold text-3xl text-brand-primary dark:text-white tracking-tight">
                    {step === 1 ? 'Create Account' : 'Verify Email'}
                  </h1>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                    {step === 1
                      ? 'Fill in your details to get started on WadiGo.'
                      : `Enter the 6-digit code sent to ${userEmail}`}
                  </p>
                </div>

                {/* Step indicator */}
                <div className="shrink-0 flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border"
                  style={{
                    background: 'rgba(124,58,237,0.08)',
                    borderColor: 'rgba(124,58,237,0.2)',
                    color: '#7C3AED',
                  }}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-secondary dark:bg-brand-violet" />
                  Step {step}/2
                </div>
              </motion.div>

              {/* Progress bar */}
              <div className="w-full h-1 rounded-full bg-indigo-50 dark:bg-white/5 overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: 'linear-gradient(90deg, #7C3AED, #A855F7)' }}
                  initial={{ width: '50%' }}
                  animate={{ width: step === 1 ? '50%' : '100%' }}
                  transition={{ duration: 0.4, ease: 'easeInOut' }}
                />
              </div>

              {/* Banners */}
              <AnimatePresence>
                {errorMessage && (
                  <motion.div
                    key="err"
                    initial={{ opacity: 0, y: -8, height: 0 }}
                    animate={{ opacity: 1, y: 0,  height: 'auto' }}
                    exit={{   opacity: 0, y: -8, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/40 flex items-start gap-2.5 text-red-700 dark:text-red-300 text-xs font-medium">
                      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                      <span>{errorMessage}</span>
                    </div>
                  </motion.div>
                )}
                {successMessage && (
                  <motion.div
                    key="suc"
                    initial={{ opacity: 0, y: -8, height: 0 }}
                    animate={{ opacity: 1, y: 0,  height: 'auto' }}
                    exit={{   opacity: 0, y: -8, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/40 flex items-start gap-2.5 text-emerald-700 dark:text-emerald-300 text-xs font-medium">
                      <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-500" />
                      <span>{successMessage}</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* ── STEP FORMS ── */}
              <AnimatePresence mode="wait">

                {/* Step 1 — Register details */}
                {step === 1 && (
                  <motion.form
                    key="step1"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.25 }}
                    onSubmit={registerForm.handleSubmit(onRegisterSubmit)}
                    className="space-y-4"
                  >
                    {/* Full Name */}
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Full Name</label>
                      <FieldInput
                        icon={User}
                        error={!!registerForm.formState.errors.name}
                        inputProps={{
                          type: 'text',
                          placeholder: 'John Doe',
                          ...registerForm.register('name'),
                        }}
                      />
                      <FieldError message={registerForm.formState.errors.name?.message} />
                    </div>

                    {/* Email */}
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Email Address</label>
                      <FieldInput
                        icon={Mail}
                        error={!!registerForm.formState.errors.email}
                        inputProps={{
                          type: 'email',
                          placeholder: 'name@example.com',
                          ...registerForm.register('email'),
                        }}
                      />
                      <FieldError message={registerForm.formState.errors.email?.message} />
                    </div>

                    {/* Phone */}
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                        Phone Number <span className="text-slate-400 font-normal">(Optional)</span>
                      </label>
                      <FieldInput
                        icon={Phone}
                        inputProps={{
                          type: 'tel',
                          placeholder: '+91 9876543210',
                          ...registerForm.register('phone'),
                        }}
                      />
                    </div>

                    {/* Password */}
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Password</label>
                      <FieldInput
                        icon={Lock}
                        error={!!registerForm.formState.errors.password}
                        rightSlot={
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="text-slate-400 hover:text-brand-secondary dark:hover:text-brand-rose transition-colors"
                          >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        }
                        inputProps={{
                          type: showPassword ? 'text' : 'password',
                          placeholder: 'Min 8 chars, 1 uppercase, 1 number',
                          ...registerForm.register('password'),
                        }}
                      />
                      <FieldError message={registerForm.formState.errors.password?.message} />
                    </div>

                    {/* Submit */}
                    <motion.div whileHover={{ scale: 1.015 }} whileTap={{ scale: 0.985 }} className="pt-1">
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
                            Send Verification OTP
                            <ArrowRight className="w-4 h-4" />
                          </>
                        )}
                      </button>
                    </motion.div>
                  </motion.form>
                )}

                {/* Step 2 — OTP Verification */}
                {step === 2 && (
                  <motion.form
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.25 }}
                    onSubmit={otpForm.handleSubmit(onOtpSubmit)}
                    className="space-y-5"
                  >
                    <div className="space-y-2 text-center">
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">
                        Enter 6-Digit Verification Code
                      </label>
                      <p className="text-[11px] text-slate-400">
                        Sent to <span className="font-semibold text-brand-secondary dark:text-brand-rose">{userEmail}</span>
                      </p>

                      <div className="relative max-w-xs mx-auto mt-3">
                        <ShieldCheck className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                        <input
                          type="text"
                          maxLength={6}
                          placeholder="000000"
                          {...otpForm.register('otp')}
                          className="input-glow w-full text-center tracking-[0.6em] font-mono font-bold text-2xl py-4 rounded-2xl border-2 border-indigo-200 dark:border-white/10 bg-indigo-50/50 dark:bg-white/5 text-brand-primary dark:text-white focus:border-brand-secondary dark:focus:border-brand-rose transition-all duration-200"
                        />
                      </div>
                      <FieldError message={otpForm.formState.errors.otp?.message} />
                    </div>

                    <motion.div whileHover={{ scale: 1.015 }} whileTap={{ scale: 0.985 }}>
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full flex items-center justify-center gap-2.5 py-3.5 rounded-xl font-bold text-white text-sm transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed hover:shadow-glow-rose active:scale-[0.98]"
                        style={{ background: 'linear-gradient(135deg, #F43F5E, #8B5CF6, #A855F7)' }}
                      >
                        {isLoading ? (
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                          <>
                            Verify & Activate Account
                            <CheckCircle2 className="w-4 h-4" />
                          </>
                        )}
                      </button>
                    </motion.div>

                    <div className="flex items-center justify-between text-xs pt-1">
                      <button
                        type="button"
                        onClick={() => { setStep(1); setErrorMessage(null); setSuccessMessage(null); }}
                        className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 font-medium transition-colors"
                      >
                        ← Back to details
                      </button>
                      <button
                        type="button"
                        onClick={handleResendOtp}
                        disabled={isLoading}
                        className="text-brand-secondary dark:text-brand-rose font-bold hover:underline underline-offset-2 flex items-center gap-1 transition-colors"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        Resend OTP
                      </button>
                    </div>
                  </motion.form>
                )}
              </AnimatePresence>

              {/* Divider */}
              <div className="divider-gradient" />

              {/* Sign in link */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-xs text-center text-slate-500 dark:text-slate-400"
              >
                Already have an account?{' '}
                <Link
                  to="/auth/login"
                  className="font-bold text-brand-secondary dark:text-brand-rose hover:underline underline-offset-2 ml-0.5 transition-colors"
                >
                  Sign In →
                </Link>
              </motion.p>

              {/* Portal Links */}
              <AuthPortalLinks />
            </div>
          </div>

        </motion.div>
      </Container>
    </div>
  );
};
