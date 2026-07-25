import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Truck, Mail, Lock, User, Phone, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Container } from '../../components/ui/Container';
import { useAuthStore } from '../../store/authStore';

const deliverySchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Valid email is required'),
  phone: z.string().min(6, 'Phone is required'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

type DeliveryFormInput = z.infer<typeof deliverySchema>;

export const DeliveryAuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [step, setStep] = useState<1 | 2>(1);
  const [userEmail, setUserEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const { login, registerInit, verifyOtp, isLoading } = useAuthStore();
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
      <Container size="lg" className="relative z-10 w-full">
        <div className="max-w-md w-full mx-auto p-8 rounded-3xl bg-white dark:bg-brand-darkSurface border border-emerald-200/70 dark:border-white/10 shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-lg">
              <Truck className="w-7 h-7" />
            </div>
            <h1 className="font-display font-extrabold text-2xl text-slate-900 dark:text-white">
              {isLogin ? 'Delivery Partner Sign In' : 'Join WadiGo Delivery Fleet'}
            </h1>
            <p className="text-xs text-slate-500">
              {isLogin ? 'Access your active delivery dispatch queue.' : 'Register to become a verified delivery partner.'}
            </p>
          </div>

          <div className="flex rounded-2xl bg-emerald-50 dark:bg-slate-900 p-1">
            <button onClick={() => { setIsLogin(true); setErrorMsg(null); }} className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${isLogin ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-600'}`}>
              Sign In
            </button>
            <button onClick={() => { setIsLogin(false); setErrorMsg(null); }} className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${!isLogin ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-600'}`}>
              Join Fleet
            </button>
          </div>

          {errorMsg && (
            <div className="p-3 rounded-xl bg-red-50 text-red-700 text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />{errorMsg}
            </div>
          )}

          {isLogin ? (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                  <input name="email" required type="email" placeholder="partner@wadigo.com" className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none" />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                  <input name="password" required type="password" placeholder="••••••••" className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none" />
                </div>
              </div>
              <button type="submit" disabled={isLoading} className="w-full py-3.5 rounded-2xl font-bold text-sm text-white bg-emerald-600 hover:bg-emerald-700 shadow-lg flex items-center justify-center gap-2">
                Sign In to Partner Portal <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          ) : step === 1 ? (
            <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Full Name</label>
                <input {...registerForm.register('name')} placeholder="Aarav Sharma" className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Email Address</label>
                <input type="email" {...registerForm.register('email')} placeholder="driver@example.com" className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Phone Number</label>
                <input type="tel" {...registerForm.register('phone')} placeholder="+91 98765 43210" className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Password</label>
                <input type="password" {...registerForm.register('password')} placeholder="Min 8 chars, 1 uppercase, 1 number" className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white" />
              </div>
              <button type="submit" disabled={isLoading} className="w-full py-3.5 rounded-2xl font-bold text-sm text-white bg-emerald-600 hover:bg-emerald-700 shadow-lg">
                Register as Delivery Partner
              </button>
            </form>
          ) : (
            <form onSubmit={onOtpSubmit} className="space-y-4 text-center">
              <p className="text-xs text-slate-500">Enter verification code sent to <strong>{userEmail}</strong></p>
              <input maxLength={6} value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="000000" className="w-full text-center font-mono font-bold text-2xl tracking-[0.5em] py-3 rounded-2xl border-2 border-emerald-200 bg-emerald-50/50" />
              <button type="submit" disabled={isLoading || otp.length !== 6} className="w-full py-3.5 rounded-2xl font-bold text-sm text-white bg-emerald-600">
                Verify & Activate Account
              </button>
            </form>
          )}
        </div>
      </Container>
    </div>
  );
};
