import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, ShoppingBag, Plus, Minus, Trash2, ArrowRight,
  MapPin, CheckCircle2, Zap, Package, Loader2
} from 'lucide-react';
import { useCartStore } from '../../store/cartStore';
import { useAddressStore } from '../../store/addressStore';

export const CartDrawer: React.FC = () => {
  const {
    items, isOpen, closeCart, updateQuantity, removeItem, clearCart,
    subtotal, deliveryFee, total, isLoading, getTotalItems
  } = useCartStore();
  const { addresses, selectedAddress, setSelectedAddress } = useAddressStore();
  const navigate = useNavigate();

  const handleProceedToCheckout = () => {
    closeCart();
    navigate('/checkout');
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

          {/* Drawer Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="fixed top-0 right-0 bottom-0 z-[101] w-full md:w-1/2 lg:w-1/2 bg-white dark:bg-slate-950 shadow-2xl flex flex-col overflow-hidden border-l border-indigo-100 dark:border-white/10 text-slate-900 dark:text-white"
          >
            {/* Header */}
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
                    Your Cart
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {getTotalItems()} item{getTotalItems() === 1 ? '' : 's'} in cart
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

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {isLoading && items.length === 0 ? (
                <div className="py-20 flex justify-center">
                  <Loader2 className="w-8 h-8 animate-spin text-brand-secondary dark:text-brand-rose" />
                </div>
              ) : items.length === 0 ? (
                <div className="py-20 text-center space-y-4">
                  <div className="w-16 h-16 rounded-2xl mx-auto flex items-center justify-center bg-indigo-50 dark:bg-slate-900/80 text-slate-400 border border-indigo-100 dark:border-white/10">
                    <ShoppingBag className="w-8 h-8" />
                  </div>
                  <div className="space-y-1">
                    <p className="font-bold text-slate-800 dark:text-slate-100 text-lg">Your cart is empty</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto leading-relaxed">
                      Search products on WadiGo and add them to your cart to get fast delivery from local merchants.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="p-3.5 rounded-2xl bg-indigo-50/80 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-800/40 flex items-start gap-2.5">
                    <Zap className="w-4 h-4 text-brand-secondary dark:text-brand-violet shrink-0 mt-0.5" />
                    <p className="text-xs text-slate-700 dark:text-slate-200 leading-relaxed">
                      Hyperlocal delivery routed automatically to the best nearby store.
                    </p>
                  </div>

                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200/80 dark:border-white/10 flex items-center gap-4"
                    >
                      <div className="w-14 h-14 rounded-xl bg-slate-200 dark:bg-slate-700 overflow-hidden shrink-0">
                        {item.imageUrl ? (
                          <img src={item.imageUrl} alt={item.productName} className="w-full h-full object-cover" />
                        ) : (
                          <Package className="w-6 h-6 m-4 text-slate-400" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-sm text-brand-primary dark:text-white truncate">
                          {item.productName}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                          {item.unit}
                        </p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="font-extrabold text-sm text-brand-primary dark:text-white">
                            ₹{item.price * item.quantity}
                          </span>
                          <div className="flex items-center gap-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-2.5 py-1">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="text-slate-500 hover:text-slate-800 dark:hover:text-white"
                            >
                              −
                            </button>
                            <span className="text-xs font-bold w-5 text-center text-slate-900 dark:text-white">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="text-slate-500 hover:text-slate-800 dark:hover:text-white"
                            >
                              +
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
            </div>

            {/* Footer Summary & Checkout Button */}
            {items.length > 0 && (
              <div className="p-6 border-t border-indigo-100 dark:border-white/10 bg-slate-50 dark:bg-slate-900/90 space-y-4">
                <div className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-semibold text-brand-primary dark:text-white">₹{subtotal}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery Fee</span>
                    <span className="font-semibold text-emerald-500">
                      {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}
                    </span>
                  </div>
                  <div className="pt-2 border-t border-slate-200 dark:border-white/10 flex justify-between text-base font-extrabold text-brand-primary dark:text-white">
                    <span>Total</span>
                    <span className="text-brand-secondary dark:text-brand-rose">₹{total}</span>
                  </div>
                </div>

                <button
                  onClick={handleProceedToCheckout}
                  className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-white text-sm transition-all duration-200 shadow-lg hover:opacity-90 active:scale-[0.98]"
                  style={{ background: 'linear-gradient(135deg, #4C1D95, #7C3AED)' }}
                >
                  Proceed to Checkout
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
