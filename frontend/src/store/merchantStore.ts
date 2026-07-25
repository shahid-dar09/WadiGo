import { create } from 'zustand';
import { merchantService, MerchantProfile, MerchantStore, InventoryItem } from '../services/merchantService';

interface MerchantState {
  profile: MerchantProfile | null;
  selectedStore: MerchantStore | null;
  inventory: InventoryItem[];
  orders: any[];
  isLoading: boolean;
  error: string | null;

  fetchProfile: () => Promise<void>;
  createProfile: (data: { businessName: string; contactEmail: string; contactPhone: string; businessRegNumber?: string }) => Promise<void>;
  updateProfile: (data: Partial<{ businessName: string; contactEmail: string; contactPhone: string }>) => Promise<void>;
  createStore: (data: Omit<MerchantStore, 'id' | 'isActive'>) => Promise<void>;
  setSelectedStore: (store: MerchantStore | null) => void;
  fetchInventory: (storeId: string) => Promise<void>;
  upsertInventory: (storeId: string, data: any) => Promise<void>;
  deleteInventoryItem: (storeId: string, itemId: string) => Promise<void>;
  fetchStoreOrders: (storeId: string, params?: { page?: number; limit?: number; status?: string }) => Promise<void>;
  updateOrderStatus: (orderId: string, status: string) => Promise<void>;
}

export const useMerchantStore = create<MerchantState>((set, get) => ({
  profile: null,
  selectedStore: null,
  inventory: [],
  orders: [],
  isLoading: false,
  error: null,

  fetchProfile: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await merchantService.getProfile();
      const profile = res.data;
      const firstStore = profile.stores?.[0] ?? null;
      set({ profile, selectedStore: firstStore, isLoading: false });
    } catch (err: any) {
      set({ isLoading: false, error: err.message });
    }
  },

  createProfile: async (data) => {
    set({ isLoading: true });
    try {
      const res = await merchantService.createProfile(data);
      set({ profile: res.data, isLoading: false });
    } catch (err: any) {
      set({ isLoading: false, error: err.message });
      throw err;
    }
  },

  updateProfile: async (data) => {
    set({ isLoading: true });
    try {
      const res = await merchantService.updateProfile(data);
      set({ profile: res.data, isLoading: false });
    } catch (err: any) {
      set({ isLoading: false, error: err.message });
      throw err;
    }
  },

  createStore: async (data) => {
    set({ isLoading: true });
    try {
      const res = await merchantService.createStore(data);
      const newStore = res.data;
      set((state) => ({
        profile: state.profile ? { ...state.profile, stores: [...state.profile.stores, newStore] } : state.profile,
        selectedStore: newStore,
        isLoading: false,
      }));
    } catch (err: any) {
      set({ isLoading: false, error: err.message });
      throw err;
    }
  },

  setSelectedStore: (store) => set({ selectedStore: store }),

  fetchInventory: async (storeId) => {
    set({ isLoading: true });
    try {
      const res = await merchantService.getInventory(storeId);
      set({ inventory: res.data, isLoading: false });
    } catch (err: any) {
      set({ isLoading: false, error: err.message });
    }
  },

  upsertInventory: async (storeId, data) => {
    const res = await merchantService.upsertInventory(storeId, data);
    const updated = res.data;
    set((state) => {
      const exists = state.inventory.find((i) => i.id === updated.id);
      return {
        inventory: exists
          ? state.inventory.map((i) => (i.id === updated.id ? updated : i))
          : [...state.inventory, updated],
      };
    });
  },

  deleteInventoryItem: async (storeId, itemId) => {
    await merchantService.deleteInventoryItem(storeId, itemId);
    set((state) => ({ inventory: state.inventory.filter((i) => i.id !== itemId) }));
  },

  fetchStoreOrders: async (storeId, params) => {
    set({ isLoading: true });
    try {
      const res = await merchantService.getStoreOrders(storeId, params);
      set({ orders: res.data, isLoading: false });
    } catch (err: any) {
      set({ isLoading: false, error: err.message });
    }
  },

  updateOrderStatus: async (orderId, status) => {
    await merchantService.updateOrderStatus(orderId, status);
    set((state) => ({
      orders: state.orders.map((o) => (o.id === orderId ? { ...o, status } : o)),
    }));
  },
}));
