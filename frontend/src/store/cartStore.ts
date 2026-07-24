import { create } from 'zustand';

export interface CartItem {
  id: string;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  unit: string;
  image: string;
  storeName: string;
  storeDistance: string;
  deliveryTime: string;
  quantity: number;
}

export interface Address {
  id: string;
  label: string; // 'Home', 'Work', 'Other'
  addressLine: string;
  city: string;
  landmark?: string;
  isDefault?: boolean;
}

interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  addresses: Address[];
  selectedAddress: Address | null;
  paymentMethod: 'upi' | 'card' | 'cod';
  
  /* Cart actions */
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, delta: number) => void;
  clearCart: () => void;
  
  /* Checkout actions */
  setSelectedAddress: (address: Address) => void;
  setPaymentMethod: (method: 'upi' | 'card' | 'cod') => void;
  addAddress: (address: Omit<Address, 'id'>) => void;

  /* Calculated getters */
  getTotalItems: () => number;
  getSubtotal: () => number;
  getDeliveryFee: () => number;
  getConvenienceFee: () => number;
  getGrandTotal: () => number;
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  isOpen: false,
  addresses: [],
  selectedAddress: null,
  paymentMethod: 'upi',

  openCart: () => set({ isOpen: true }),
  closeCart: () => set({ isOpen: false }),
  toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

  addItem: (product) => {
    set((state) => {
      const existingIndex = state.items.findIndex((i) => i.id === product.id);
      if (existingIndex > -1) {
        const updated = [...state.items];
        updated[existingIndex].quantity += 1;
        return { items: updated, isOpen: true };
      }
      return { items: [...state.items, { ...product, quantity: 1 }], isOpen: true };
    });
  },

  removeItem: (id) => set((state) => ({ items: state.items.filter((i) => i.id !== id) })),

  updateQuantity: (id, delta) => {
    set((state) => {
      const updated = state.items
        .map((item) => {
          if (item.id === id) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[];
      return { items: updated };
    });
  },

  clearCart: () => set({ items: [] }),

  setSelectedAddress: (address) => set({ selectedAddress: address }),
  setPaymentMethod: (method) => set({ paymentMethod: method }),

  addAddress: (newAddr) => {
    const id = `addr-${Date.now()}`;
    const full = { ...newAddr, id };
    set((state) => ({
      addresses: [...state.addresses, full],
      selectedAddress: state.selectedAddress ? state.selectedAddress : full,
    }));
  },

  getTotalItems: () => get().items.reduce((acc, i) => acc + i.quantity, 0),
  getSubtotal: () => get().items.reduce((acc, i) => acc + i.price * i.quantity, 0),
  getDeliveryFee: () => (get().getSubtotal() > 500 || get().items.length === 0 ? 0 : 29),
  getConvenienceFee: () => (get().items.length > 0 ? 15 : 0),
  getGrandTotal: () => {
    const sub = get().getSubtotal();
    if (sub === 0) return 0;
    return sub + get().getDeliveryFee() + get().getConvenienceFee();
  },
}));
