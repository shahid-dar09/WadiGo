import api from './api';
import type { ApiResponse } from '../types';

export interface CartItemDetail {
  id: string;
  productId: string;
  productName: string;
  imageUrl: string | null;
  unit: string;
  quantity: number;
  price: number;
  storeId?: string;
  isAvailable: boolean;
  variant: { id: string; name: string } | null;
}

export interface Cart {
  cartId: string;
  items: CartItemDetail[];
  subtotal: number;
  deliveryFee: number;
  total: number;
}

export const cartService = {
  async getCart(): Promise<ApiResponse<Cart>> {
    return api.get('/cart');
  },

  async addItem(data: { productId: string; variantId?: string; quantity: number }): Promise<ApiResponse<Cart>> {
    return api.post('/cart/items', data);
  },

  async updateItem(itemId: string, quantity: number): Promise<ApiResponse<Cart>> {
    return api.patch(`/cart/items/${itemId}`, { quantity });
  },

  async removeItem(itemId: string): Promise<ApiResponse<Cart>> {
    return api.delete(`/cart/items/${itemId}`);
  },

  async clearCart(): Promise<ApiResponse<null>> {
    return api.delete('/cart');
  },
};
