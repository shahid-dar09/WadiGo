import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingBag, MapPin, ChevronRight, Loader2,
  CheckCircle2, Trash2, Package, ArrowRight, Zap
} from 'lucide-react';
import { useCartStore } from '../../store/cartStore';
import { useAddressStore } from '../../store/addressStore';
import { useOrderStore } from '../../store/orderStore';
import { Container } from '../../components/ui/Container';

export const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { items, subtotal, deliveryFee, total, isLoading: cartLoading, fetchCart, removeItem, updateQuantity } = useCartStore();
  const { addresses, selectedAddress, fetchAddresses, setSelectedAddress } = useAddressStore();
  const { placeOrder, isPlacing, error } = useOrderStore();
  const [step, setStep] = useState<'cart' | 'address' | 'confirm'>('cart');
  const [successOrder, setSuccessOrder] = useState<any>(null);

  useEffect(() => {
    fetchCart();
    fetchAddresses();
  }, []);

  const handlePlaceOrder = async () => {
    if (!selectedAddress) return;
    try {
      const order = await placeOrder({
        addressId: selectedAddress.id,
        paymentMethod: 'COD',
      });
      setSuccessOrder(order);
    } catch { /* error shown from store */ }
  };

  if (successOrder) {
    return (
      <div className="min-h-screen page-bg flex items-center justify-center py-10">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="max-w-md w-full mx-auto p-8 rounded-3xl bg-white dark:bg-brand-darkSurface border border-indigo-100/70 dark:border-white/10 shadow-2xl text-center space-y-6"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 300 }}
          >
            <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-950 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10 text-green-500" />
            </div>
          </motion.div>
          <div>
            <h2 className="font-display font-extrabold text-2xl text-brand-primary dark:text-white">Order Placed!</h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Your order has been confirmed successfully.</p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 space-y-1 text-left">
            <p className="text-xs font-semibold text-slate-500">Order Number</p>
            <p className="font-extrabold text-lg text-brand-primary dark:text-white">{successOrder.orderNumber}</p>
            <p className="text-xs text-slate-400">Cash on Delivery · ₹{successOrder.finalAmount}</p>
          </div>
          <div className="flex gap-3">
            <Link
              to="/orders"
              className="flex-1 py-3 rounded-2xl font-bold text-sm text-white text-center"
              style={{ background: 'linear-gradient(135deg, #4C1D95, #7C3AED)' }}
            >
              Track Order
            </Link>
            <Link
              to="/products"
              className="flex-1 py-3 rounded-2xl font-bold text-sm border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-200 text-center hover:bg-slate-50 dark:hover:bg-white/5"
            >
              Keep Shopping
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen page-bg py-6">
      <Container size="lg" className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="font-display font-extrabold text-2xl text-brand-primary dark:text-white">Checkout</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Review your cart and place your order.</p>
        </div>

        {/* Steps */}
        <div className="flex items-center gap-2 text-xs font-bold">
          {(['cart', 'address', 'confirm'] as const).map((s, i) => (
            <React.Fragment key={s}>
              <button
                onClick={() => i < ['cart', 'address', 'confirm'].indexOf(step) + 1 && setStep(s)}
                className={`px-3 py-1.5 rounded-full transition-all ${
                  step === s
                    ? 'bg-brand-secondary dark:bg-brand-rose text-white'
                    : i < ['cart', 'address', 'confirm'].indexOf(step)
                    ? 'bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-300'
                    : 'bg-slate-100 dark:bg-white/5 text-slate-400'
                }`}
              >
                {i + 1}. {s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
              {i < 2 && <ChevronRight className="w-3 h-3 text-slate-300" />}
            </React.Fragment>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-8">
            <AnimatePresence mode="wait">
              {/* Step 1: Cart Review */}
              {step === 'cart' && (
                <motion.div
                  key="cart"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="p-6 rounded-3xl bg-white dark:bg-brand-darkSurface border border-indigo-100/70 dark:border-white/10 shadow-lg space-y-4"
                >
                  <h2 className="font-bold text-lg text-brand-primary dark:text-white">Your Cart</h2>
                  {cartLoading ? (
                    <div className="py-10 flex justify-center">
                      <Loader2 className="w-6 h-6 animate-spin text-brand-secondary dark:text-brand-rose" />
                    </div>
                  ) : items.length === 0 ? (
                    <div className="py-10 text-center space-y-2">
                      <ShoppingBag className="w-10 h-10 mx-auto text-slate-300" />
                      <p className="text-sm font-bold text-slate-500 dark:text-slate-400">Your cart is empty</p>
                      <Link to="/products" className="text-xs text-brand-secondary dark:text-brand-rose font-bold">
                        Browse Products →
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {items.map((item) => (
                        <div key={item.id} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50">
                          <div className="w-14 h-14 rounded-xl bg-slate-200 dark:bg-slate-700 overflow-hidden shrink-0">
                            {item.imageUrl ? (
                              <img src={item.imageUrl} alt={item.productName} className="w-full h-full object-cover" />
                            ) : (
                              <Package className="w-6 h-6 m-auto mt-4 text-slate-400" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-bold text-xs text-slate-900 dark:text-white truncate">{item.productName}</p>
                            <p className="text-[10px] text-slate-400">{item.unit}</p>
                            <p className="font-extrabold text-sm text-brand-primary dark:text-white mt-0.5">₹{item.price}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs flex items-center justify-center hover:bg-red-100 dark:hover:bg-red-950"
                            >
                              −
                            </button>
                            <span className="text-xs font-bold text-slate-900 dark:text-white w-5 text-center">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs flex items-center justify-center hover:bg-green-100 dark:hover:bg-green-950"
                            >
                              +
                            </button>
                          </div>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-950 text-red-400 hover:text-red-600 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {items.length > 0 && (
                    <button
                      onClick={() => setStep('address')}
                      className="w-full py-3.5 rounded-2xl font-bold text-sm text-white flex items-center justify-center gap-2"
                      style={{ background: 'linear-gradient(135deg, #4C1D95, #7C3AED)' }}
                    >
                      Continue to Delivery Address
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  )}
                </motion.div>
              )}

              {/* Step 2: Address Selection */}
              {step === 'address' && (
                <motion.div
                  key="address"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="p-6 rounded-3xl bg-white dark:bg-brand-darkSurface border border-indigo-100/70 dark:border-white/10 shadow-lg space-y-4"
                >
                  <h2 className="font-bold text-lg text-brand-primary dark:text-white">Select Delivery Address</h2>

                  {addresses.length === 0 ? (
                    <div className="py-10 text-center space-y-2">
                      <MapPin className="w-10 h-10 mx-auto text-slate-300" />
                      <p className="text-sm font-bold text-slate-500">No saved addresses</p>
                      <Link to="/profile" className="text-xs text-brand-secondary dark:text-brand-rose font-bold">
                        Add Address in Profile →
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {addresses.map((addr) => {
                        const isSelected = selectedAddress?.id === addr.id;
                        return (
                          <div
                            key={addr.id}
                            onClick={() => setSelectedAddress(addr)}
                            className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                              isSelected
                                ? 'border-brand-secondary dark:border-brand-rose bg-indigo-50/80 dark:bg-indigo-950/40'
                                : 'border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-slate-900/40 hover:border-slate-300 dark:hover:border-white/20'
                            }`}
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex items-start gap-2.5">
                                <MapPin className={`w-4 h-4 mt-0.5 shrink-0 ${isSelected ? 'text-brand-secondary dark:text-brand-rose' : 'text-slate-400'}`} />
                                <div>
                                  <p className="font-bold text-sm text-slate-900 dark:text-white">{addr.label}</p>
                                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                    {addr.street}, {addr.city}, {addr.state} - {addr.postalCode}
                                  </p>
                                </div>
                              </div>
                              {isSelected && <CheckCircle2 className="w-5 h-5 text-brand-secondary dark:text-brand-rose shrink-0" />}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {selectedAddress && (
                    <button
                      onClick={() => setStep('confirm')}
                      className="w-full py-3.5 rounded-2xl font-bold text-sm text-white flex items-center justify-center gap-2"
                      style={{ background: 'linear-gradient(135deg, #4C1D95, #7C3AED)' }}
                    >
                      Review & Confirm Order
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  )}
                </motion.div>
              )}

              {/* Step 3: Confirm */}
              {step === 'confirm' && (
                <motion.div
                  key="confirm"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="p-6 rounded-3xl bg-white dark:bg-brand-darkSurface border border-indigo-100/70 dark:border-white/10 shadow-lg space-y-5"
                >
                  <h2 className="font-bold text-lg text-brand-primary dark:text-white">Confirm Order</h2>

                  {/* Delivery Address Summary */}
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 space-y-1">
                    <p className="text-xs font-bold text-slate-500 dark:text-slate-400">Delivering to</p>
                    <p className="font-bold text-sm text-slate-900 dark:text-white">{selectedAddress?.label}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {selectedAddress?.street}, {selectedAddress?.city}, {selectedAddress?.state} - {selectedAddress?.postalCode}
                    </p>
                  </div>

                  {/* Payment Method */}
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 space-y-1">
                    <p className="text-xs font-bold text-slate-500 dark:text-slate-400">Payment Method</p>
                    <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-amber-500" />
                      <p className="font-bold text-sm text-slate-900 dark:text-white">Cash on Delivery (COD)</p>
                    </div>
                    <p className="text-[10px] text-slate-400">Pay when your order arrives at your door.</p>
                  </div>

                  {error && (
                    <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 text-xs text-red-600 dark:text-red-400 font-semibold">
                      {error}
                    </div>
                  )}

                  <button
                    onClick={handlePlaceOrder}
                    disabled={isPlacing}
                    className="w-full py-4 rounded-2xl font-extrabold text-base text-white shadow-lg flex items-center justify-center gap-2"
                    style={{ background: 'linear-gradient(135deg, #4C1D95, #7C3AED)' }}
                  >
                    {isPlacing ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        <ShoppingBag className="w-5 h-5" />
                        Place Order — ₹{total}
                      </>
                    )}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-4">
            <div className="p-5 rounded-3xl bg-white dark:bg-brand-darkSurface border border-indigo-100/70 dark:border-white/10 shadow-lg space-y-4 sticky top-6">
              <h3 className="font-bold text-base text-brand-primary dark:text-white">Order Summary</h3>
              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between text-slate-600 dark:text-slate-300">
                  <span>Subtotal ({items.length} items)</span>
                  <span>₹{subtotal}</span>
                </div>
                <div className="flex justify-between text-slate-600 dark:text-slate-300">
                  <span>Delivery Fee</span>
                  <span>₹{deliveryFee}</span>
                </div>
                <div className="flex justify-between font-extrabold text-base text-brand-primary dark:text-white border-t border-slate-100 dark:border-white/5 pt-2">
                  <span>Total</span>
                  <span>₹{total}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};
