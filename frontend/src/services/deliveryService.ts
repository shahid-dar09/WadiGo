import api from './api';
import type { ApiResponse } from '../types';

export const deliveryService = {
  async getAvailableOrders(page = 1, limit = 20): Promise<ApiResponse<any[]>> {
    return api.get(`/delivery/orders/available?page=${page}&limit=${limit}`);
  },

  async getOrderById(orderId: string): Promise<ApiResponse<any>> {
    return api.get(`/delivery/orders/${orderId}`);
  },

  async updateOrderStatus(orderId: string, status: string, notes?: string): Promise<ApiResponse<any>> {
    return api.patch(`/delivery/orders/${orderId}/status`, { status, notes });
  },
};
