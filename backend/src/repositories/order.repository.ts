import { prisma } from '../config/prisma.js';
import { OrderStatus } from '@prisma/client';

export class OrderRepository {
  static async create(data: {
    customerId: string;
    orderNumber: string;
    totalAmount: number;
    deliveryFee: number;
    taxAmount: number;
    discountAmount: number;
    finalAmount: number;
    deliveryAddressId?: string;
    notes?: string;
    paymentMethod: string;
    items: Array<{
      productId: string;
      variantId?: string;
      storeId: string;
      quantity: number;
      unitPrice: number;
      totalPrice: number;
    }>;
  }) {
    return prisma.order.create({
      data: {
        orderNumber: data.orderNumber,
        customerId: data.customerId,
        totalAmount: data.totalAmount,
        deliveryFee: data.deliveryFee,
        taxAmount: data.taxAmount,
        discountAmount: data.discountAmount,
        finalAmount: data.finalAmount,
        deliveryAddressId: data.deliveryAddressId,
        notes: data.notes,
        paymentMethod: data.paymentMethod,
        items: {
          create: data.items.map((item) => ({
            productId: item.productId,
            variantId: item.variantId,
            storeId: item.storeId,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            totalPrice: item.totalPrice,
          })),
        },
        history: {
          create: {
            status: OrderStatus.PENDING,
            notes: 'Order placed successfully',
          },
        },
      },
      include: {
        items: {
          include: {
            product: { select: { id: true, name: true, imageUrl: true, unit: true } },
            store: { select: { id: true, name: true } },
          },
        },
        history: { orderBy: { createdAt: 'desc' } },
      },
    });
  }

  static async findByCustomerId(customerId: string, page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where: { customerId },
        skip,
        take: limit,
        include: {
          items: {
            include: {
              product: { select: { id: true, name: true, imageUrl: true, unit: true } },
            },
          },
          history: { orderBy: { createdAt: 'desc' }, take: 1 },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.order.count({ where: { customerId } }),
    ]);
    return { orders, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  static async findById(id: string) {
    return prisma.order.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            product: { select: { id: true, name: true, imageUrl: true, unit: true } },
            variant: { select: { id: true, name: true } },
            store: { select: { id: true, name: true, address: true } },
          },
        },
        history: { orderBy: { createdAt: 'desc' } },
        customer: { select: { id: true, name: true, email: true, phone: true } },
      },
    });
  }

  static async findByNumber(orderNumber: string) {
    return prisma.order.findUnique({ where: { orderNumber } });
  }

  static async findAllForAdmin(params: { page: number; limit: number; status?: OrderStatus }) {
    const { page, limit, status } = params;
    const skip = (page - 1) * limit;
    const where = status ? { status } : {};
    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        skip,
        take: limit,
        include: {
          customer: { select: { id: true, name: true, email: true } },
          items: { select: { id: true, quantity: true, totalPrice: true } },
          history: { orderBy: { createdAt: 'desc' }, take: 1 },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.order.count({ where }),
    ]);
    return { orders, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  static async findByStoreId(storeId: string, params: { page: number; limit: number; status?: OrderStatus }) {
    const { page, limit, status } = params;
    const skip = (page - 1) * limit;
    const where: any = {
      items: { some: { storeId } },
      ...(status && { status }),
    };
    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        skip,
        take: limit,
        include: {
          items: {
            where: { storeId },
            include: { product: { select: { id: true, name: true, imageUrl: true, unit: true } } },
          },
          customer: { select: { id: true, name: true, phone: true } },
          history: { orderBy: { createdAt: 'desc' }, take: 1 },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.order.count({ where }),
    ]);
    return { orders, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  static async updateStatus(orderId: string, status: OrderStatus, notes?: string, changedByUserId?: string) {
    return prisma.$transaction([
      prisma.order.update({
        where: { id: orderId },
        data: { status },
      }),
      prisma.orderStatusHistory.create({
        data: { orderId, status, notes, changedByUserId },
      }),
    ]);
  }

  static async generateOrderNumber(): Promise<string> {
    const date = new Date();
    const dateStr = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}`;
    const random = Math.floor(1000 + Math.random() * 9000);
    return `WG-${dateStr}-${random}`;
  }

  static async getPlatformStats() {
    const [totalOrders, totalRevenue, pendingOrders, deliveredOrders] = await Promise.all([
      prisma.order.count(),
      prisma.order.aggregate({ _sum: { finalAmount: true } }),
      prisma.order.count({ where: { status: 'PENDING' } }),
      prisma.order.count({ where: { status: 'DELIVERED' } }),
    ]);
    return {
      totalOrders,
      totalRevenue: totalRevenue._sum.finalAmount ?? 0,
      pendingOrders,
      deliveredOrders,
    };
  }
}
