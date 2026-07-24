import React from 'react';
import { Container } from '../ui/Container';
import {
  Zap, ShieldCheck, Truck, Clock, Sparkles,
  Github, Linkedin, Instagram, ArrowUpRight,
} from 'lucide-react';

const SOCIAL_LINKS = [
  {
    icon: Github,
    label: 'GitHub',
    href: 'https://github.com/shahid-dar09',
    hoverColor: 'hover:text-white hover:bg-slate-700',
  },
  {
    icon: Linkedin,
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/dar-shahid-739571370/',
    hoverColor: 'hover:text-white hover:bg-[#0077B5]',
  },
  {
    icon: Instagram,
    label: 'Instagram',
    href: 'https://www.instagram.com/i_m_shahid009/',
    hoverColor: 'hover:text-white hover:bg-gradient-to-br hover:from-[#f09433] hover:via-[#e6683c] hover:via-[#dc2743] hover:via-[#cc2366] hover:to-[#bc1888]',
  },
];

const VALUE_PROPS = [
  {
    icon: Zap,
    label: 'Product-First Engine',
    desc: 'Shop by item, not store. AI instantly matches the nearest best merchant.',
    colorClass: 'text-brand-secondary dark:text-brand-violet',
    bgClass: 'bg-indigo-50 dark:bg-brand-violet/10',
  },
  {
    icon: Truck,
    label: 'Ultra-Fast Delivery',
    desc: 'Real-time hyperlocal dispatch — your order arrives in minutes.',
    colorClass: 'text-brand-accent dark:text-brand-rose',
    bgClass: 'bg-amber-50 dark:bg-brand-rose/10',
  },
  {
    icon: Clock,
    label: 'Live Inventory',
    desc: 'Merchant stock synced in real-time so you never order what\'s unavailable.',
    colorClass: 'text-emerald-600 dark:text-emerald-400',
    bgClass: 'bg-emerald-50 dark:bg-emerald-900/20',
  },
  {
    icon: ShieldCheck,
    label: 'Quality Guaranteed',
    desc: 'Only verified, top-rated local merchants with strict quality standards.',
    colorClass: 'text-brand-teal dark:text-brand-teal',
    bgClass: 'bg-cyan-50 dark:bg-brand-teal/10',
  },
];

export const Footer: React.FC = () => {
  return (
    <footer className="relative overflow-hidden bg-brand-primary dark:bg-brand-darkBg border-t border-indigo-900/40 dark:border-brand-rose/10 pt-16 pb-10 mt-24">

      {/* Background orbs */}
      <div className="orb orb-violet w-72 h-72 -top-20 -left-16 opacity-20 pointer-events-none" />
      <div className="orb orb-gold   w-60 h-60 bottom-0  right-0   opacity-10 pointer-events-none dark:hidden" />
      <div className="orb orb-rose   w-60 h-60 -top-10   right-0   opacity-10 pointer-events-none hidden dark:block" />
      <div className="orb orb-teal   w-48 h-48 bottom-0  left-1/2  opacity-8  pointer-events-none hidden dark:block" />

      <Container size="lg" className="relative z-10">

        {/* ── Value Props ──────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pb-12 border-b border-white/8 dark:border-white/5">
          {VALUE_PROPS.map(({ icon: Icon, label, desc, colorClass, bgClass }) => (
            <div key={label} className="flex items-start gap-3 group">
              <div className={`p-2.5 rounded-xl ${bgClass} ${colorClass} shrink-0 transition-transform duration-200 group-hover:scale-110`}>
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-semibold text-white text-sm">{label}</h4>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ── Main Footer Grid ─────────────────────────────────────────── */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10 py-12">

          {/* Brand column */}
          <div className="col-span-2 space-y-5">
            <div className="flex items-center gap-2.5">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center text-white shadow-lg"
                style={{ background: 'linear-gradient(135deg, #7C3AED, #F43F5E)' }}
              >
                <Zap className="w-5 h-5 fill-current" />
              </div>
              <span className="font-display font-extrabold text-xl text-white tracking-tight">
                Wadi<span
                  style={{
                    background: 'linear-gradient(135deg, #F43F5E, #8B5CF6)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >Go</span>
              </span>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed max-w-xs">
              Next-generation AI-powered hyperlocal commerce platform. Search for any product and let WadiGo instantly find the best local merchant for fulfillment.
            </p>

            {/* Status pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold text-emerald-400 border border-emerald-800/60 bg-emerald-950/40">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <Sparkles className="w-3 h-3" />
              All Systems Operational
            </div>

            {/* Social Links */}
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-500 mb-3">
                Connect with the Creator
              </p>
              <div className="flex items-center gap-2">
                {SOCIAL_LINKS.map(({ icon: Icon, label, href, hoverColor }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={label}
                    className={`w-9 h-9 rounded-xl flex items-center justify-center text-slate-400 bg-white/5 border border-white/8 transition-all duration-200 ${hoverColor} hover:scale-110 hover:border-transparent`}
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Platform column */}
          <div className="space-y-4">
            <h5 className="font-semibold text-white text-sm">Platform</h5>
            <ul className="space-y-2.5">
              {['How It Works', 'AI Engine', 'Product Search', 'Hyperlocal Dispatch'].map(item => (
                <li key={item}>
                  <a href="#" className="text-xs text-slate-400 hover:text-white transition-colors duration-200 flex items-center gap-1 group">
                    {item}
                    <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity -mt-0.5" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Merchants column */}
          <div className="space-y-4">
            <h5 className="font-semibold text-white text-sm">For Merchants</h5>
            <ul className="space-y-2.5">
              {['Partner with WadiGo', 'Merchant Portal', 'Fulfillment Rules', 'Inventory Sync'].map(item => (
                <li key={item}>
                  <a href="#" className="text-xs text-slate-400 hover:text-white transition-colors duration-200 flex items-center gap-1 group">
                    {item}
                    <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity -mt-0.5" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal column */}
          <div className="space-y-4">
            <h5 className="font-semibold text-white text-sm">Legal</h5>
            <ul className="space-y-2.5">
              {['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'Data Security'].map(item => (
                <li key={item}>
                  <a href="#" className="text-xs text-slate-400 hover:text-white transition-colors duration-200 flex items-center gap-1 group">
                    {item}
                    <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity -mt-0.5" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ── Bottom Bar ───────────────────────────────────────────────── */}
        <div className="pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-600">
          <p>© {new Date().getFullYear()} WadiGo. Crafted with passion for hyperlocal commerce.</p>
          <p className="font-mono text-slate-700">v1.0.0 · Phase 1</p>
        </div>

      </Container>
    </footer>
  );
};
