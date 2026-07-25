import api from './api';
import type { ApiResponse } from '../types';

export const adminService = {
  async getOverview(): Promise<ApiResponse<any>> {
    return api.get('/admin/overview');
  },

  async getAllUsers(page = 1, limit = 20, role?: string): Promise<ApiResponse<any[]>> {
    const q = new URLSearchParams({ page: String(page), limit: String(limit) });
    if (role) q.set('role', role);
    return api.get(`/admin/users?${q.toString()}`);
  },

  async setUserActive(userId: string, isActive: boolean): Promise<ApiResponse<any>> {
    return api.patch(`/admin/users/${userId}/status`, { isActive });
  },

  async getAllMerchants(page = 1, limit = 20, status?: string): Promise<ApiResponse<any[]>> {
    const q = new URLSearchParams({ page: String(page), limit: String(limit) });
    if (status) q.set('status', status);
    return api.get(`/admin/merchants?${q.toString()}`);
  },

  async approveMerchant(merchantId: string): Promise<ApiResponse<any>> {
    return api.patch(`/admin/merchants/${merchantId}/approve`, {});
  },

  async suspendMerchant(merchantId: string): Promise<ApiResponse<any>> {
    return api.patch(`/admin/merchants/${merchantId}/suspend`, {});
  },

  async rejectMerchant(merchantId: string): Promise<ApiResponse<any>> {
    return api.patch(`/admin/merchants/${merchantId}/reject`, {});
  },

  async getAllOrders(page = 1, limit = 20, status?: string): Promise<ApiResponse<any[]>> {
    const q = new URLSearchParams({ page: String(page), limit: String(limit) });
    if (status) q.set('status', status);
    return api.get(`/orders?${q.toString()}`);
  },
};
