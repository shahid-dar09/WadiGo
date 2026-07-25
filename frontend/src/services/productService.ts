import api from './api';
import type { ApiResponse } from '../types';

export interface ProductSearchParams {
  query?: string;
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  limit?: number;
}

export interface ProductListItem {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  imageUrl: string | null;
  unit: string;
  category: { id: string; name: string; slug: string };
  minPrice: number | null;
  maxPrice: number | null;
  availableMerchantsCount: number;
  reviewCount: number;
  isAvailable: boolean;
}

export interface ProductDetail extends ProductListItem {
  variants: Array<{ id: string; name: string; sku: string }>;
  inventory: Array<{
    price: number;
    salePrice: number | null;
    stockQuantity: number;
    storeId: string;
    store: {
      id: string;
      name: string;
      address: string;
      latitude: number;
      longitude: number;
      prepTimeMinutes: number;
      merchant: { businessName: string; rating: number };
    };
  }>;
  reviews: Array<{
    id: string;
    rating: number;
    comment: string | null;
    createdAt: string;
    user: { name: string; avatarUrl: string | null };
  }>;
}

export const productService = {
  async search(params: ProductSearchParams): Promise<ApiResponse<ProductListItem[]>> {
    const query = new URLSearchParams();
    if (params.query) query.set('query', params.query);
    if (params.categoryId) query.set('categoryId', params.categoryId);
    if (params.minPrice !== undefined) query.set('minPrice', String(params.minPrice));
    if (params.maxPrice !== undefined) query.set('maxPrice', String(params.maxPrice));
    if (params.page) query.set('page', String(params.page));
    if (params.limit) query.set('limit', String(params.limit));
    return api.get(`/products?${query.toString()}`);
  },

  async getBySlug(slug: string): Promise<ApiResponse<ProductDetail>> {
    return api.get(`/products/${slug}`);
  },
};
