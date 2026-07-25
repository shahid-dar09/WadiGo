import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Store, Mail, Lock, User, Phone, CheckCircle2, ArrowRight,
  AlertCircle, ShieldCheck, Sparkles, RefreshCw, Eye, EyeOff, Building
} from 'lucide-react';
import { Container } from '../../components/ui/Container';
import { useAuthStore } from '../../store/authStore';
import { useThemeStore } from '../../store/themeStore';

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

export const MerchantAuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [step, setStep] = useState<1 | 2>(1);
  const [userEmail, setUserEmail] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [otp, setOtp] = useState('');

  const { login, registerInit, verifyOtp, resendOtp, isLoading } = useAuthStore();
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
      await login({ email, password });
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
      <Container size="lg" className="relative z-10 w-full">
        <div className="max-w-md w-full mx-auto p-8 rounded-3xl bg-white dark:bg-brand-darkSurface border border-amber-200/70 dark:border-white/10 shadow-2xl space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white mx-auto shadow-lg"
              style={{ background: 'linear-gradient(135deg, #B45309, #F59E0B)' }}>
              <Store className="w-7 h-7" />
            </div>
            <h1 className="font-display font-extrabold text-2xl text-amber-900 dark:text-white">
              {isLogin ? 'Merchant Portal Sign In' : 'Partner with WadiGo'}
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {isLogin ? 'Access your store dashboard & inventory.' : 'Register your business to start receiving orders.'}
            </p>
          </div>

          {/* Toggle Login / Register */}
          <div className="flex rounded-2xl bg-amber-50 dark:bg-slate-900 p-1 border border-amber-100 dark:border-white/5">
            <button
              onClick={() => { setIsLogin(true); setErrorMsg(null); setStep(1); }}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                isLogin ? 'bg-amber-600 text-white shadow-md' : 'text-slate-600 dark:text-slate-300'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => { setIsLogin(false); setErrorMsg(null); setStep(1); }}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                !isLogin ? 'bg-amber-600 text-white shadow-md' : 'text-slate-600 dark:text-slate-300'
              }`}
            >
              Become a Merchant
            </button>
          </div>

          {errorMsg && (
            <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 text-red-700 dark:text-red-300 text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 text-emerald-700 dark:text-emerald-300 text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-500" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* LOGIN FORM */}
          {isLogin && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Merchant Email</label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                  <input name="email" required type="email" placeholder="merchant@business.com"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-amber-400" />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                  <input name="password" required type={showPassword ? 'text' : 'password'} placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-amber-400" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-3.5 text-slate-400">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button type="submit" disabled={isLoading}
                className="w-full py-3.5 rounded-2xl font-bold text-sm text-white shadow-lg flex items-center justify-center gap-2"
                style={{ background: 'linear-gradient(135deg, #B45309, #F59E0B)' }}>
                {isLoading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <>Sign In to Merchant Portal <ArrowRight className="w-4 h-4" /></>}
              </button>
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

              <button type="submit" disabled={isLoading}
                className="w-full py-3.5 rounded-2xl font-bold text-sm text-white shadow-lg flex items-center justify-center gap-2 mt-2"
                style={{ background: 'linear-gradient(135deg, #B45309, #F59E0B)' }}>
                {isLoading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <>Register Merchant Account <ArrowRight className="w-4 h-4" /></>}
              </button>
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
                className="w-full text-center font-mono font-bold text-2xl tracking-[0.5em] py-3 rounded-2xl border-2 border-amber-200 dark:border-slate-700 bg-amber-50/50 dark:bg-slate-800 text-slate-900 dark:text-white"
              />
              <button type="submit" disabled={isLoading || otp.length !== 6}
                className="w-full py-3.5 rounded-2xl font-bold text-sm text-white shadow-lg"
                style={{ background: 'linear-gradient(135deg, #B45309, #F59E0B)' }}>
                Verify & Open Merchant Account
              </button>
            </form>
          )}
        </div>
      </Container>
    </div>
  );
};
