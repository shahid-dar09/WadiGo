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
  items: [
    {
      id: 'prod-1',
      name: 'Organic Whole Milk 1L',
      category: 'Dairy',
      price: 65,
      originalPrice: 72,
      unit: '1L Pouch',
      image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400&auto=format&fit=crop&q=80',
      storeName: 'Fresh Mart (MG Road)',
      storeDistance: '0.6 km',
      deliveryTime: '8-12 mins',
      quantity: 2,
    },
    {
      id: 'prod-2',
      name: 'Hass Avocados (Pack of 2)',
      category: 'Produce',
      price: 180,
      originalPrice: 220,
      unit: '2 Pcs (Approx 350g)',
      image: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=400&auto=format&fit=crop&q=80',
      storeName: 'Green Basket Organics',
      storeDistance: '1.1 km',
      deliveryTime: '10-15 mins',
      quantity: 1,
    },
  ],
  isOpen: false,
  addresses: [
    {
      id: 'addr-1',
      label: 'Home',
      addressLine: 'Flat 402, Sunshine Heights, 12th Main',
      city: 'Indiranagar, Bengaluru',
      landmark: 'Near Metro Station',
      isDefault: true,
    },
    {
      id: 'addr-2',
      label: 'Work',
      addressLine: 'Tech Tower, 5th Floor, Outer Ring Road',
      city: 'Marathahalli, Bengaluru',
      landmark: 'Opposite Embassy Tech Village',
    },
  ],
  selectedAddress: {
    id: 'addr-1',
    label: 'Home',
    addressLine: 'Flat 402, Sunshine Heights, 12th Main',
    city: 'Indiranagar, Bengaluru',
    landmark: 'Near Metro Station',
    isDefault: true,
  },
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
