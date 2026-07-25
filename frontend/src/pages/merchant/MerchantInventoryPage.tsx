import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Package, Plus, Trash2, Edit2, Loader2, Store, AlertCircle, Search
} from 'lucide-react';
import { useMerchantStore } from '../../store/merchantStore';
import { useProductStore } from '../../store/productStore';
import { Container } from '../../components/ui/Container';

export const MerchantInventoryPage: React.FC = () => {
  const { profile, selectedStore, inventory, isLoading, fetchProfile, fetchInventory, upsertInventory, deleteInventoryItem } = useMerchantStore();
  const { products, searchProducts } = useProductStore();

  const [showAddForm, setShowAddForm] = useState(false);
  const [productId, setProductId] = useState('');
  const [price, setPrice] = useState('');
  const [salePrice, setSalePrice] = useState('');
  const [stock, setStock] = useState('10');
  const [isAvailable, setIsAvailable] = useState(true);
  const [productSearch, setProductSearch] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProfile().then(() => {
      const store = useMerchantStore.getState().selectedStore;
      if (store) fetchInventory(store.id);
    });
    searchProducts({ limit: 50 });
  }, []);

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(productSearch.toLowerCase())
  );

  const handleAddInventory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStore || !productId || !price) return;
    setIsSaving(true);
    setError('');
    try {
      await upsertInventory(selectedStore.id, {
        productId,
        price: parseFloat(price),
        salePrice: salePrice ? parseFloat(salePrice) : undefined,
        stockQuantity: parseInt(stock),
        isAvailable,
      });
      setShowAddForm(false);
      setProductId('');
      setPrice('');
      setSalePrice('');
      setStock('10');
    } catch (err: any) {
      setError(err.message || 'Failed to save inventory item');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (itemId: string) => {
    if (!selectedStore) return;
    if (!confirm('Remove this item from inventory?')) return;
    await deleteInventoryItem(selectedStore.id, itemId);
  };

  if (!profile) {
    return (
      <div className="min-h-screen py-6" style={{ background: 'var(--page-bg)' }}>
        <Container size="lg">
          <div className="py-20 text-center space-y-3">
            <AlertCircle className="w-10 h-10 mx-auto text-amber-500" />
            <p className="font-bold text-slate-700 dark:text-slate-200">Please create a merchant profile first</p>
          </div>
        </Container>
      </div>
    );
  }

  if (!selectedStore) {
    return (
      <div className="min-h-screen py-6" style={{ background: 'var(--page-bg)' }}>
        <Container size="lg">
          <div className="py-20 text-center space-y-3">
            <Store className="w-10 h-10 mx-auto text-amber-500" />
            <p className="font-bold text-slate-700 dark:text-slate-200">Add a store location first before managing inventory</p>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-6" style={{ background: 'var(--page-bg)' }}>
      <Container size="xl" className="space-y-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="font-display font-extrabold text-3xl text-amber-900 dark:text-white">Inventory</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Managing: <strong>{selectedStore.name}</strong>
            </p>
          </div>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="px-4 py-2.5 rounded-2xl text-xs font-bold text-white flex items-center gap-2 shadow-md"
            style={{ background: 'linear-gradient(135deg, #B45309, #F59E0B)' }}
          >
            <Plus className="w-4 h-4" />
            Add Product
          </button>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 text-xs text-red-600 dark:text-red-400 font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />{error}
          </div>
        )}

        {/* Add Inventory Form */}
        {showAddForm && (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            onSubmit={handleAddInventory}
            className="p-5 rounded-2xl bg-white dark:bg-brand-darkSurface border border-amber-100/70 dark:border-white/10 shadow-lg space-y-4 overflow-hidden"
          >
            <h3 className="font-bold text-sm text-amber-900 dark:text-white">Add Product to Inventory</h3>

            {/* Product Search & Select */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-500">Select Product *</label>
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input value={productSearch} onChange={(e) => setProductSearch(e.target.value)} placeholder="Search WadiGo products..."
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-amber-400" />
              </div>
              {productSearch && (
                <div className="max-h-36 overflow-y-auto rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm">
                  {filteredProducts.slice(0, 10).map((p) => (
                    <div
                      key={p.id}
                      onClick={() => { setProductId(p.id); setProductSearch(p.name); }}
                      className={`px-3 py-2 cursor-pointer hover:bg-amber-50 dark:hover:bg-amber-950/40 text-xs flex items-center gap-2 ${productId === p.id ? 'bg-amber-100 dark:bg-amber-950/60 font-bold' : ''}`}
                    >
                      <Package className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="text-slate-900 dark:text-white truncate">{p.name}</span>
                      <span className="text-slate-400 shrink-0">{p.unit}</span>
                    </div>
                  ))}
                  {filteredProducts.length === 0 && (
                    <p className="px-3 py-2 text-xs text-slate-400">No products found. Ask admin to add products to the catalog first.</p>
                  )}
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500">Price (₹) *</label>
                <input required type="number" step="0.01" min="0" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="0.00"
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-amber-400" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500">Sale Price (₹)</label>
                <input type="number" step="0.01" min="0" value={salePrice} onChange={(e) => setSalePrice(e.target.value)} placeholder="Optional"
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-amber-400" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500">Stock Qty *</label>
                <input required type="number" min="0" value={stock} onChange={(e) => setStock(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-amber-400" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500">Available</label>
                <select value={isAvailable ? 'true' : 'false'} onChange={(e) => setIsAvailable(e.target.value === 'true')}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-amber-400">
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button type="button" onClick={() => setShowAddForm(false)} className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500">Cancel</button>
              <button type="submit" disabled={isSaving || !productId}
                className="px-5 py-2 rounded-xl text-xs font-bold text-white flex items-center gap-2"
                style={{ background: 'linear-gradient(135deg, #B45309, #F59E0B)' }}>
                {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
                Add to Inventory
              </button>
            </div>
          </motion.form>
        )}

        {/* Inventory Table */}
        {isLoading ? (
          <div className="py-16 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-amber-500" /></div>
        ) : inventory.length === 0 ? (
          <div className="py-16 text-center space-y-3 rounded-2xl bg-white dark:bg-brand-darkSurface border border-amber-100/70 dark:border-white/10 shadow-sm">
            <Package className="w-10 h-10 mx-auto text-slate-300" />
            <p className="font-bold text-slate-700 dark:text-slate-200">No inventory items yet</p>
            <p className="text-xs text-slate-400">Add products from the catalog to start selling.</p>
          </div>
        ) : (
          <div className="rounded-3xl bg-white dark:bg-brand-darkSurface border border-amber-100/70 dark:border-white/10 shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-amber-50 dark:border-white/5 bg-amber-50/80 dark:bg-slate-900/60">
                    <th className="px-4 py-3 text-left font-bold text-slate-500 dark:text-slate-400">Product</th>
                    <th className="px-4 py-3 text-right font-bold text-slate-500 dark:text-slate-400">Price</th>
                    <th className="px-4 py-3 text-right font-bold text-slate-500 dark:text-slate-400">Sale Price</th>
                    <th className="px-4 py-3 text-right font-bold text-slate-500 dark:text-slate-400">Stock</th>
                    <th className="px-4 py-3 text-center font-bold text-slate-500 dark:text-slate-400">Available</th>
                    <th className="px-4 py-3 text-center font-bold text-slate-500 dark:text-slate-400">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                  {inventory.map((item) => (
                    <tr key={item.id} className="hover:bg-amber-50/50 dark:hover:bg-white/3 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 overflow-hidden shrink-0">
                            {item.product.imageUrl ? (
                              <img src={item.product.imageUrl} alt={item.product.name} className="w-full h-full object-cover" />
                            ) : (
                              <Package className="w-4 h-4 m-2 text-slate-400" />
                            )}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 dark:text-white">{item.product.name}</p>
                            <p className="text-[10px] text-slate-400">{item.product.unit}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right font-bold text-slate-900 dark:text-white">₹{item.price}</td>
                      <td className="px-4 py-3 text-right text-amber-600 dark:text-amber-400 font-bold">{item.salePrice ? `₹${item.salePrice}` : '—'}</td>
                      <td className="px-4 py-3 text-right font-bold text-slate-900 dark:text-white">{item.stockQuantity}</td>
                      <td className="px-4 py-3 text-center">
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${item.isAvailable ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          {item.isAvailable ? 'Yes' : 'No'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-950 text-slate-400 hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </Container>
    </div>
  );
};
