import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import {
  Zap, ShoppingBag, Sparkles, ArrowRight,
  Clock, CheckCircle2, Search, ShieldCheck,
  Truck, Store, Brain, MapPin, BarChart3,
  Smartphone, Users, TrendingUp,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Container } from '../components/ui/Container';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';

/* ── Animation helpers ────────────────────────────────────────────────── */
const fadeUp = {
  hidden:  { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0,  transition: { duration: 0.6, ease: 'easeOut' } },
};

const stagger = (delay = 0) => ({
  hidden:  { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0,  transition: { duration: 0.55, delay, ease: 'easeOut' } },
});

const scaleIn = {
  hidden:  { opacity: 0, scale: 0.92 },
  visible: { opacity: 1, scale: 1,  transition: { duration: 0.6, ease: 'easeOut' } },
};

/* ── Animated Section Wrapper ─────────────────────────────────────────── */
const Section: React.FC<{ children: React.ReactNode; className?: string; id?: string }> = ({
  children,
  className = '',
  id,
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <motion.section
      id={id}
      ref={ref}
      variants={fadeUp}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      className={className}
    >
      {children}
    </motion.section>
  );
};

/* ── Section Badge ────────────────────────────────────────────────────── */
const SectionBadge: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span className="section-badge">
    <Sparkles className="w-3 h-3" />
    {children}
  </span>
);

/* ── HOW IT WORKS data ────────────────────────────────────────────────── */
const HOW_STEPS = [
  {
    num: '01',
    icon: Search,
    title: 'Search Any Product',
    desc: 'Type exactly what you need — milk, electronics, medicine. You search for products, not stores.',
    color: 'text-brand-secondary dark:text-brand-violet',
    bg:    'bg-indigo-50 dark:bg-brand-violet/10',
  },
  {
    num: '02',
    icon: Brain,
    title: 'AI Selects the Best Match',
    desc: 'Our engine compares inventory, pricing, distance, freshness, and merchant ratings in real-time.',
    color: 'text-brand-accent dark:text-brand-rose',
    bg:    'bg-amber-50 dark:bg-brand-rose/10',
  },
  {
    num: '03',
    icon: Truck,
    title: 'Hyperlocal Doorstep Delivery',
    desc: 'Your order is dispatched from the nearest verified merchant and arrives in under 15 minutes.',
    color: 'text-emerald-600 dark:text-emerald-400',
    bg:    'bg-emerald-50 dark:bg-emerald-900/20',
  },
];

/* ── FEATURES data ────────────────────────────────────────────────────── */
const FEATURES = [
  {
    icon: MapPin,
    title: 'Hyperlocal Intelligence',
    desc:  'The engine continuously maps nearby merchant locations, routes, and estimated delivery windows.',
  },
  {
    icon: BarChart3,
    title: 'Real-Time Price Comparison',
    desc:  'Every search instantly compares prices across all local merchants so you always get the best deal.',
  },
  {
    icon: ShieldCheck,
    title: 'Verified Merchant Network',
    desc:  'Only quality-vetted local merchants are listed. Ratings and compliance are monitored continuously.',
  },
  {
    icon: Smartphone,
    title: 'Multi-Platform Access',
    desc:  'Shop from web, Android, or iOS. Your cart, orders, and preferences sync seamlessly across devices.',
  },
  {
    icon: Users,
    title: 'Merchant & Delivery Partners',
    desc:  'WadiGo connects customers, local merchants, and delivery partners into a single optimized ecosystem.',
  },
  {
    icon: TrendingUp,
    title: 'Smart Order Routing',
    desc:  'Orders are automatically split, combined, or routed across merchants for maximum efficiency.',
  },
];

