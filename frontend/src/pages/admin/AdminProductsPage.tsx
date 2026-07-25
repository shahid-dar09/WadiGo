import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Package, Plus, Search, Edit2, Loader2, CheckCircle2, AlertCircle,
  FolderPlus, Image as ImageIcon, Filter, Sparkles, X, Layers
} from 'lucide-react';
import { productService, ProductListItem, CategoryItem } from '../../services/productService';
import { Container } from '../../components/ui/Container';

const PRESET_IMAGES = [
  { label: 'Fresh Milk', url: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&w=400&q=80' },
  { label: 'Red Apples', url: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=400&q=80' },
  { label: 'Fresh Bread', url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=400&q=80' },
  { label: 'Olive Oil', url: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=400&q=80' },
  { label: 'Organic Eggs', url: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?auto=format&fit=crop&w=400&q=80' },
  { label: 'Fresh Tomatoes', url: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=400&q=80' },
];

export const AdminProductsPage: React.FC = () => {
  const [products, setProducts] = useState<ProductListItem[]>([]);
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  const [activeTab, setActiveTab] = useState<'products' | 'categories'>('products');

  // Modals
  const [editingProduct, setEditingProduct] = useState<ProductListItem | null>(null);
  const [showCreateProduct, setShowCreateProduct] = useState(false);
  const [showCreateCategory, setShowCreateCategory] = useState(false);

  // Form fields
  const [name, setName] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [unit, setUnit] = useState('piece');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  // Category form fields
  const [catName, setCatName] = useState('');
  const [catDescription, setCatDescription] = useState('');

  const [isSaving, setIsSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const loadCatalogData = async () => {
    setIsLoading(true);
    try {
      const [prodRes, catRes] = await Promise.all([
        productService.search({ limit: 100 }),
        productService.getCategories(),
      ]);
      setProducts(prodRes.data || []);
      setCategories(catRes.data || []);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to load catalog');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCatalogData();
  }, []);

  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = !selectedCategory || p.category?.id === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const openEditModal = (product: ProductListItem) => {
    setEditingProduct(product);
    setName(product.name);
    setCategoryId(product.category?.id || (categories[0]?.id ?? ''));
    setUnit(product.unit || 'piece');
    setDescription(product.description || '');
    setImageUrl(product.imageUrl || '');
    setErrorMsg('');
  };

  const handleUpdateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    setIsSaving(true);
    setErrorMsg('');

    try {
      await productService.updateProduct(editingProduct.id, {
        name: name.trim(),
        categoryId,
        unit: unit.trim(),
        description: description.trim(),
        imageUrl: imageUrl.trim(),
      });

      setSuccessMsg(`Product "${name}" updated successfully!`);
      setEditingProduct(null);
      loadCatalogData();
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to update product');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !categoryId) {
      setErrorMsg('Product name and category are required');
      return;
    }
    setIsSaving(true);
    setErrorMsg('');

    try {
      await productService.createProduct({
        name: name.trim(),
        categoryId,
        unit: unit.trim() || 'piece',
        description: description.trim() || undefined,
        imageUrl: imageUrl.trim() || undefined,
      });

      setSuccessMsg(`New catalog product "${name}" created!`);
      setShowCreateProduct(false);
      setName('');
      setDescription('');
      setImageUrl('');
      loadCatalogData();
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to create product');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!catName.trim()) { setErrorMsg('Category name is required'); return; }
    setIsSaving(true);
    setErrorMsg('');

    try {
      await productService.createCategory({
        name: catName.trim(),
        description: catDescription.trim() || undefined,
      });

      setSuccessMsg(`Category "${catName}" created successfully!`);
      setShowCreateCategory(false);
      setCatName('');
      setCatDescription('');
      loadCatalogData();
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to create category');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen py-8 bg-slate-50 dark:bg-brand-darkBg select-none">
      <Container size="xl" className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-display font-extrabold text-3xl text-slate-900 dark:text-white">Catalog Governance</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Manage global products, categories, and inventory definitions across WadiGo.
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => { setShowCreateCategory(true); setErrorMsg(''); }}
              className="px-4 py-2.5 rounded-2xl text-xs font-bold text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/5 flex items-center gap-1.5 transition-all"
            >
              <FolderPlus className="w-4 h-4 text-indigo-500" /> Add Category
            </button>
            <button
              onClick={() => { setShowCreateProduct(true); setErrorMsg(''); setCategoryId(categories[0]?.id || ''); }}
              className="px-4 py-2.5 rounded-2xl text-xs font-bold text-white flex items-center gap-2 shadow-md hover:opacity-95 transition-all"
              style={{ background: 'linear-gradient(135deg, #1E1B4B, #4C1D95)' }}
            >
              <Plus className="w-4 h-4" /> Create Product
            </button>
          </div>
        </div>

        {successMsg && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </motion.div>
        )}

        {errorMsg && (
          <div className="p-3.5 rounded-2xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 text-xs text-red-600 dark:text-red-400 font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Tab & Search Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-3xl bg-white dark:bg-brand-darkSurface border border-slate-200 dark:border-white/10 shadow-sm">
          <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-semibold w-full sm:w-auto">
            <button
              onClick={() => setActiveTab('products')}
              className={`px-4 py-2 rounded-lg transition-all ${activeTab === 'products' ? 'bg-indigo-950 text-white font-bold shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900'}`}
            >
              📦 Catalog Products ({products.length})
            </button>
            <button
              onClick={() => setActiveTab('categories')}
              className={`px-4 py-2 rounded-lg transition-all ${activeTab === 'categories' ? 'bg-indigo-950 text-white font-bold shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900'}`}
            >
              📁 Categories ({categories.length})
            </button>
          </div>

          {activeTab === 'products' && (
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products..."
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="">All Categories</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Content Body */}
        {isLoading ? (
          <div className="py-20 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-indigo-600" /></div>
        ) : activeTab === 'products' ? (
          <div className="rounded-3xl bg-white dark:bg-brand-darkSurface border border-slate-200 dark:border-white/10 shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-white/5 bg-slate-50 dark:bg-slate-900/60">
                    <th className="px-5 py-3.5 text-left font-bold text-slate-500 dark:text-slate-400">Product</th>
                    <th className="px-5 py-3.5 text-left font-bold text-slate-500 dark:text-slate-400">Category</th>
                    <th className="px-5 py-3.5 text-left font-bold text-slate-500 dark:text-slate-400">Unit</th>
                    <th className="px-5 py-3.5 text-center font-bold text-slate-500 dark:text-slate-400">Active Stores</th>
                    <th className="px-5 py-3.5 text-center font-bold text-slate-500 dark:text-slate-400">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                  {filteredProducts.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50 dark:hover:bg-white/3 transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 overflow-hidden shrink-0">
                            {p.imageUrl ? (
                              <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover" />
                            ) : (
                              <Package className="w-5 h-5 m-2.5 text-slate-400" />
                            )}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 dark:text-white text-xs">{p.name}</p>
                            <p className="text-[10px] text-slate-400 truncate max-w-xs">{p.description || 'No description'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-300">
                          {p.category?.name || 'Uncategorized'}
                        </span>
                      </td>
                      <td className="px-5 py-4 font-semibold text-slate-700 dark:text-slate-300">{p.unit}</td>
                      <td className="px-5 py-4 text-center font-bold text-slate-900 dark:text-white">{p.availableMerchantsCount} stores</td>
                      <td className="px-5 py-4 text-center">
                        <button
                          onClick={() => openEditModal(p)}
                          className="px-3 py-1.5 rounded-xl border border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 text-xs font-bold flex items-center gap-1.5 mx-auto"
                        >
                          <Edit2 className="w-3.5 h-3.5" /> Edit Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          /* Categories Tab */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((c) => (
              <div key={c.id} className="p-5 rounded-3xl bg-white dark:bg-brand-darkSurface border border-slate-200 dark:border-white/10 shadow-md space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                    <Layers className="w-4 h-4 text-indigo-500" /> {c.name}
                  </h3>
                  <span className="text-[10px] text-slate-400 font-mono">slug: {c.slug}</span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">{c.description || 'Global product category'}</p>
              </div>
            ))}
          </div>
        )}

        {/* Edit Product Modal */}
        <AnimatePresence>
          {editingProduct && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
              <motion.form
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                onSubmit={handleUpdateProduct}
                className="max-w-lg w-full p-6 rounded-3xl bg-white dark:bg-brand-darkSurface border border-slate-200 dark:border-white/10 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto"
              >
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/5 pb-3">
                  <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                    <Edit2 className="w-4 h-4 text-indigo-500" /> Edit Catalog Product
                  </h3>
                  <button type="button" onClick={() => setEditingProduct(null)} className="text-slate-400 hover:text-slate-600">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Product Name *</label>
                    <input
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Category *</label>
                      <select
                        required
                        value={categoryId}
                        onChange={(e) => setCategoryId(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                      >
                        {categories.map((c) => (
                          <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Unit *</label>
                      <input
                        required
                        value={unit}
                        onChange={(e) => setUnit(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Description</label>
                    <textarea
                      rows={2}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 resize-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Product Image URL</label>
                    <input
                      type="url"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                    />
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {PRESET_IMAGES.map((p) => (
                        <button key={p.label} type="button" onClick={() => setImageUrl(p.url)}
                          className="px-2 py-0.5 rounded text-[9px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                          {p.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-3 border-t border-slate-100 dark:border-white/5">
                  <button type="button" onClick={() => setEditingProduct(null)} className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500">Cancel</button>
                  <button type="submit" disabled={isSaving} className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-indigo-900 hover:bg-indigo-950 flex items-center gap-2">
                    {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Save Changes'}
                  </button>
                </div>
              </motion.form>
            </div>
          )}
        </AnimatePresence>

        {/* Create Product Modal */}
        <AnimatePresence>
          {showCreateProduct && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
              <motion.form
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                onSubmit={handleCreateProduct}
                className="max-w-lg w-full p-6 rounded-3xl bg-white dark:bg-brand-darkSurface border border-slate-200 dark:border-white/10 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto"
              >
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/5 pb-3">
                  <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                    <Plus className="w-4 h-4 text-indigo-500" /> Create Catalog Product
                  </h3>
                  <button type="button" onClick={() => setShowCreateProduct(false)} className="text-slate-400 hover:text-slate-600">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Product Name *</label>
                    <input required value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Fresh Organic Tomatoes 1kg"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500" />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Category *</label>
                      <select required value={categoryId} onChange={(e) => setCategoryId(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500">
                        {categories.map((c) => (
                          <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Unit *</label>
                      <input required value={unit} onChange={(e) => setUnit(e.target.value)} placeholder="e.g. 1 kg, 500ml, piece"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500" />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Description</label>
                    <textarea rows={2} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Product description..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 resize-none" />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Image URL</label>
                    <input type="url" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="https://..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500" />
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {PRESET_IMAGES.map((p) => (
                        <button key={p.label} type="button" onClick={() => setImageUrl(p.url)}
                          className="px-2 py-0.5 rounded text-[9px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                          {p.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-3 border-t border-slate-100 dark:border-white/5">
                  <button type="button" onClick={() => setShowCreateProduct(false)} className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500">Cancel</button>
                  <button type="submit" disabled={isSaving} className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-indigo-900 hover:bg-indigo-950 flex items-center gap-2">
                    {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Create Product'}
                  </button>
                </div>
              </motion.form>
            </div>
          )}
        </AnimatePresence>

        {/* Create Category Modal */}
        <AnimatePresence>
          {showCreateCategory && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
              <motion.form
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                onSubmit={handleCreateCategory}
                className="max-w-md w-full p-6 rounded-3xl bg-white dark:bg-brand-darkSurface border border-slate-200 dark:border-white/10 shadow-2xl space-y-4"
              >
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/5 pb-3">
                  <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                    <FolderPlus className="w-4 h-4 text-indigo-500" /> Create Product Category
                  </h3>
                  <button type="button" onClick={() => setShowCreateCategory(false)} className="text-slate-400 hover:text-slate-600">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Category Name *</label>
                    <input required value={catName} onChange={(e) => setCatName(e.target.value)} placeholder="e.g. Frozen Foods"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Description</label>
                    <textarea rows={2} value={catDescription} onChange={(e) => setCatDescription(e.target.value)} placeholder="Category summary..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 resize-none" />
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-3 border-t border-slate-100 dark:border-white/5">
                  <button type="button" onClick={() => setShowCreateCategory(false)} className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500">Cancel</button>
                  <button type="submit" disabled={isSaving} className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-indigo-900 hover:bg-indigo-950 flex items-center gap-2">
                    {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Create Category'}
                  </button>
                </div>
              </motion.form>
            </div>
          )}
        </AnimatePresence>
      </Container>
    </div>
  );
};
