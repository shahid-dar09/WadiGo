import { create } from 'zustand';
import { cartService, CartItemDetail } from '../services/cartService';

// UI-local types still used by CartDrawer
export interface CartItem {
  id: string;
  productId: string;
  productName: string;
  imageUrl: string | null;
  unit: string;
  quantity: number;
  price: number;
  storeId?: string;
  isAvailable: boolean;
}

interface CartStore {
  items: CartItemDetail[];
  isOpen: boolean;
  subtotal: number;
  deliveryFee: number;
  total: number;
  isLoading: boolean;

  /* UI actions */
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;

  /* API actions */
  fetchCart: () => Promise<void>;
  addItem: (productId: string, quantity?: number, variantId?: string) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;

  /* Getters */
  getTotalItems: () => number;
  getSubtotal: () => number;
  getDeliveryFee: () => number;
  getGrandTotal: () => number;
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  isOpen: false,
  subtotal: 0,
  deliveryFee: 0,
  total: 0,
  isLoading: false,

  openCart: () => set({ isOpen: true }),
  closeCart: () => set({ isOpen: false }),
  toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

  fetchCart: async () => {
    const token = localStorage.getItem('wadigo_access_token');
    if (!token) return;
    set({ isLoading: true });
    try {
      const res = await cartService.getCart();
      set({
        items: res.data.items,
        subtotal: res.data.subtotal,
        deliveryFee: res.data.deliveryFee,
        total: res.data.total,
        isLoading: false,
      });
    } catch {
      set({ isLoading: false });
    }
  },

  addItem: async (productId, quantity = 1, variantId) => {
    set({ isLoading: true });
    try {
      const res = await cartService.addItem({ productId, quantity, variantId });
      set({
        items: res.data.items,
        subtotal: res.data.subtotal,
        deliveryFee: res.data.deliveryFee,
        total: res.data.total,
        isOpen: true,
        isLoading: false,
      });
    } catch {
      set({ isLoading: false });
    }
  },

  updateQuantity: async (itemId, quantity) => {
    set({ isLoading: true });
    try {
      const res = await cartService.updateItem(itemId, quantity);
      set({
        items: res.data.items,
        subtotal: res.data.subtotal,
        deliveryFee: res.data.deliveryFee,
        total: res.data.total,
        isLoading: false,
      });
    } catch {
      set({ isLoading: false });
    }
  },

  removeItem: async (itemId) => {
    set({ isLoading: true });
    try {
      const res = await cartService.removeItem(itemId);
      set({
        items: res.data.items,
        subtotal: res.data.subtotal,
        deliveryFee: res.data.deliveryFee,
        total: res.data.total,
        isLoading: false,
      });
    } catch {
      set({ isLoading: false });
    }
  },

  clearCart: async () => {
    await cartService.clearCart();
    set({ items: [], subtotal: 0, deliveryFee: 0, total: 0 });
  },

  getTotalItems: () => get().items.reduce((acc, i) => acc + i.quantity, 0),
  getSubtotal: () => get().subtotal,
  getDeliveryFee: () => get().deliveryFee,
  getGrandTotal: () => get().total,
}));