/* ═══════════════════════════════════════════════════════════════════════ */
export const HomePage: React.FC = () => {
  return (
    <div className="overflow-x-hidden">

      {/* ══════════════════════════════════════════════════════════════════
          HERO SECTION
      ════════════════════════════════════════════════════════════════════ */}
      <section id="home" className="relative min-h-[92vh] flex items-center page-bg overflow-hidden">

        {/* Decorative glow orbs */}
        <div className="orb orb-violet w-[500px] h-[500px] -top-40 -right-32 opacity-30 dark:opacity-20 pointer-events-none" />
        <div className="orb orb-gold   w-[300px] h-[300px] bottom-0 left-0    opacity-20 dark:hidden    pointer-events-none" />
        <div className="orb orb-rose   w-[400px] h-[400px] -top-20 right-1/4  opacity-0  dark:opacity-15 pointer-events-none" />
        <div className="orb orb-teal   w-[250px] h-[250px] bottom-10 right-10 opacity-0  dark:opacity-10 pointer-events-none" />

        <Container size="lg" className="relative z-10 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-14 items-center">

            {/* ── Left copy ─────────────────────────────────────────────── */}
            <div className="lg:col-span-7 space-y-7">
              <motion.div
                variants={stagger(0)}
                initial="hidden"
                animate="visible"
              >
                <SectionBadge>Next-Gen AI Hyperlocal Commerce</SectionBadge>
              </motion.div>

              <motion.h1
                variants={stagger(0.1)}
                initial="hidden"
                animate="visible"
                className="font-display font-extrabold text-5xl sm:text-6xl lg:text-7xl tracking-tight leading-[1.06] text-brand-primary dark:text-white"
              >
                Shop by{' '}
                <span className="gradient-text-hero">PRODUCT</span>
                ,<br className="hidden sm:block" /> Not by Store.
              </motion.h1>

              <motion.p
                variants={stagger(0.2)}
                initial="hidden"
                animate="visible"
                className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-xl leading-relaxed"
              >
                WadiGo's AI engine searches nearby local merchants and instantly
                delivers the exact item you need at the best price, fastest time,
                and from verified stock — completely automated.
              </motion.p>

              {/* Search bar */}
              <motion.div
                variants={stagger(0.3)}
                initial="hidden"
                animate="visible"
                className="max-w-lg"
              >
                <div className="relative flex items-center group">
                  <Search className="w-5 h-5 absolute left-4 text-slate-400 group-focus-within:text-brand-secondary dark:group-focus-within:text-brand-rose transition-colors" />
                  <input
                    type="text"
                    placeholder="Search any product — milk, avocados, headphones…"
                    className="w-full pl-12 pr-36 py-4 rounded-2xl border-2 border-indigo-100 dark:border-white/10 bg-white dark:bg-white/5 dark:backdrop-blur-sm text-sm text-brand-primary dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-brand-secondary dark:focus:border-brand-rose shadow-glass dark:shadow-card-dark transition-all duration-200"
                  />
                  <button
                    className="absolute right-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white btn-gradient-indigo transition-all duration-200 hover:shadow-glow-violet"
                    style={{ background: 'linear-gradient(135deg, #4C1D95, #7C3AED)' }}
                  >
                    Search
                  </button>
                </div>
              </motion.div>

              {/* Stats row */}
              <motion.div
                variants={stagger(0.4)}
                initial="hidden"
                animate="visible"
                className="flex flex-wrap items-center gap-6 pt-4 border-t border-indigo-100 dark:border-white/8"
              >
                {[
                  { icon: Clock,        label: '< 15 Mins',    sub: 'Hyperlocal Dispatch', color: 'text-brand-accent dark:text-brand-rose' },
                  { icon: Zap,          label: 'Smart Match',  sub: 'Multi-Merchant AI',   color: 'text-brand-secondary dark:text-brand-violet' },
                  { icon: CheckCircle2, label: '₹ Best Price', sub: 'Live Comparison',      color: 'text-emerald-500' },
                ].map(({ icon: Icon, label, sub, color }) => (
                  <div key={label} className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${color}`} />
                    <div>
                      <p className="text-sm font-bold text-brand-primary dark:text-white">{label}</p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">{sub}</p>
                    </div>
                  </div>
                ))}
              </motion.div>

              {/* CTA buttons */}
              <motion.div
                variants={stagger(0.5)}
                initial="hidden"
                animate="visible"
                className="flex flex-wrap gap-3 pt-2"
              >
                <Link to="/auth/register">
                  <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                    <Button
                      variant="gradient"
                      size="lg"
                      rightIcon={<ArrowRight className="w-4 h-4" />}
                      className="btn-gradient-indigo shadow-glow-violet"
                    >
                      Start Shopping Free
                    </Button>
                  </motion.div>
                </Link>
                <Link to="/auth/login">
                  <Button variant="outline" size="lg">
                    Sign In
                  </Button>
                </Link>
              </motion.div>
            </div>

            {/* ── Right hero card ───────────────────────────────────────── */}
            <motion.div
              variants={scaleIn}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.2 }}
              className="lg:col-span-5"
            >
              <div>
                <Card
                  glass
                  hoverable={false}
                  className="relative overflow-hidden border border-indigo-100/60 dark:border-brand-rose/15 shadow-2xl dark:shadow-card-dark p-0"
                >
                  {/* Card header */}
                  <div className="px-5 pt-5 pb-4 border-b border-indigo-50 dark:border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-7 h-7 rounded-lg flex items-center justify-center"
                        style={{ background: 'linear-gradient(135deg, #7C3AED, #A855F7)' }}
                      >
                        <Zap className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-sm font-bold text-brand-primary dark:text-white">
                        WadiGo Platform
                      </span>
                    </div>
                    <span className="section-badge text-[10px]">
                      <Sparkles className="w-3 h-3" />
                      AI Powered
                    </span>
                  </div>

                  {/* Platform overview */}
                  <div className="p-5 space-y-3">

                    {/* Key capabilities */}
                    {[
                      {
                        icon: Search,
                        title: 'Product-First Search',
                        desc: 'Search any item — not a store. WadiGo finds it everywhere nearby.',
                        grad: 'linear-gradient(135deg, #4C1D95, #7C3AED)',
                        bg: 'bg-indigo-50/90 dark:bg-indigo-950/60',
                        border: 'border-indigo-100 dark:border-indigo-800/50',
                        titleColor: 'text-slate-900 dark:text-indigo-100',
                        descColor: 'text-slate-600 dark:text-indigo-200/80',
                      },
                      {
                        icon: Brain,
                        title: 'AI Merchant Selection',
                        desc: 'Scores every nearby merchant on price, distance, stock, and rating in milliseconds.',
                        grad: 'linear-gradient(135deg, #F43F5E, #8B5CF6)',
                        bg: 'bg-rose-50/90 dark:bg-rose-950/60',
                        border: 'border-rose-100 dark:border-rose-800/50',
                        titleColor: 'text-slate-900 dark:text-rose-100',
                        descColor: 'text-slate-600 dark:text-rose-200/80',
                      },
                      {
                        icon: Truck,
                        title: 'Hyperlocal Dispatch',
                        desc: 'Your order is picked from the closest verified merchant and delivered in under 15 minutes.',
                        grad: 'linear-gradient(135deg, #059669, #22C55E)',
                        bg: 'bg-emerald-50/90 dark:bg-emerald-950/60',
                        border: 'border-emerald-100 dark:border-emerald-800/50',
                        titleColor: 'text-slate-900 dark:text-emerald-100',
                        descColor: 'text-slate-600 dark:text-emerald-200/80',
                      },
                    ].map(({ icon: Icon, title, desc, grad, bg, border, titleColor, descColor }) => (
                      <div
                        key={title}
                        className={`flex items-start gap-3 p-3.5 rounded-xl ${bg} border ${border}`}
                      >
                        <div
                          className="p-2 rounded-lg text-white shrink-0 mt-0.5 shadow-sm"
                          style={{ background: grad }}
                        >
                          <Icon className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <p className={`text-xs font-bold ${titleColor}`}>{title}</p>
                          <p className={`text-[11px] ${descColor} mt-0.5 leading-relaxed`}>{desc}</p>
                        </div>
                      </div>
                    ))}

                    {/* Bottom stat row */}
                    <div className="grid grid-cols-3 gap-2 pt-1">
                      {[
                        { icon: Clock,       val: '< 15 min', label: 'Avg Delivery',  color: 'text-brand-accent dark:text-brand-rose' },
                        { icon: ShieldCheck, val: 'Verified', label: 'Merchants',     color: 'text-brand-secondary dark:text-brand-violet' },
                        { icon: MapPin,      val: 'Live',     label: 'Stock Tracking', color: 'text-emerald-500' },
                      ].map(({ icon: Icon, val, label, color }) => (
                        <div
                          key={label}
                          className="p-2.5 rounded-xl bg-slate-100/90 dark:bg-slate-800/70 border border-slate-200/80 dark:border-slate-700/60 text-center space-y-0.5"
                        >
                          <Icon className={`w-4 h-4 mx-auto ${color}`} />
                          <p className="text-[10px] font-extrabold text-slate-900 dark:text-white">{val}</p>
                          <p className="text-[9px] font-semibold text-slate-500 dark:text-slate-300">{label}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </Card>
              </div>
            </motion.div>

          </div>
        </Container>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          HOW IT WORKS
      ════════════════════════════════════════════════════════════════════ */}
      <Section id="how-it-works" className="py-24">
        <Container size="lg">

          {/* Header */}
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
            <SectionBadge>How It Works</SectionBadge>
            <h2 className="font-display font-extrabold text-4xl text-brand-primary dark:text-white">
              Three Steps to{' '}
              <span className="gradient-text-hero">Instant Delivery</span>
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-base leading-relaxed">
              No store-browsing. No guesswork. WadiGo's engine handles everything
              from merchant selection to doorstep delivery.
            </p>
          </div>

          {/* Steps */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
            {/* Connector lines (desktop) */}
            <div className="hidden md:block absolute top-10 left-1/3 right-1/3 h-px bg-gradient-to-r from-indigo-200 via-violet-300 to-indigo-200 dark:from-brand-rose/20 dark:via-brand-violet/30 dark:to-brand-rose/20" />

            {HOW_STEPS.map(({ num, icon: Icon, title, desc, color, bg }, i) => (
              <motion.div
                key={num}
                variants={stagger(i * 0.15)}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-60px' }}
              >
                <Card
                  glass
                  hoverable
                  className="p-6 text-center space-y-4 h-full relative"
                >
                  {/* Step number */}
                  <div className={`w-12 h-12 rounded-2xl ${bg} ${color} flex items-center justify-center mx-auto`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="step-number w-7 h-7 text-xs absolute top-4 right-4 rounded-lg">
                    {num}
                  </div>
                  <h3 className="font-bold text-lg text-brand-primary dark:text-white">{title}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{desc}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </Container>
      </Section>

      {/* ══════════════════════════════════════════════════════════════════
          FEATURES GRID
      ════════════════════════════════════════════════════════════════════ */}
      <Section id="features" className="py-24 relative overflow-hidden">

        {/* bg accent */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-indigo-50/40 to-transparent dark:via-brand-rose/3 pointer-events-none" />

        <Container size="lg" className="relative z-10">

          <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
            <SectionBadge>Platform Capabilities</SectionBadge>
            <h2 className="font-display font-extrabold text-4xl text-brand-primary dark:text-white">
              Built for the{' '}
              <span className="gradient-text-hero">Future of Commerce</span>
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-base">
              Every feature in WadiGo is designed around one principle: getting the right
              product to the right person as fast as possible.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map(({ icon: Icon, title, desc }, i) => (
              <motion.div
                key={title}
                variants={stagger(i * 0.08)}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-60px' }}
              >
                <Card glass hoverable className="p-6 space-y-3 h-full group">
                  <div
                    className="w-11 h-11 rounded-2xl flex items-center justify-center text-white shadow-md"
                    style={{
                      background: i % 3 === 0
                        ? 'linear-gradient(135deg, #4C1D95, #7C3AED)'
                        : i % 3 === 1
                        ? 'linear-gradient(135deg, #EAB308, #F59E0B)'
                        : 'linear-gradient(135deg, #F43F5E, #8B5CF6)',
                    }}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-base text-brand-primary dark:text-white group-hover:text-brand-secondary dark:group-hover:text-brand-rose transition-colors">
                    {title}
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{desc}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </Container>
      </Section>

      {/* ══════════════════════════════════════════════════════════════════
          CTA BANNER
      ════════════════════════════════════════════════════════════════════ */}
      <Section className="py-20">
        <Container size="lg">
          <motion.div
            variants={scaleIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-3xl p-10 sm:p-14 text-center text-white"
            style={{
              background: 'linear-gradient(135deg, #1E1B4B 0%, #4C1D95 40%, #7C3AED 70%, #A855F7 100%)',
            }}
          >
            {/* Inner orbs */}
            <div className="orb orb-gold  w-64 h-64 -top-16 -right-16 opacity-25 dark:hidden" />
            <div className="orb orb-teal  w-48 h-48 bottom-0   left-0   opacity-0  dark:opacity-20" />
            <div className="orb orb-rose  w-80 h-80 -top-20  -left-20  opacity-0  dark:opacity-15" />

            <div className="relative z-10 space-y-5 max-w-2xl mx-auto">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/15 border border-white/20 text-white">
                <Sparkles className="w-3 h-3" /> Now Live
              </span>
              <h2 className="font-display font-extrabold text-4xl sm:text-5xl leading-tight">
                Ready to Shop Smarter?
              </h2>
              <p className="text-indigo-200 text-base leading-relaxed">
                Join WadiGo and experience the future of product-first hyperlocal commerce.
                Find any item, from the best local merchant, delivered in minutes.
              </p>
              <div className="flex flex-wrap justify-center gap-4 pt-2">
                <Link to="/auth/register">
                  <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
                    <button
                      className="inline-flex items-center gap-2.5 px-8 py-4 rounded-xl font-bold text-base bg-white text-brand-primary hover:bg-indigo-50 shadow-xl transition-all duration-200 active:scale-[0.97]"
                    >
                      Create Free Account
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  </motion.div>
                </Link>
              </div>
            </div>
          </motion.div>
        </Container>
      </Section>

    </div>
  );
};
