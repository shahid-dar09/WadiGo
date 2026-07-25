import { AddressRepository } from '../repositories/address.repository.js';
import { ApiError } from '../utils/api-error.js';
import { CreateAddressInput, UpdateAddressInput } from '../schemas/address.schema.js';

export class AddressService {
  static async getMyAddresses(userId: string) {
    return AddressRepository.findByUserId(userId);
  }

  static async createAddress(userId: string, input: CreateAddressInput) {
    return AddressRepository.create(userId, {
      label: input.label,
      street: input.street,
      city: input.city,
      state: input.state,
      postalCode: input.postalCode,
      latitude: input.latitude,
      longitude: input.longitude,
      isDefault: input.isDefault,
    });
  }

  static async updateAddress(userId: string, addressId: string, input: UpdateAddressInput) {
    const address = await AddressRepository.findById(addressId);
    if (!address || address.userId !== userId) {
      throw ApiError.notFound('Address not found');
    }
    return AddressRepository.update(addressId, userId, input);
  }

  static async deleteAddress(userId: string, addressId: string) {
    const address = await AddressRepository.findById(addressId);
    if (!address || address.userId !== userId) {
      throw ApiError.notFound('Address not found');
    }
    await AddressRepository.delete(addressId);
    return { message: 'Address deleted successfully' };
  }
}
