import { prisma } from '../config/prisma.js';
import { MerchantStatus } from '@prisma/client';

export class MerchantRepository {
  static async findProfileByUserId(userId: string) {
    return prisma.merchantProfile.findUnique({
      where: { userId },
      include: {
        stores: {
          include: {
            _count: { select: { inventory: true } },
          },
        },
      },
    });
  }

  static async findProfileById(id: string) {
    return prisma.merchantProfile.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, name: true, email: true } },
        stores: true,
      },
    });
  }

  static async createProfile(userId: string, data: {
    businessName: string;
    businessRegNumber?: string;
    contactEmail: string;
    contactPhone: string;
  }) {
    return prisma.merchantProfile.create({
      data: { userId, ...data },
    });
  }

  static async updateProfile(id: string, data: Partial<{
    businessName: string;
    businessRegNumber: string;
    contactEmail: string;
    contactPhone: string;
  }>) {
    return prisma.merchantProfile.update({ where: { id }, data });
  }

  static async updateStatus(id: string, status: MerchantStatus) {
    return prisma.merchantProfile.update({ where: { id }, data: { status } });
  }

  static async createStore(merchantId: string, data: {
    name: string;
    address: string;
    latitude: number;
    longitude: number;
    radiusKm: number;
    prepTimeMinutes: number;
  }) {
    return prisma.store.create({ data: { merchantId, ...data } });
  }

  static async findStoreById(id: string) {
    return prisma.store.findUnique({
      where: { id },
      include: {
        merchant: true,
        inventory: {
          include: {
            product: { select: { id: true, name: true, imageUrl: true, unit: true } },
          },
        },
      },
    });
  }

  static async updateStore(id: string, data: Partial<{
    name: string;
    address: string;
    latitude: number;
    longitude: number;
    radiusKm: number;
    prepTimeMinutes: number;
    isActive: boolean;
  }>) {
    return prisma.store.update({ where: { id }, data });
  }

  static async upsertInventoryItem(data: {
    storeId: string;
    productId: string;
    variantId?: string;
    price: number;
    salePrice?: number;
    stockQuantity: number;
    isAvailable: boolean;
  }) {
    return prisma.inventoryItem.upsert({
      where: {
        storeId_productId_variantId: {
          storeId: data.storeId,
          productId: data.productId,
          variantId: data.variantId ?? null,
        },
      } as any,
      update: {
        price: data.price,
        salePrice: data.salePrice,
        stockQuantity: data.stockQuantity,
        isAvailable: data.isAvailable,
      },
      create: data,
    });
  }

  static async deleteInventoryItem(id: string) {
    return prisma.inventoryItem.delete({ where: { id } });
  }

  static async findAllForAdmin(params: { page: number; limit: number; status?: MerchantStatus }) {
    const { page, limit, status } = params;
    const skip = (page - 1) * limit;
    const where = status ? { status } : {};
    const [merchants, total] = await Promise.all([
      prisma.merchantProfile.findMany({
        where,
        skip,
        take: limit,
        include: {
          user: { select: { id: true, name: true, email: true } },
          _count: { select: { stores: true } },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.merchantProfile.count({ where }),
    ]);
    return { merchants, total, page, limit, totalPages: Math.ceil(total / limit) };
  }
}
