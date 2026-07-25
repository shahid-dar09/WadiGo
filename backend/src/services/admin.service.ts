import { AdminRepository } from '../repositories/admin.repository.js';
import { MerchantRepository } from '../repositories/merchant.repository.js';
import { OrderRepository } from '../repositories/order.repository.js';
import { ApiError } from '../utils/api-error.js';
import { MerchantStatus } from '@prisma/client';

export class AdminService {
  static async getPlatformOverview() {
    const [overview, orderStats] = await Promise.all([
      AdminRepository.getPlatformOverview(),
      OrderRepository.getPlatformStats(),
    ]);
    return { ...overview, ...orderStats };
  }

  static async getAllUsers(page: number, limit: number, role?: string) {
    const result = await AdminRepository.findAllUsers({ page, limit, role });
    const users = result.users.map((u) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      isActive: u.isActive,
      roles: u.roles.map((r) => r.role.name),
      ordersCount: (u as any)._count.orders,
      createdAt: u.createdAt,
    }));
    return { ...result, users };
  }

  static async setUserActive(userId: string, isActive: boolean) {
    return AdminRepository.setUserActive(userId, isActive);
  }

  static async getAllMerchants(page: number, limit: number, status?: string) {
    return MerchantRepository.findAllForAdmin({
      page,
      limit,
      status: status as MerchantStatus | undefined,
    });
  }

  static async approveMerchant(merchantId: string) {
    const merchant = await MerchantRepository.findProfileById(merchantId);
    if (!merchant) throw ApiError.notFound('Merchant not found');
    return MerchantRepository.updateStatus(merchantId, MerchantStatus.APPROVED);
  }

  static async suspendMerchant(merchantId: string) {
    const merchant = await MerchantRepository.findProfileById(merchantId);
    if (!merchant) throw ApiError.notFound('Merchant not found');
    return MerchantRepository.updateStatus(merchantId, MerchantStatus.SUSPENDED);
  }

  static async rejectMerchant(merchantId: string) {
    const merchant = await MerchantRepository.findProfileById(merchantId);
    if (!merchant) throw ApiError.notFound('Merchant not found');
    return MerchantRepository.updateStatus(merchantId, MerchantStatus.REJECTED);
  }
}
