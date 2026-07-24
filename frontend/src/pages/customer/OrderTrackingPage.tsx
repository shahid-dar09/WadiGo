import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Package, Clock, MapPin, Store, CheckCircle2, ArrowLeft,
  Truck, ShieldCheck, Zap, Phone, User, Sparkles
} from 'lucide-react';
import { Container } from '../../components/ui/Container';
import { Button } from '../../components/ui/Button';

export const OrderTrackingPage: React.FC = () => {
  const { orderId } = useParams();

  const STEPS = [
    { label: 'Order Placed', time: '1:30 PM', done: true },
    { label: 'Merchant Accepted', time: '1:31 PM', done: true },
    { label: 'Packed & Verified', time: '1:33 PM', done: true },
    { label: 'Out for Delivery', time: '1:35 PM', done: true, active: true },
    { label: 'Delivered', time: 'Est. 1:42 PM', done: false },
  ];

  return (
    <div className="min-h-screen page-bg py-8">
      <Container size="lg" className="space-y-7">

        {/* ── BACK BUTTON & HEADER ────────────────────────────────────── */}
        <div className="space-y-2">
          <Link to="/orders" className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-brand-secondary dark:hover:text-brand-rose transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Orders
          </Link>

          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="section-badge text-xs mb-1">
                <Zap className="w-3.5 h-3.5 text-brand-rose" />
                Live Sub-15 Min Order Dispatch
              </span>
              <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-brand-primary dark:text-white">
                Tracking Order #{orderId || 'WG-9402'}
              </h1>
            </div>

            {/* Countdown Badge */}
            <div className="p-3.5 rounded-2xl bg-emerald-500 text-white shadow-lg flex items-center gap-3">
              <Clock className="w-6 h-6 animate-pulse" />
              <div>
                <p className="text-[10px] uppercase font-bold tracking-wider opacity-90">Estimated Arrival</p>
                <p className="text-xl font-extrabold leading-none">8 Mins Remaining</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-7">

          {/* ── LEFT: LIVE TRACKING TIMELINE & MAP SIMULATOR ───────────── */}
          <div className="lg:col-span-8 space-y-7">

            {/* Simulated Live Map */}
            <div className="relative h-64 sm:h-80 rounded-3xl overflow-hidden shadow-2xl border border-indigo-100/70 dark:border-white/10 bg-slate-900 flex items-center justify-center">
              {/* Map background grid pattern */}
              <div
                className="absolute inset-0 opacity-20"
                style={{
                  backgroundImage: 'radial-gradient(#7C3AED 1px, transparent 1px)',
                  backgroundSize: '24px 24px',
                }}
              />

              {/* Pulsing route line */}
              <div className="relative z-10 text-center space-y-3 p-6">
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-16 h-16 rounded-full mx-auto bg-emerald-500/20 border-2 border-emerald-400 text-emerald-400 flex items-center justify-center shadow-glow-rose"
                >
                  <Truck className="w-8 h-8" />
                </motion.div>
                <div>
                  <p className="font-extrabold text-white text-lg">Driver Ramesh is 0.4 km away</p>
                  <p className="text-xs text-slate-400">Heading to 12th Main, Indiranagar</p>
                </div>
              </div>
            </div>

            {/* Live Progress Stepper */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-brand-darkSurface border border-indigo-100/70 dark:border-white/10 shadow-xl space-y-6">
              <h3 className="font-display font-extrabold text-lg text-brand-primary dark:text-white">
                Fulfillment Timeline
              </h3>

              <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-white/10">
                {STEPS.map((s, i) => (
                  <div key={s.label} className="relative flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={`absolute -left-6 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                          s.active
                            ? 'bg-emerald-500 text-white ring-4 ring-emerald-500/20'
                            : s.done
                            ? 'bg-brand-secondary dark:bg-brand-violet text-white'
                            : 'bg-slate-200 dark:bg-slate-700 text-slate-500'
                        }`}
                      >
                        {s.done ? '✓' : i + 1}
                      </div>
                      <span className={`text-sm font-bold ${s.active ? 'text-emerald-500' : s.done ? 'text-brand-primary dark:text-white' : 'text-slate-400'}`}>
                        {s.label}
                      </span>
                    </div>

                    <span className="text-xs text-slate-400 font-medium">{s.time}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* ── RIGHT: DRIVER DETAILS & RECEIPT SUMMARY ───────────────── */}
          <div className="lg:col-span-4 space-y-6">

            {/* Driver Card */}
            <div className="p-6 rounded-3xl bg-white dark:bg-brand-darkSurface border border-indigo-100/70 dark:border-white/10 shadow-xl space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-indigo-500 text-white flex items-center justify-center font-bold text-lg shadow-md">
                  RK
                </div>
                <div>
                  <h4 className="font-bold text-sm text-brand-primary dark:text-white">Ramesh Kumar</h4>
                  <p className="text-xs text-slate-400">Hyperlocal Delivery Partner</p>
                  <p className="text-[11px] text-emerald-500 font-semibold mt-0.5">★ 4.9 Rating (140+ orders)</p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/4 border border-slate-200 dark:border-white/8 text-xs space-y-1">
                <p className="text-slate-500 dark:text-slate-400">Vehicle: <strong className="text-slate-800 dark:text-slate-200">EV Scooter (KA-01-EV-4920)</strong></p>
                <p className="text-slate-500 dark:text-slate-400">Fulfilling Store: <strong className="text-brand-secondary dark:text-brand-rose">Fresh Mart (MG Road)</strong></p>
              </div>

              <button className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-xs bg-slate-100 dark:bg-white/10 text-brand-primary dark:text-white hover:bg-indigo-50 transition-colors">
                <Phone className="w-4 h-4 text-brand-secondary" /> Call Delivery Partner
              </button>
            </div>

            {/* Itemized Invoice Summary */}
            <div className="p-6 rounded-3xl bg-white dark:bg-brand-darkSurface border border-indigo-100/70 dark:border-white/10 shadow-xl space-y-4">
              <h4 className="font-display font-extrabold text-base text-brand-primary dark:text-white border-b border-indigo-50 dark:border-white/5 pb-3">
                Itemized Receipt
              </h4>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-slate-700 dark:text-slate-300">
                  <span>Organic Whole Milk 1L (x2)</span>
                  <span className="font-bold">₹130</span>
                </div>
                <div className="flex justify-between text-slate-700 dark:text-slate-300">
                  <span>Hass Avocados (Pack of 2) (x1)</span>
                  <span className="font-bold">₹180</span>
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-white/5 space-y-1 text-slate-500">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>₹310</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Hyperlocal Delivery</span>
                    <span className="text-emerald-500 font-bold">FREE</span>
                  </div>
                  <div className="flex justify-between">
                    <span>AI Convenience Fee</span>
                    <span>₹15</span>
                  </div>
                  <div className="pt-2 border-t border-slate-200 dark:border-white/10 flex justify-between text-sm font-extrabold text-brand-primary dark:text-white">
                    <span>Paid via UPI</span>
                    <span className="text-brand-secondary dark:text-brand-rose">₹325</span>
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>

      </Container>
    </div>
  );
};
