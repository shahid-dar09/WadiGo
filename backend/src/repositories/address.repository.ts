import { prisma } from '../config/prisma.js';

export class AddressRepository {
  static async findByUserId(userId: string) {
    return prisma.customerAddress.findMany({
      where: { userId },
      orderBy: [{ isDefault: 'desc' }, { id: 'asc' }],
    });
  }

  static async findById(id: string) {
    return prisma.customerAddress.findUnique({ where: { id } });
  }

  static async create(userId: string, data: {
    label: string;
    street: string;
    city: string;
    state: string;
    postalCode: string;
    latitude: number;
    longitude: number;
    isDefault: boolean;
  }) {
    // If this is the default address, remove default from others
    if (data.isDefault) {
      await prisma.customerAddress.updateMany({
        where: { userId },
        data: { isDefault: false },
      });
    }

    return prisma.customerAddress.create({
      data: { userId, ...data },
    });
  }

  static async update(id: string, userId: string, data: Partial<{
    label: string;
    street: string;
    city: string;
    state: string;
    postalCode: string;
    latitude: number;
    longitude: number;
    isDefault: boolean;
  }>) {
    if (data.isDefault) {
      await prisma.customerAddress.updateMany({
        where: { userId, NOT: { id } },
        data: { isDefault: false },
      });
    }
    return prisma.customerAddress.update({ where: { id }, data });
  }

  static async delete(id: string) {
    return prisma.customerAddress.delete({ where: { id } });
  }
}
