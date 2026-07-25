import { prisma } from '../config/prisma.js';

export class AdminRepository {
  static async findAllUsers(params: { page: number; limit: number; role?: string }) {
    const { page, limit, role } = params;
    const skip = (page - 1) * limit;
    const where: any = role ? { roles: { some: { role: { name: role as any } } } } : {};

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: limit,
        include: {
          roles: { include: { role: true } },
          _count: { select: { orders: true } },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.user.count({ where }),
    ]);
    return { users, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  static async setUserActive(id: string, isActive: boolean) {
    return prisma.user.update({ where: { id }, data: { isActive } });
  }

  static async getPlatformOverview() {
    const [totalUsers, totalMerchants, totalProducts, totalOrders, revenueAgg] = await Promise.all([
      prisma.user.count(),
      prisma.merchantProfile.count(),
      prisma.product.count({ where: { isActive: true } }),
      prisma.order.count(),
      prisma.order.aggregate({ _sum: { finalAmount: true }, where: { paymentStatus: 'PAID' } }),
    ]);
    return {
      totalUsers,
      totalMerchants,
      totalProducts,
      totalOrders,
      totalRevenue: revenueAgg._sum.finalAmount ?? 0,
    };
  }
}
