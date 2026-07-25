import React, { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft, Package, Star, Clock, Store, ShoppingBag,
  Loader2, MapPin, ShieldCheck, Zap
} from 'lucide-react';
import { useProductStore } from '../../store/productStore';
import { useCartStore } from '../../store/cartStore';
import { Container } from '../../components/ui/Container';

export const ProductDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { selectedProduct, isLoadingProduct, error, getProductBySlug, clearSelectedProduct } = useProductStore();
  const { addItem } = useCartStore();
  const [addingStoreId, setAddingStoreId] = React.useState<string | null>(null);

  useEffect(() => {
    if (slug) getProductBySlug(slug);
    return () => clearSelectedProduct();
  }, [slug]);

  const handleAddToCart = async (storeId?: string) => {
    if (!selectedProduct) return;
    setAddingStoreId(storeId ?? 'default');
    try {
      await addItem(selectedProduct.id, 1);
    } finally {
      setAddingStoreId(null);
    }
  };

  if (isLoadingProduct) {
    return (
      <div className="min-h-screen page-bg flex items-center justify-center">
        <div className="text-center space-y-3">
          <Loader2 className="w-10 h-10 animate-spin mx-auto text-brand-secondary dark:text-brand-rose" />
          <p className="text-sm text-slate-500 dark:text-slate-400">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (error || !selectedProduct) {
    return (
      <div className="min-h-screen page-bg flex items-center justify-center">
        <div className="text-center space-y-4">
          <Package className="w-12 h-12 mx-auto text-slate-300" />
          <h2 className="font-bold text-lg text-slate-700 dark:text-slate-200">Product Not Found</h2>
          <Link to="/products" className="text-sm text-brand-secondary dark:text-brand-rose font-bold">
            ← Back to Products
          </Link>
        </div>
      </div>
    );
  }

  const product = selectedProduct;
  const cheapestInventory = [...product.inventory].sort(
    (a, b) => (a.salePrice ?? a.price) - (b.salePrice ?? b.price)
  );

  return (
    <div className="min-h-screen page-bg py-6">
      <Container size="lg" className="space-y-6">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 hover:text-brand-secondary dark:hover:text-brand-rose font-semibold transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Products
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left: Product Image & Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-5 space-y-5"
          >
            {/* Product Image */}
            <div className="aspect-square bg-white dark:bg-brand-darkSurface rounded-3xl border border-indigo-100/70 dark:border-white/10 overflow-hidden shadow-lg flex items-center justify-center">
              {product.imageUrl ? (
                <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
              ) : (
                <div className="flex flex-col items-center gap-3 text-slate-300">
                  <Package className="w-16 h-16" />
                  <span className="text-xs font-medium">No image available</span>
                </div>
              )}
            </div>

            {/* Product Info Card */}
            <div className="p-6 rounded-3xl bg-white dark:bg-brand-darkSurface border border-indigo-100/70 dark:border-white/10 shadow-lg space-y-4">
              <div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 dark:bg-white/10 text-indigo-700 dark:text-indigo-300">
                  {product.category.name}
                </span>
                <h1 className="font-display font-extrabold text-2xl text-brand-primary dark:text-white mt-2">
                  {product.name}
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Per {product.unit}</p>
              </div>

              {product.description && (
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{product.description}</p>
              )}

              <div className="flex items-center gap-4 pt-2 border-t border-slate-100 dark:border-white/5">
                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                  <Store className="w-3.5 h-3.5" />
                  <span>{product.inventory.length} stores available</span>
                </div>
                {product.reviewCount > 0 && (
                  <div className="flex items-center gap-1 text-xs text-amber-500">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span className="font-bold">{product.reviewCount} reviews</span>
                  </div>
                )}
              </div>

              {/* Quick Add */}
              {cheapestInventory.length > 0 && (
                <button
                  onClick={() => handleAddToCart()}
                  disabled={addingStoreId !== null}
                  className="w-full py-3.5 rounded-2xl font-bold text-sm text-white shadow-lg flex items-center justify-center gap-2"
                  style={{ background: 'linear-gradient(135deg, #4C1D95, #7C3AED)' }}
                >
                  {addingStoreId ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" />
                      Add to Cart — ₹{cheapestInventory[0].salePrice ?? cheapestInventory[0].price}
                    </>
                  )}
                </button>
              )}
            </div>
          </motion.div>

          {/* Right: Store Availability */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-7 space-y-5"
          >
            <div className="p-6 rounded-3xl bg-white dark:bg-brand-darkSurface border border-indigo-100/70 dark:border-white/10 shadow-lg">
              <h2 className="font-display font-extrabold text-xl text-brand-primary dark:text-white mb-1">
                Available at Nearby Stores
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-5">
                WadiGo selects the best store for fastest & cheapest delivery.
              </p>

              {cheapestInventory.length === 0 ? (
                <div className="py-10 text-center space-y-2">
                  <Package className="w-8 h-8 mx-auto text-slate-300" />
                  <p className="text-xs font-bold text-slate-500 dark:text-slate-400">Currently out of stock at all stores</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {cheapestInventory.map((inv, idx) => (
                    <div
                      key={inv.storeId}
                      className={`p-4 rounded-2xl border transition-all ${
                        idx === 0
                          ? 'border-brand-secondary dark:border-brand-rose bg-indigo-50/50 dark:bg-indigo-950/30'
                          : 'border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-slate-900/40'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <Store className={`w-4 h-4 ${idx === 0 ? 'text-brand-secondary dark:text-brand-rose' : 'text-slate-400'}`} />
                            <span className="font-bold text-sm text-slate-900 dark:text-white">{inv.store.name}</span>
                            {idx === 0 && (
                              <span className="px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-300 flex items-center gap-1">
                                <Zap className="w-2.5 h-2.5" /> Best Price
                              </span>
                            )}
                          </div>
                          <p className="text-[10px] text-slate-400 pl-6">{inv.store.merchant.businessName}</p>
                          <div className="flex items-center gap-3 pl-6">
                            <span className="flex items-center gap-1 text-[10px] text-slate-500">
                              <Clock className="w-3 h-3" />
                              {inv.store.prepTimeMinutes} min prep
                            </span>
                            <span className="flex items-center gap-1 text-[10px] text-amber-500">
                              <Star className="w-3 h-3 fill-current" />
                              {inv.store.merchant.rating.toFixed(1)}
                            </span>
                            <span className="text-[10px] text-slate-400">
                              Stock: {inv.stockQuantity}
                            </span>
                          </div>
                        </div>
                        <div className="text-right space-y-1">
                          {inv.salePrice && (
                            <p className="text-[10px] text-slate-400 line-through">₹{inv.price}</p>
                          )}
                          <p className="font-extrabold text-lg text-brand-primary dark:text-white">
                            ₹{inv.salePrice ?? inv.price}
                          </p>
                          <button
                            onClick={() => handleAddToCart(inv.storeId)}
                            disabled={addingStoreId !== null || inv.stockQuantity === 0}
                            className="px-3 py-1.5 rounded-xl text-xs font-bold text-white transition-all disabled:opacity-50"
                            style={{ background: 'linear-gradient(135deg, #4C1D95, #7C3AED)' }}
                          >
                            {addingStoreId === inv.storeId ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Add'}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Reviews */}
            {product.reviews && product.reviews.length > 0 && (
              <div className="p-6 rounded-3xl bg-white dark:bg-brand-darkSurface border border-indigo-100/70 dark:border-white/10 shadow-lg space-y-4">
                <h3 className="font-display font-extrabold text-lg text-brand-primary dark:text-white">
                  Customer Reviews
                </h3>
                <div className="space-y-3">
                  {product.reviews.slice(0, 5).map((review) => (
                    <div key={review.id} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 space-y-1">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white" style={{ background: 'linear-gradient(135deg, #7C3AED, #F43F5E)' }}>
                          {review.user.name[0].toUpperCase()}
                        </div>
                        <span className="font-semibold text-xs text-slate-900 dark:text-white">{review.user.name}</span>
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`w-3 h-3 ${i < review.rating ? 'text-amber-400 fill-current' : 'text-slate-300'}`} />
                          ))}
                        </div>
                      </div>
                      {review.comment && <p className="text-xs text-slate-600 dark:text-slate-300 pl-8">{review.comment}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </Container>
    </div>
  );
};
