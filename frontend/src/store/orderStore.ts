import { create } from 'zustand';
import { orderService, Order } from '../services/orderService';

interface OrderState {
  orders: Order[];
  selectedOrder: Order | null;
  isLoading: boolean;
  isPlacing: boolean;
  meta: { total: number; page: number; limit: number; totalPages: number } | null;
  error: string | null;

  fetchMyOrders: (page?: number) => Promise<void>;
  fetchOrderById: (orderId: string) => Promise<void>;
  placeOrder: (data: { addressId: string; notes?: string; paymentMethod: 'COD' }) => Promise<Order>;
  clearSelectedOrder: () => void;
}

export const useOrderStore = create<OrderState>((set) => ({
  orders: [],
  selectedOrder: null,
  isLoading: false,
  isPlacing: false,
  meta: null,
  error: null,

  fetchMyOrders: async (page = 1) => {
    set({ isLoading: true, error: null });
    try {
      const res = await orderService.getMyOrders(page);
      set({ orders: res.data, meta: res.meta, isLoading: false });
    } catch (err: any) {
      set({ isLoading: false, error: err.message || 'Failed to load orders' });
    }
  },

  fetchOrderById: async (orderId) => {
    set({ isLoading: true, error: null });
    try {
      const res = await orderService.getOrderById(orderId);
      set({ selectedOrder: res.data, isLoading: false });
    } catch (err: any) {
      set({ isLoading: false, error: err.message || 'Order not found' });
    }
  },

  placeOrder: async (data) => {
    set({ isPlacing: true, error: null });
    try {
      const res = await orderService.placeOrder(data);
      set({ isPlacing: false });
      return res.data;
    } catch (err: any) {
      set({ isPlacing: false, error: err.message || 'Failed to place order' });
      throw err;
    }
  },

  clearSelectedOrder: () => set({ selectedOrder: null }),
}));
