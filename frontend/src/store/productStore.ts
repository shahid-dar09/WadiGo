import { create } from 'zustand';
import { productService, ProductListItem, ProductDetail, ProductSearchParams } from '../services/productService';
import { categoryService } from '../services/categoryService';
import type { CategoryItem } from '../services/categoryService';

interface ProductState {
  products: ProductListItem[];
  categories: CategoryItem[];
  selectedProduct: ProductDetail | null;
  isLoading: boolean;
  isLoadingProduct: boolean;
  meta: { total: number; page: number; limit: number; totalPages: number } | null;
  searchParams: ProductSearchParams;
  error: string | null;

  searchProducts: (params?: ProductSearchParams) => Promise<void>;
  loadMore: () => Promise<void>;
  getProductBySlug: (slug: string) => Promise<void>;
  loadCategories: () => Promise<void>;
  setSearchParams: (params: Partial<ProductSearchParams>) => void;
  clearSelectedProduct: () => void;
}

export const useProductStore = create<ProductState>((set, get) => ({
  products: [],
  categories: [],
  selectedProduct: null,
  isLoading: false,
  isLoadingProduct: false,
  meta: null,
  searchParams: { page: 1, limit: 20 },
  error: null,

  setSearchParams: (params) => {
    set((state) => ({ searchParams: { ...state.searchParams, ...params, page: 1 } }));
  },

  searchProducts: async (params) => {
    const merged = { ...get().searchParams, ...params };
    set({ isLoading: true, error: null, searchParams: merged });
    try {
      const res = await productService.search(merged);
      set({ products: res.data, meta: res.meta, isLoading: false });
    } catch (err: any) {
      set({ isLoading: false, error: err.message || 'Failed to load products' });
    }
  },

  loadMore: async () => {
    const { meta, searchParams, products } = get();
    if (!meta || meta.page >= meta.totalPages) return;
    const nextPage = meta.page + 1;
    set({ isLoading: true });
    try {
      const res = await productService.search({ ...searchParams, page: nextPage });
      set({
        products: [...products, ...res.data],
        meta: res.meta,
        searchParams: { ...searchParams, page: nextPage },
        isLoading: false,
      });
    } catch (err: any) {
      set({ isLoading: false, error: err.message });
    }
  },

  getProductBySlug: async (slug) => {
    set({ isLoadingProduct: true, selectedProduct: null, error: null });
    try {
      const res = await productService.getBySlug(slug);
      set({ selectedProduct: res.data, isLoadingProduct: false });
    } catch (err: any) {
      set({ isLoadingProduct: false, error: err.message || 'Product not found' });
    }
  },

  loadCategories: async () => {
    try {
      const res = await categoryService.getAll();
      set({ categories: res.data });
    } catch { /* silent */ }
  },

  clearSelectedProduct: () => set({ selectedProduct: null }),
}));
