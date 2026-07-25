import api from './api';
import type { ApiResponse } from '../types';

export interface OrderItem {
  id: string;
  productId: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  product: { id: string; name: string; imageUrl: string | null; unit: string };
  store: { id: string; name: string };
}

export interface Order {
  id: string;
  orderNumber: string;
  status: string;
  paymentStatus: string;
  paymentMethod: string;
  totalAmount: number;
  deliveryFee: number;
  finalAmount: number;
  notes: string | null;
  createdAt: string;
  items: OrderItem[];
  history: Array<{ status: string; notes: string | null; createdAt: string }>;
}

export const orderService = {
  async placeOrder(data: { addressId: string; notes?: string; paymentMethod: 'COD' }): Promise<ApiResponse<Order>> {
    return api.post('/orders', data);
  },

  async getMyOrders(page = 1, limit = 10): Promise<ApiResponse<Order[]>> {
    return api.get(`/orders/me?page=${page}&limit=${limit}`);
  },

  async getOrderById(orderId: string): Promise<ApiResponse<Order>> {
    return api.get(`/orders/${orderId}`);
  },
};
