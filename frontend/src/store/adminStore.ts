import { create } from 'zustand';
import { adminService } from '../services/adminService';

interface AdminState {
  overview: any | null;
  users: any[];
  merchants: any[];
  orders: any[];
  isLoading: boolean;
  error: string | null;
  meta: { total: number; page: number; limit: number; totalPages: number } | null;

  fetchOverview: () => Promise<void>;
  fetchUsers: (page?: number, role?: string) => Promise<void>;
  setUserActive: (userId: string, isActive: boolean) => Promise<void>;
  fetchMerchants: (page?: number, status?: string) => Promise<void>;
  approveMerchant: (merchantId: string) => Promise<void>;
  suspendMerchant: (merchantId: string) => Promise<void>;
  rejectMerchant: (merchantId: string) => Promise<void>;
  fetchOrders: (page?: number, status?: string) => Promise<void>;
}

export const useAdminStore = create<AdminState>((set) => ({
  overview: null,
  users: [],
  merchants: [],
  orders: [],
  isLoading: false,
  error: null,
  meta: null,

  fetchOverview: async () => {
    set({ isLoading: true });
    try {
      const res = await adminService.getOverview();
      set({ overview: res.data, isLoading: false });
    } catch (err: any) {
      set({ isLoading: false, error: err.message });
    }
  },

  fetchUsers: async (page = 1, role) => {
    set({ isLoading: true });
    try {
      const res = await adminService.getAllUsers(page, 20, role);
      set({ users: res.data, meta: res.meta, isLoading: false });
    } catch (err: any) {
      set({ isLoading: false, error: err.message });
    }
  },

  setUserActive: async (userId, isActive) => {
    await adminService.setUserActive(userId, isActive);
    set((state) => ({
      users: state.users.map((u) => (u.id === userId ? { ...u, isActive } : u)),
    }));
  },

  fetchMerchants: async (page = 1, status) => {
    set({ isLoading: true });
    try {
      const res = await adminService.getAllMerchants(page, 20, status);
      set({ merchants: res.data, meta: res.meta, isLoading: false });
    } catch (err: any) {
      set({ isLoading: false, error: err.message });
    }
  },

  approveMerchant: async (merchantId) => {
    await adminService.approveMerchant(merchantId);
    set((state) => ({
      merchants: state.merchants.map((m) => (m.id === merchantId ? { ...m, status: 'APPROVED' } : m)),
    }));
  },

  suspendMerchant: async (merchantId) => {
    await adminService.suspendMerchant(merchantId);
    set((state) => ({
      merchants: state.merchants.map((m) => (m.id === merchantId ? { ...m, status: 'SUSPENDED' } : m)),
    }));
  },

  rejectMerchant: async (merchantId) => {
    await adminService.rejectMerchant(merchantId);
    set((state) => ({
      merchants: state.merchants.map((m) => (m.id === merchantId ? { ...m, status: 'REJECTED' } : m)),
    }));
  },

  fetchOrders: async (page = 1, status) => {
    set({ isLoading: true });
    try {
      const res = await adminService.getAllOrders(page, 20, status);
      set({ orders: res.data, meta: res.meta, isLoading: false });
    } catch (err: any) {
      set({ isLoading: false, error: err.message });
    }
  },
}));
