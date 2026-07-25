import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Filter, SlidersHorizontal, Package, X,
  ChevronDown, Tag, Sparkles, Loader2
} from 'lucide-react';
import { useProductStore } from '../../store/productStore';
import { useCartStore } from '../../store/cartStore';
import { Container } from '../../components/ui/Container';

const SORT_OPTIONS = ['Relevance', 'Price: Low to High', 'Price: High to Low'];

export const ProductCatalogPage: React.FC = () => {
  const navigate = useNavigate();
  const { products, categories, isLoading, meta, searchParams, searchProducts, loadMore, loadCategories, setSearchParams } = useProductStore();
  const { addItem } = useCartStore();

  const [query, setQuery] = useState(searchParams.query ?? '');
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(searchParams.categoryId);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState(0);
  const [addingId, setAddingId] = useState<string | null>(null);

  useEffect(() => {
    loadCategories();
    searchProducts({ query: '', page: 1 });
  }, []);

  const handleSearch = () => {
    searchProducts({ query, categoryId: selectedCategory, page: 1 });
  };

  const handleCategorySelect = (id?: string) => {
    setSelectedCategory(id);
    searchProducts({ query, categoryId: id, page: 1 });
  };

  const handleAddToCart = async (e: React.MouseEvent, product: any) => {
    e.stopPropagation();
    if (!product.isAvailable) return;
    setAddingId(product.id);
    try {
      await addItem(product.id, 1);
    } finally {
      setAddingId(null);
    }
  };

  const sortedProducts = [...products].sort((a, b) => {
    if (sortBy === 1) return (a.minPrice ?? 0) - (b.minPrice ?? 0);
    if (sortBy === 2) return (b.minPrice ?? 0) - (a.minPrice ?? 0);
    return 0;
  });

  return (
    <div className="min-h-screen page-bg">
      <Container size="xl" className="py-6 space-y-6">
        {/* Header */}
        <div>
          <span className="section-badge text-xs mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            Product Catalog
          </span>
          <h1 className="font-display font-extrabold text-3xl text-brand-primary dark:text-white">
            Browse Products
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Search across thousands of products from local stores near you.
          </p>
        </div>

        {/* Search Bar */}
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search products (e.g. milk, bread, rice...)"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="w-full pl-10 pr-4 py-3 rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-brand-darkSurface text-sm text-slate-900 dark:text-white focus:outline-none focus:border-brand-secondary dark:focus:border-brand-rose shadow-sm"
            />
          </div>
          <button
            onClick={handleSearch}
            className="px-5 py-3 rounded-2xl font-bold text-sm text-white shadow-md"
            style={{ background: 'linear-gradient(135deg, #4C1D95, #7C3AED)' }}
          >
            Search
          </button>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`px-4 py-3 rounded-2xl border font-bold text-xs flex items-center gap-2 transition-colors ${
              showFilters
                ? 'bg-brand-secondary dark:bg-brand-rose text-white border-transparent'
                : 'border-slate-200 dark:border-white/10 bg-white dark:bg-brand-darkSurface text-slate-600 dark:text-slate-300'
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span className="hidden sm:inline">Filters</span>
          </button>
        </div>

        {/* Filters Panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="p-5 rounded-2xl bg-white dark:bg-brand-darkSurface border border-indigo-100/70 dark:border-white/10 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                    <Filter className="w-4 h-4 text-brand-secondary" />
                    Filter & Sort
                  </h3>
                  <button
                    onClick={() => { setSelectedCategory(undefined); setQuery(''); searchProducts({ query: '', categoryId: undefined, page: 1 }); }}
                    className="text-xs text-red-500 hover:text-red-700 font-semibold"
                  >
                    Clear All
                  </button>
                </div>

                {/* Sort */}
                <div className="mb-4">
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2">Sort By</p>
                  <div className="flex gap-2 flex-wrap">
                    {SORT_OPTIONS.map((opt, i) => (
                      <button
                        key={opt}
                        onClick={() => setSortBy(i)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                          sortBy === i
                            ? 'bg-brand-secondary dark:bg-brand-rose text-white border-transparent'
                            : 'border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:border-brand-secondary'
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Category Filter */}
                {categories.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2">Category</p>
                    <div className="flex gap-2 flex-wrap">
                      <button
                        onClick={() => handleCategorySelect(undefined)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                          !selectedCategory
                            ? 'bg-brand-secondary dark:bg-brand-rose text-white border-transparent'
                            : 'border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300'
                        }`}
                      >
                        All
                      </button>
                      {categories.map((cat) => (
                        <button
                          key={cat.id}
                          onClick={() => handleCategorySelect(cat.id)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                            selectedCategory === cat.id
                              ? 'bg-brand-secondary dark:bg-brand-rose text-white border-transparent'
                              : 'border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300'
                          }`}
                        >
                          {cat.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Meta info */}
        {meta && (
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Showing <strong className="text-slate-900 dark:text-white">{products.length}</strong> of {meta.total} products</span>
            {searchParams.query && (
              <button
                onClick={() => { setQuery(''); searchProducts({ query: '', categoryId: selectedCategory, page: 1 }); }}
                className="flex items-center gap-1 text-red-500 hover:text-red-700 font-semibold"
              >
                <X className="w-3.5 h-3.5" />
                Clear search
              </button>
            )}
          </div>
        )}

        {/* Products Grid */}
        {isLoading && products.length === 0 ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center space-y-3">
              <Loader2 className="w-8 h-8 animate-spin mx-auto text-brand-secondary dark:text-brand-rose" />
              <p className="text-sm text-slate-500 dark:text-slate-400">Loading products...</p>
            </div>
          </div>
        ) : sortedProducts.length === 0 ? (
          <div className="py-16 text-center space-y-3 rounded-2xl bg-white dark:bg-brand-darkSurface border border-slate-200/60 dark:border-white/5">
            <Package className="w-10 h-10 mx-auto text-slate-400" />
            <p className="font-bold text-slate-700 dark:text-slate-200">No products found</p>
            <p className="text-xs text-slate-400">Try a different search term or category. Merchants need to add inventory for products to appear.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {sortedProducts.map((product) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -2, scale: 1.01 }}
                onClick={() => navigate(`/products/${product.slug}`)}
                className="bg-white dark:bg-brand-darkSurface rounded-2xl border border-slate-200/70 dark:border-white/10 overflow-hidden shadow-sm hover:shadow-md cursor-pointer transition-all"
              >
                {/* Product Image */}
                <div className="aspect-square bg-slate-100 dark:bg-slate-800 relative overflow-hidden">
                  {product.imageUrl ? (
                    <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Package className="w-10 h-10 text-slate-300 dark:text-slate-600" />
                    </div>
                  )}
                  {!product.isAvailable && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <span className="text-white text-xs font-bold bg-red-500 px-2 py-1 rounded-full">Out of Stock</span>
                    </div>
                  )}
                  {product.availableMerchantsCount > 1 && (
                    <div className="absolute top-2 left-2 px-1.5 py-0.5 rounded-full bg-green-500 text-white text-[9px] font-bold">
                      {product.availableMerchantsCount} stores
                    </div>
                  )}
                </div>

                <div className="p-3 space-y-2">
                  <div>
                    <p className="font-bold text-xs text-slate-900 dark:text-white line-clamp-2 leading-tight">{product.name}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">{product.unit} · {product.category.name}</p>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      {product.minPrice !== null ? (
                        <span className="font-extrabold text-sm text-brand-primary dark:text-white">
                          ₹{product.minPrice}
                        </span>
                      ) : (
                        <span className="text-xs text-slate-400">Price varies</span>
                      )}
                    </div>
                    <button
                      onClick={(e) => handleAddToCart(e, product)}
                      disabled={!product.isAvailable || addingId === product.id}
                      className={`px-2.5 py-1.5 rounded-lg text-[10px] font-bold transition-all ${
                        !product.isAvailable
                          ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                          : 'bg-brand-secondary dark:bg-brand-rose text-white hover:opacity-90'
                      }`}
                    >
                      {addingId === product.id ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      ) : 'Add'}
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Load More */}
        {meta && meta.page < meta.totalPages && (
          <div className="flex justify-center pt-4">
            <button
              onClick={loadMore}
              disabled={isLoading}
              className="px-6 py-3 rounded-2xl font-bold text-sm border border-brand-secondary dark:border-brand-rose text-brand-secondary dark:text-brand-rose hover:bg-brand-secondary/5 transition-colors flex items-center gap-2"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ChevronDown className="w-4 h-4" />}
              Load More Products
            </button>
          </div>
        )}
      </Container>
    </div>
  );
};
