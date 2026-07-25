import { MerchantRepository } from '../repositories/merchant.repository.js';
import { UserRepository } from '../repositories/user.repository.js';
import { ApiError } from '../utils/api-error.js';
import {
  CreateMerchantProfileInput,
  CreateStoreInput,
  UpdateStoreInput,
  UpsertInventoryInput,
} from '../schemas/merchant.schema.js';
import { MerchantStatus } from '@prisma/client';

export class MerchantService {
  static async getMyProfile(userId: string) {
    const profile = await MerchantRepository.findProfileByUserId(userId);
    if (!profile) {
      throw ApiError.notFound('Merchant profile not found. Please create your profile first.');
    }
    return profile;
  }

  static async createProfile(userId: string, input: CreateMerchantProfileInput) {
    const existing = await MerchantRepository.findProfileByUserId(userId);
    if (existing) {
      throw ApiError.badRequest('Merchant profile already exists');
    }

    // Assign MERCHANT role to this user
    const user = await UserRepository.findById(userId);
    if (!user) throw ApiError.notFound('User not found');

    return MerchantRepository.createProfile(userId, input);
  }

  static async updateProfile(userId: string, input: Partial<CreateMerchantProfileInput>) {
    const profile = await MerchantRepository.findProfileByUserId(userId);
    if (!profile) throw ApiError.notFound('Merchant profile not found');
    return MerchantRepository.updateProfile(profile.id, input);
  }

  static async createStore(userId: string, input: CreateStoreInput) {
    const profile = await MerchantRepository.findProfileByUserId(userId);
    if (!profile) throw ApiError.notFound('Merchant profile not found');

    if (profile.status !== MerchantStatus.APPROVED) {
      throw ApiError.forbidden('Your merchant account must be approved before adding stores');
    }

    return MerchantRepository.createStore(profile.id, input);
  }

  static async updateStore(userId: string, storeId: string, input: UpdateStoreInput) {
    const profile = await MerchantRepository.findProfileByUserId(userId);
    if (!profile) throw ApiError.notFound('Merchant profile not found');

    const store = await MerchantRepository.findStoreById(storeId);
    if (!store || store.merchantId !== profile.id) {
      throw ApiError.forbidden('Store not found or access denied');
    }

    return MerchantRepository.updateStore(storeId, input);
  }

  static async getStoreInventory(userId: string, storeId: string) {
    const profile = await MerchantRepository.findProfileByUserId(userId);
    if (!profile) throw ApiError.notFound('Merchant profile not found');

    const store = await MerchantRepository.findStoreById(storeId);
    if (!store || store.merchantId !== profile.id) {
      throw ApiError.forbidden('Store not found or access denied');
    }

    return store.inventory;
  }

  static async upsertInventory(userId: string, storeId: string, input: UpsertInventoryInput) {
    const profile = await MerchantRepository.findProfileByUserId(userId);
    if (!profile) throw ApiError.notFound('Merchant profile not found');

    const store = await MerchantRepository.findStoreById(storeId);
    if (!store || store.merchantId !== profile.id) {
      throw ApiError.forbidden('Store not found or access denied');
    }

    return MerchantRepository.upsertInventoryItem({
      storeId,
      productId: input.productId,
      variantId: input.variantId,
      price: input.price,
      salePrice: input.salePrice,
      stockQuantity: input.stockQuantity,
      isAvailable: input.isAvailable,
    });
  }

  static async deleteInventoryItem(userId: string, storeId: string, itemId: string) {
    const profile = await MerchantRepository.findProfileByUserId(userId);
    if (!profile) throw ApiError.notFound('Merchant profile not found');

    const store = await MerchantRepository.findStoreById(storeId);
    if (!store || store.merchantId !== profile.id) {
      throw ApiError.forbidden('Store not found or access denied');
    }

    return MerchantRepository.deleteInventoryItem(itemId);
  }
}
