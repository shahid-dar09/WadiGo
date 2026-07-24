import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, ShoppingBag, Plus, Minus, Trash2, ArrowRight,
  MapPin, CreditCard, CheckCircle2, Sparkles, ShieldCheck,
  Clock, Store, ChevronRight, Zap
} from 'lucide-react';
import { useCartStore } from '../../store/cartStore';
import { useThemeStore } from '../../store/themeStore';

export const CartDrawer: React.FC = () => {
  const {
    items, isOpen, closeCart, updateQuantity, removeItem, clearCart,
    addresses, selectedAddress, setSelectedAddress, paymentMethod, setPaymentMethod,
    getTotalItems, getSubtotal, getDeliveryFee, getConvenienceFee, getGrandTotal
  } = useCartStore();
  const { isDarkMode } = useThemeStore();
  const navigate = useNavigate();

  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'checkout' | 'success'>('cart');
  const [isSubmitting, setIsSubmitting]   = useState(false);

  const handlePlaceOrder = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setCheckoutStep('success');
      clearCart();
    }, 1200);
  };

  const handleViewTracking = () => {
    closeCart();
    setCheckoutStep('cart');
    navigate('/orders/WG-9402');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 z-[100] bg-slate-950/70 backdrop-blur-sm"
          />

          {/* Slide-over Drawer Panel (Half Screen Width on Desktop) */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="fixed top-0 right-0 bottom-0 z-[101] w-full md:w-1/2 lg:w-1/2 bg-white dark:bg-slate-950 shadow-2xl flex flex-col overflow-hidden border-l border-indigo-100 dark:border-white/10 text-slate-900 dark:text-white"
          >
            {/* Header (Dark mode contrast fixed) */}
            <div className="p-5 border-b border-indigo-100 dark:border-white/10 flex items-center justify-between bg-slate-50 dark:bg-slate-900/90">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-md"
                  style={{ background: 'linear-gradient(135deg, #7C3AED, #F43F5E)' }}
                >
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-display font-extrabold text-xl text-brand-primary dark:text-white leading-tight">
                    {checkoutStep === 'cart' && 'Your Basket'}
                    {checkoutStep === 'checkout' && 'Checkout & Delivery'}
                    {checkoutStep === 'success' && 'Order Placed!'}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {checkoutStep === 'cart' && `${getTotalItems()} item${getTotalItems() === 1 ? '' : 's'} in cart`}
                    {checkoutStep === 'checkout' && 'Select address & payment method'}
                    {checkoutStep === 'success' && 'Sub-15 minute dispatch confirmed'}
                  </p>
                </div>
              </div>

              <button
                onClick={closeCart}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              
              {/* ── STEP 1: CART ITEMS ── */}
              {checkoutStep === 'cart' && (
                <>
                  {items.length === 0 ? (
                    <div className="py-20 text-center space-y-4">
                      <div className="w-16 h-16 rounded-2xl mx-auto flex items-center justify-center bg-indigo-50 dark:bg-slate-900/80 text-slate-400 border border-indigo-100 dark:border-white/10">
                        <ShoppingBag className="w-8 h-8" />
                      </div>
                      <div className="space-y-1">
                        <p className="font-bold text-slate-800 dark:text-slate-100 text-lg">Your cart is empty</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto leading-relaxed">
                          Search any product on WadiGo and add it to your basket to compare nearby merchant prices.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {/* AI Allocation Banner */}
                      <div className="p-4 rounded-2xl bg-indigo-50/80 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-800/40 flex items-start gap-3">
                        <Zap className="w-4 h-4 text-brand-secondary dark:text-brand-violet shrink-0 mt-0.5" />
                        <p className="text-xs text-slate-700 dark:text-slate-200 leading-relaxed">
                          WadiGo's AI engine automatically routes items to the nearest verified store at the best price.
                        </p>
                      </div>

                      {/* Items List */}
                      {items.map((item) => (
                        <div
                          key={item.id}
                          className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200/80 dark:border-white/10 flex items-center gap-4"
                        >
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-16 h-16 rounded-xl object-cover shrink-0 border border-slate-200 dark:border-white/10"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="font-bold text-sm text-brand-primary dark:text-white truncate">
                              {item.name}
                            </p>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                              {item.unit}
                            </p>
                            <div className="flex items-center gap-1.5 text-xs text-brand-secondary dark:text-brand-rose font-semibold mt-1">
                              <Store className="w-3.5 h-3.5" />
                              <span>{item.storeName} ({item.storeDistance})</span>
                            </div>

                            <div className="flex items-center justify-between mt-3">
                              <span className="font-extrabold text-sm text-brand-primary dark:text-white">
                                ₹{item.price * item.quantity}
                              </span>

                              {/* Quantity Controls */}
                              <div className="flex items-center gap-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-2.5 py-1">
                                <button
                                  onClick={() => updateQuantity(item.id, -1)}
                                  className="text-slate-500 hover:text-slate-800 dark:hover:text-white"
                                >
                                  <Minus className="w-3.5 h-3.5" />
                                </button>
                                <span className="text-xs font-bold w-5 text-center text-slate-900 dark:text-white">
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() => updateQuantity(item.id, 1)}
                                  className="text-slate-500 hover:text-slate-800 dark:hover:text-white"
                                >
                                  <Plus className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          </div>

                          <button
                            onClick={() => removeItem(item.id)}
                            className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}

              {/* ── STEP 2: CHECKOUT (ADDRESS & PAYMENT) ── */}
              {checkoutStep === 'checkout' && (
                <div className="space-y-5">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center justify-between">
                      <span>Delivery Address</span>
                    </label>

                    <div className="space-y-2">
                      {addresses.map((addr) => {
                        const isSelected = selectedAddress?.id === addr.id;
                        return (
                          <div
                            key={addr.id}
                            onClick={() => setSelectedAddress(addr)}
                            className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                              isSelected
                                ? 'border-brand-secondary bg-indigo-50/80 dark:border-brand-rose dark:bg-indigo-950/70 shadow-md'
                                : 'border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-900/60'
                            }`}
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex items-center gap-2">
                                <MapPin className={`w-4 h-4 ${isSelected ? 'text-brand-secondary dark:text-brand-rose' : 'text-slate-400'}`} />
                                <span className="font-bold text-sm text-brand-primary dark:text-white">{addr.label}</span>
                              </div>
                              <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${isSelected ? 'border-brand-secondary dark:border-brand-rose bg-brand-secondary dark:bg-brand-rose' : 'border-slate-300'}`}>
                                {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                              </div>
                            </div>
                            <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 pl-6">
                              {addr.addressLine}, {addr.city}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="space-y-2 pt-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Payment Method
                    </label>

                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { id: 'upi', label: 'UPI / GPay', desc: 'Instant' },
                        { id: 'card', label: 'Card', desc: 'Credit/Debit' },
                        { id: 'cod', label: 'Cash on Delivery', desc: 'Pay at Door' },
                      ].map((pay) => {
                        const isSelected = paymentMethod === pay.id;
                        return (
                          <button
                            key={pay.id}
                            type="button"
                            onClick={() => setPaymentMethod(pay.id as any)}
                            className={`p-3.5 rounded-2xl border text-left transition-all ${
                              isSelected
                                ? 'border-brand-secondary bg-indigo-50/80 dark:border-brand-rose dark:bg-indigo-950/70'
                                : 'border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-900/60'
                            }`}
                          >
                            <p className="font-bold text-xs text-brand-primary dark:text-white">{pay.label}</p>
                            <p className="text-[10px] text-slate-400 mt-0.5">{pay.desc}</p>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* ── STEP 3: SUCCESS STATE ── */}
              {checkoutStep === 'success' && (
                <div className="py-12 text-center space-y-5">
                  <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="w-20 h-20 rounded-full mx-auto flex items-center justify-center text-emerald-500 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800"
                  >
                    <CheckCircle2 className="w-12 h-12" />
                  </motion.div>

                  <div className="space-y-2">
                    <span className="section-badge text-xs">Order Confirmed · #WG-9402</span>
                    <h3 className="font-display font-extrabold text-2xl text-brand-primary dark:text-white">
                      Dispatched Hyperlocal!
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto leading-relaxed">
                      Your items are being picked and will arrive in <span className="font-bold text-emerald-500">Under 12 Mins</span>.
                    </p>
                  </div>
                </div>
              )}

            </div>

            {/* Footer Summary & Action Buttons */}
            {items.length > 0 && checkoutStep !== 'success' && (
              <div className="p-6 border-t border-indigo-100 dark:border-white/10 bg-slate-50 dark:bg-slate-900/90 space-y-4">
                <div className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
                  <div className="flex justify-between">
                    <span>Items Subtotal</span>
                    <span className="font-semibold text-brand-primary dark:text-white">₹{getSubtotal()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Hyperlocal Delivery</span>
                    <span className="font-semibold text-emerald-500">
                      {getDeliveryFee() === 0 ? 'FREE' : `₹${getDeliveryFee()}`}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>AI Convenience Fee</span>
                    <span className="font-semibold text-brand-primary dark:text-white">₹{getConvenienceFee()}</span>
                  </div>
                  <div className="pt-2 border-t border-slate-200 dark:border-white/10 flex justify-between text-base font-extrabold text-brand-primary dark:text-white">
                    <span>Grand Total</span>
                    <span className="text-brand-secondary dark:text-brand-rose">₹{getGrandTotal()}</span>
                  </div>
                </div>

                {checkoutStep === 'cart' && (
                  <button
                    onClick={() => setCheckoutStep('checkout')}
                    className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-white text-sm transition-all duration-200 hover:shadow-glow-violet active:scale-[0.98]"
                    style={{ background: 'linear-gradient(135deg, #4C1D95, #7C3AED)' }}
                  >
                    Proceed to Checkout
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}

                {checkoutStep === 'checkout' && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => setCheckoutStep('cart')}
                      className="px-4 py-3.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300"
                    >
                      Back
                    </button>
                    <button
                      onClick={handlePlaceOrder}
                      disabled={isSubmitting}
                      className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-white text-sm transition-all duration-200 hover:shadow-glow-rose disabled:opacity-60"
                      style={{ background: 'linear-gradient(135deg, #F43F5E, #8B5CF6)' }}
                    >
                      {isSubmitting ? (
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <>
                          Pay & Confirm ₹{getGrandTotal()}
                          <Zap className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
