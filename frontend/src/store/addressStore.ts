import { create } from 'zustand';
import { addressService, Address, CreateAddressPayload } from '../services/addressService';

interface AddressState {
  addresses: Address[];
  selectedAddress: Address | null;
  isLoading: boolean;
  error: string | null;

  fetchAddresses: () => Promise<void>;
  addAddress: (data: CreateAddressPayload) => Promise<Address>;
  updateAddress: (addressId: string, data: Partial<CreateAddressPayload>) => Promise<void>;
  deleteAddress: (addressId: string) => Promise<void>;
  setSelectedAddress: (address: Address | null) => void;
}

export const useAddressStore = create<AddressState>((set, get) => ({
  addresses: [],
  selectedAddress: null,
  isLoading: false,
  error: null,

  fetchAddresses: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await addressService.getMyAddresses();
      const addresses = res.data;
      const defaultAddr = addresses.find((a) => a.isDefault) ?? addresses[0] ?? null;
      set({ addresses, selectedAddress: defaultAddr, isLoading: false });
    } catch (err: any) {
      set({ isLoading: false, error: err.message });
    }
  },

  addAddress: async (data) => {
    const res = await addressService.createAddress(data);
    const newAddress = res.data;
    const current = get().addresses;
    set({ addresses: [...current, newAddress] });
    if (newAddress.isDefault || current.length === 0) {
      set({ selectedAddress: newAddress });
    }
    return newAddress;
  },

  updateAddress: async (addressId, data) => {
    const res = await addressService.updateAddress(addressId, data);
    const updated = res.data;
    set((state) => ({
      addresses: state.addresses.map((a) => (a.id === addressId ? updated : a)),
      selectedAddress: state.selectedAddress?.id === addressId ? updated : state.selectedAddress,
    }));
  },

  deleteAddress: async (addressId) => {
    await addressService.deleteAddress(addressId);
    set((state) => {
      const remaining = state.addresses.filter((a) => a.id !== addressId);
      const selected = state.selectedAddress?.id === addressId
        ? (remaining.find((a) => a.isDefault) ?? remaining[0] ?? null)
        : state.selectedAddress;
      return { addresses: remaining, selectedAddress: selected };
    });
  },

  setSelectedAddress: (address) => set({ selectedAddress: address }),
}));
