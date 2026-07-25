import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Package, Plus, Trash2, Edit2, Loader2, Store, AlertCircle, Search,
  Image as ImageIcon, Sparkles, CheckCircle2, ListFilter
} from 'lucide-react';
import { useMerchantStore } from '../../store/merchantStore';
import { useProductStore } from '../../store/productStore';
import { productService, CategoryItem } from '../../services/productService';
import { Container } from '../../components/ui/Container';

const PRESET_IMAGES = [
  { label: 'Fresh Milk', url: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&w=400&q=80' },
  { label: 'Red Apples', url: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=400&q=80' },
  { label: 'Fresh Bread', url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=400&q=80' },
  { label: 'Olive Oil', url: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=400&q=80' },
  { label: 'Organic Eggs', url: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?auto=format&fit=crop&w=400&q=80' },
  { label: 'Fresh Tomatoes', url: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=400&q=80' },
];

export const MerchantInventoryPage: React.FC = () => {
  const { profile, selectedStore, inventory, isLoading, fetchProfile, fetchInventory, upsertInventory, deleteInventoryItem } = useMerchantStore();
  const { products, searchProducts } = useProductStore();

  const [showAddForm, setShowAddForm] = useState(false);
  const [addMode, setAddMode] = useState<'createNew' | 'pickExisting'>('createNew');

  // Categories
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(false);

  // New Product Form State
  const [name, setName] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [unit, setUnit] = useState('piece');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  // Common Inventory Form State
  const [productId, setProductId] = useState('');
  const [price, setPrice] = useState('');
  const [salePrice, setSalePrice] = useState('');
  const [stock, setStock] = useState('10');
  const [isAvailable, setIsAvailable] = useState(true);
  const [productSearch, setProductSearch] = useState('');

  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchProfile().then(() => {
      const store = useMerchantStore.getState().selectedStore;
      if (store) fetchInventory(store.id);
    });
    searchProducts({ limit: 50 });

    // Fetch categories for product creation
    setLoadingCategories(true);
    productService.getCategories()
      .then((res) => {
        setCategories(res.data || []);
        if (res.data && res.data.length > 0) {
          setCategoryId(res.data[0].id);
        }
      })
      .catch(() => {})
      .finally(() => setLoadingCategories(false));
  }, []);

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(productSearch.toLowerCase())
  );

  const resetForm = () => {
    setName('');
    setUnit('piece');
    setDescription('');
    setImageUrl('');
    setProductId('');
    setPrice('');
    setSalePrice('');
    setStock('10');
    setIsAvailable(true);
    setProductSearch('');
    setError('');
  };

  const handleCreateAndAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStore) return;
    if (!name.trim()) { setError('Product name is required'); return; }
    if (!categoryId) { setError('Category selection is required'); return; }
    if (!price || parseFloat(price) <= 0) { setError('Valid selling price is required'); return; }

    setIsSaving(true);
    setError('');

    try {
      let targetProductId = productId;

      if (addMode === 'createNew') {
        // Step 1: Create Product in Catalog
        const newProductRes = await productService.createProduct({
          categoryId,
          name: name.trim(),
          unit: unit.trim() || 'piece',
          description: description.trim() || undefined,
          imageUrl: imageUrl.trim() || undefined,
        });
        targetProductId = newProductRes.data.id;
      }

      if (!targetProductId) {
        throw new Error('Please select or create a valid product');
      }

      // Step 2: Add Product to Merchant Store Inventory
      await upsertInventory(selectedStore.id, {
        productId: targetProductId,
        price: parseFloat(price),
        salePrice: salePrice ? parseFloat(salePrice) : undefined,
        stockQuantity: parseInt(stock) || 0,
        isAvailable,
      });

      setSuccess(`Product "${name || 'Item'}" added to store inventory successfully!`);
      setShowAddForm(false);
      resetForm();
      fetchInventory(selectedStore.id);
      setTimeout(() => setSuccess(''), 4000);
    } catch (err: any) {
      setError(err.message || 'Failed to add product to inventory');
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
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-display font-extrabold text-3xl text-amber-900 dark:text-white">Store Inventory</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Managing products & stock for: <strong className="text-amber-700 dark:text-amber-300">{selectedStore.name}</strong>
            </p>
          </div>
          <button
            onClick={() => { setShowAddForm(!showAddForm); resetForm(); }}
            className="px-4 py-2.5 rounded-2xl text-xs font-bold text-white flex items-center gap-2 shadow-md hover:opacity-95 transition-all self-start sm:self-auto"
            style={{ background: 'linear-gradient(135deg, #B45309, #F59E0B)' }}
          >
            <Plus className="w-4 h-4" />
            {showAddForm ? 'Close Form' : 'Add New Product'}
          </button>
        </div>

        {success && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{success}</span>
          </motion.div>
        )}

        {error && (
          <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 text-xs text-red-600 dark:text-red-400 font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Add Product Form */}
        {showAddForm && (
          <motion.form
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            onSubmit={handleCreateAndAddProduct}
            className="p-6 rounded-3xl bg-white dark:bg-brand-darkSurface border border-amber-100/70 dark:border-white/10 shadow-xl space-y-6"
          >
            <div className="flex items-center justify-between border-b border-amber-50 dark:border-white/5 pb-4">
              <div>
                <h3 className="font-bold text-base text-amber-900 dark:text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  Add Product to {selectedStore.name}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">Create a brand new product entry or pick from global catalog.</p>
              </div>

              {/* Mode Tabs */}
              <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => { setAddMode('createNew'); resetForm(); }}
                  className={`px-3 py-1.5 rounded-lg transition-all ${addMode === 'createNew' ? 'bg-amber-600 text-white font-bold shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900'}`}
                >
                  ➕ Create New Product
                </button>
                <button
                  type="button"
                  onClick={() => { setAddMode('pickExisting'); resetForm(); }}
                  className={`px-3 py-1.5 rounded-lg transition-all ${addMode === 'pickExisting' ? 'bg-amber-600 text-white font-bold shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900'}`}
                >
                  🔍 Pick Catalog Item
                </button>
              </div>
            </div>

            {addMode === 'createNew' ? (
              /* Create New Product Details Form */
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* Name */}
                  <div className="space-y-1 sm:col-span-2">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Product Name *</label>
                    <input
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Fresh Organic Strawberries 500g"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  {/* Category */}
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Category *</label>
                    <select
                      required
                      value={categoryId}
                      onChange={(e) => setCategoryId(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                    >
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>

                  {/* Unit */}
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Unit / Quantity *</label>
                    <input
                      required
                      value={unit}
                      onChange={(e) => setUnit(e.target.value)}
                      placeholder="e.g. 1 kg, 500g, 1 Litre, piece"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  {/* Price */}
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Selling Price (₹) *</label>
                    <input
                      required
                      type="number"
                      step="0.01"
                      min="0"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder="e.g. 120"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  {/* Sale Price */}
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Sale Price (₹ Optional)</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={salePrice}
                      onChange={(e) => setSalePrice(e.target.value)}
                      placeholder="e.g. 99"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  {/* Stock */}
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Stock Quantity *</label>
                    <input
                      required
                      type="number"
                      min="0"
                      value={stock}
                      onChange={(e) => setStock(e.target.value)}
                      placeholder="10"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  {/* Availability */}
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Availability</label>
                    <select
                      value={isAvailable ? 'true' : 'false'}
                      onChange={(e) => setIsAvailable(e.target.value === 'true')}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                    >
                      <option value="true">In Stock (Available)</option>
                      <option value="false">Out of Stock</option>
                    </select>
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Description</label>
                  <textarea
                    rows={2}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Brief description of your product..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-amber-500 resize-none"
                  />
                </div>

                {/* Product Image URL & Preview */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                    <span>Product Image URL</span>
                    <span className="text-[10px] text-slate-400">Direct image link or pick a preset below</span>
                  </label>
                  <div className="flex gap-3 items-center">
                    <input
                      type="url"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      placeholder="https://images.unsplash.com/photo-..."
                      className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                    />
                    <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center shrink-0 overflow-hidden">
                      {imageUrl ? (
                        <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" onError={(e) => { (e.target as any).src = ''; }} />
                      ) : (
                        <ImageIcon className="w-5 h-5 text-slate-400" />
                      )}
                    </div>
                  </div>

                  {/* Preset Image Quick Selector */}
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <span className="text-[10px] font-bold text-slate-400">Quick Presets:</span>
                    {PRESET_IMAGES.map((preset) => (
                      <button
                        key={preset.label}
                        type="button"
                        onClick={() => setImageUrl(preset.url)}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold border transition-all ${imageUrl === preset.url ? 'bg-amber-100 text-amber-800 border-amber-300 font-bold' : 'bg-slate-100 dark:bg-white/5 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200'}`}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              /* Pick Existing Catalog Item Form */
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-500">Select Existing Catalog Product *</label>
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                    <input
                      value={productSearch}
                      onChange={(e) => setProductSearch(e.target.value)}
                      placeholder="Search WadiGo products by name..."
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>
                  {productSearch && (
                    <div className="max-h-40 overflow-y-auto rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm divide-y divide-slate-100 dark:divide-white/5">
                      {filteredProducts.slice(0, 10).map((p) => (
                        <div
                          key={p.id}
                          onClick={() => { setProductId(p.id); setName(p.name); setProductSearch(p.name); setImageUrl(p.imageUrl || ''); }}
                          className={`px-3.5 py-2.5 cursor-pointer hover:bg-amber-50 dark:hover:bg-amber-950/40 text-xs flex items-center gap-3 ${productId === p.id ? 'bg-amber-100 dark:bg-amber-950/60 font-bold' : ''}`}
                        >
                          <div className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-700 overflow-hidden shrink-0">
                            {p.imageUrl ? <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover" /> : <Package className="w-3.5 h-3.5 m-1.5 text-slate-400" />}
                          </div>
                          <span className="text-slate-900 dark:text-white truncate flex-1">{p.name}</span>
                          <span className="text-[10px] text-slate-400 shrink-0">{p.unit}</span>
                        </div>
                      ))}
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
              </div>
            )}

            {/* Buttons */}
            <div className="flex justify-end gap-3 pt-2 border-t border-slate-100 dark:border-white/5">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSaving || (addMode === 'pickExisting' && !productId)}
                className="px-6 py-2.5 rounded-xl text-xs font-bold text-white flex items-center gap-2 shadow-md hover:opacity-95 transition-all"
                style={{ background: 'linear-gradient(135deg, #B45309, #F59E0B)' }}
              >
                {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                {addMode === 'createNew' ? 'Create & Add to Store' : 'Add to Store'}
              </button>
            </div>
          </motion.form>
        )}

        {/* Inventory Table */}
        {isLoading ? (
          <div className="py-16 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-amber-500" /></div>
        ) : inventory.length === 0 ? (
          <div className="py-16 text-center space-y-3 rounded-3xl bg-white dark:bg-brand-darkSurface border border-amber-100/70 dark:border-white/10 shadow-sm">
            <Package className="w-12 h-12 mx-auto text-slate-300" />
            <p className="font-bold text-slate-700 dark:text-slate-200 text-base">No inventory items in store yet</p>
            <p className="text-xs text-slate-400">Click "Add New Product" above to create and add items to your store.</p>
          </div>
        ) : (
          <div className="rounded-3xl bg-white dark:bg-brand-darkSurface border border-amber-100/70 dark:border-white/10 shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-amber-50 dark:border-white/5 bg-amber-50/80 dark:bg-slate-900/60">
                    <th className="px-4 py-3.5 text-left font-bold text-slate-500 dark:text-slate-400">Product</th>
                    <th className="px-4 py-3.5 text-right font-bold text-slate-500 dark:text-slate-400">Price</th>
                    <th className="px-4 py-3.5 text-right font-bold text-slate-500 dark:text-slate-400">Sale Price</th>
                    <th className="px-4 py-3.5 text-right font-bold text-slate-500 dark:text-slate-400">Stock Qty</th>
                    <th className="px-4 py-3.5 text-center font-bold text-slate-500 dark:text-slate-400">Available</th>
                    <th className="px-4 py-3.5 text-center font-bold text-slate-500 dark:text-slate-400">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                  {inventory.map((item) => (
                    <tr key={item.id} className="hover:bg-amber-50/50 dark:hover:bg-white/3 transition-colors">
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 overflow-hidden shrink-0">
                            {item.product?.imageUrl ? (
                              <img
                                src={item.product.imageUrl}
                                alt={item.product?.name || 'Product'}
                                className="w-full h-full object-cover"
                                onError={(e) => { (e.target as any).src = ''; }}
                              />
                            ) : (
                              <Package className="w-4 h-4 m-2.5 text-slate-400" />
                            )}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 dark:text-white text-xs">
                              {item.product?.name || 'Unnamed Product'}
                            </p>
                            <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-0.5">
                              <span>Unit: {item.product?.unit || 'piece'}</span>
                              {item.product?.category?.name && (
                                <>
                                  <span>•</span>
                                  <span className="text-amber-600 dark:text-amber-400 font-medium">{item.product.category.name}</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 text-right font-bold text-slate-900 dark:text-white">₹{item.price}</td>
                      <td className="px-4 py-3.5 text-right text-amber-600 dark:text-amber-400 font-bold">{item.salePrice ? `₹${item.salePrice}` : '—'}</td>
                      <td className="px-4 py-3.5 text-right font-bold text-slate-900 dark:text-white">{item.stockQuantity}</td>
                      <td className="px-4 py-3.5 text-center">
                        <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold ${item.isAvailable ? 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300' : 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300'}`}>
                          {item.isAvailable ? 'In Stock' : 'Out of Stock'}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-center">
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-950 text-slate-400 hover:text-red-500 transition-colors"
                          title="Remove item"
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
