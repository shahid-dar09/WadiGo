import api from './api';
import type { ApiResponse } from '../types';

export interface MerchantProfile {
  id: string;
  businessName: string;
  contactEmail: string;
  contactPhone: string;
  status: 'PENDING' | 'APPROVED' | 'SUSPENDED' | 'REJECTED';
  rating: number;
  stores: MerchantStore[];
}

export interface MerchantStore {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  radiusKm: number;
  prepTimeMinutes: number;
  isActive: boolean;
}

export interface InventoryItem {
  id: string;
  productId: string;
  variantId: string | null;
  price: number;
  salePrice: number | null;
  stockQuantity: number;
  isAvailable: boolean;
  product: { id: string; name: string; imageUrl: string | null; unit: string; category?: { id: string; name: string } };
}

export const merchantService = {
  async getProfile(): Promise<ApiResponse<MerchantProfile>> {
    return api.get('/merchant/profile');
  },

  async createProfile(data: {
    businessName: string;
    contactEmail: string;
    contactPhone: string;
    businessRegNumber?: string;
  }): Promise<ApiResponse<MerchantProfile>> {
    return api.post('/merchant/profile', data);
  },

  async updateProfile(data: Partial<{ businessName: string; contactEmail: string; contactPhone: string }>): Promise<ApiResponse<MerchantProfile>> {
    return api.patch('/merchant/profile', data);
  },

  async createStore(data: {
    name: string;
    address: string;
    latitude: number;
    longitude: number;
    radiusKm?: number;
    prepTimeMinutes?: number;
  }): Promise<ApiResponse<MerchantStore>> {
    return api.post('/merchant/stores', data);
  },

  async updateStore(storeId: string, data: Partial<MerchantStore>): Promise<ApiResponse<MerchantStore>> {
    return api.patch(`/merchant/stores/${storeId}`, data);
  },

  async getInventory(storeId: string): Promise<ApiResponse<InventoryItem[]>> {
    return api.get(`/merchant/stores/${storeId}/inventory`);
  },

  async upsertInventory(storeId: string, data: {
    productId: string;
    price: number;
    stockQuantity: number;
    isAvailable: boolean;
    salePrice?: number;
    variantId?: string;
  }): Promise<ApiResponse<InventoryItem>> {
    return api.post(`/merchant/stores/${storeId}/inventory`, data);
  },

  async deleteInventoryItem(storeId: string, itemId: string): Promise<ApiResponse<null>> {
    return api.delete(`/merchant/stores/${storeId}/inventory/${itemId}`);
  },

  async getStoreOrders(storeId: string, params?: { page?: number; limit?: number; status?: string }): Promise<ApiResponse<any[]>> {
    const q = new URLSearchParams();
    if (params?.page) q.set('page', String(params.page));
    if (params?.limit) q.set('limit', String(params.limit));
    if (params?.status) q.set('status', params.status);
    return api.get(`/merchant/stores/${storeId}/orders?${q.toString()}`);
  },

  async updateOrderStatus(orderId: string, status: string): Promise<ApiResponse<any>> {
    return api.patch(`/merchant/orders/${orderId}/status`, { status });
  },
};
