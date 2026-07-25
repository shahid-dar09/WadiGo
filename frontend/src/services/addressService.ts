import api from './api';
import type { ApiResponse } from '../types';

export interface Address {
  id: string;
  userId: string;
  label: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  latitude: number;
  longitude: number;
  isDefault: boolean;
}

export interface CreateAddressPayload {
  label: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  latitude?: number;
  longitude?: number;
  isDefault?: boolean;
}

export const addressService = {
  async getMyAddresses(): Promise<ApiResponse<Address[]>> {
    return api.get('/addresses');
  },

  async createAddress(data: CreateAddressPayload): Promise<ApiResponse<Address>> {
    return api.post('/addresses', data);
  },

  async updateAddress(addressId: string, data: Partial<CreateAddressPayload>): Promise<ApiResponse<Address>> {
    return api.patch(`/addresses/${addressId}`, data);
  },

  async deleteAddress(addressId: string): Promise<ApiResponse<null>> {
    return api.delete(`/addresses/${addressId}`);
  },
};
