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
                Live Order Tracker
              </h1>
            </div>
          </div>
        </div>

        {/* ── EMPTY / SELECTION STATE ─────────────────────────────────── */}
        <div className="py-20 text-center space-y-4 max-w-md mx-auto rounded-3xl bg-white dark:bg-brand-darkSurface p-8 border border-indigo-100/70 dark:border-white/10 shadow-xl">
          <div className="w-14 h-14 rounded-2xl mx-auto flex items-center justify-center bg-indigo-50 dark:bg-white/5 text-slate-400">
            <Truck className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <h3 className="font-display font-extrabold text-lg text-brand-primary dark:text-white">
              {orderId ? `Order #${orderId}` : 'No Active Order Selected'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              When an active order is placed, live GPS map routing, merchant preparation milestones, driver contact, and digital receipts will load here.
            </p>
          </div>
          <div>
            <Link to="/products">
              <Button variant="gradient" size="sm">
                Explore Product Catalog
              </Button>
            </Link>
          </div>
        </div>

      </Container>
    </div>
  );
};
