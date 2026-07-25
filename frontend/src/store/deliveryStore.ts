import { create } from 'zustand';
import { deliveryService } from '../services/deliveryService';

interface DeliveryState {
  availableOrders: any[];
  activeOrder: any | null;
  isLoading: boolean;
  error: string | null;

  fetchAvailableOrders: () => Promise<void>;
  fetchOrderById: (orderId: string) => Promise<void>;
  updateOrderStatus: (orderId: string, status: string, notes?: string) => Promise<void>;
  setActiveOrder: (order: any | null) => void;
}

export const useDeliveryStore = create<DeliveryState>((set) => ({
  availableOrders: [],
  activeOrder: null,
  isLoading: false,
  error: null,

  fetchAvailableOrders: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await deliveryService.getAvailableOrders();
      set({ availableOrders: res.data, isLoading: false });
    } catch (err: any) {
      set({ isLoading: false, error: err.message });
    }
  },

  fetchOrderById: async (orderId) => {
    set({ isLoading: true });
    try {
      const res = await deliveryService.getOrderById(orderId);
      set({ activeOrder: res.data, isLoading: false });
    } catch (err: any) {
      set({ isLoading: false, error: err.message });
    }
  },

  updateOrderStatus: async (orderId, status, notes) => {
    await deliveryService.updateOrderStatus(orderId, status, notes);
    set((state) => ({
      availableOrders: state.availableOrders.filter((o) => o.id !== orderId),
      activeOrder: state.activeOrder?.id === orderId ? { ...state.activeOrder, status } : state.activeOrder,
    }));
  },

  setActiveOrder: (order) => set({ activeOrder: order }),
}));
