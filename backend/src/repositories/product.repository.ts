import { prisma } from '../config/prisma.js';

export class ProductRepository {
  static async findMany(params: {
    query?: string;
    categoryId?: string;
    minPrice?: number;
    maxPrice?: number;
    page: number;
    limit: number;
  }) {
    const { query, categoryId, minPrice, maxPrice, page, limit } = params;
    const skip = (page - 1) * limit;

    const where: any = { isActive: true };
    if (categoryId) where.categoryId = categoryId;
    if (query) {
      where.OR = [
        { name: { contains: query } },
        { description: { contains: query } },
      ];
    }

    // Filter by price if provided (through inventory)
    if (minPrice !== undefined || maxPrice !== undefined) {
      where.inventory = {
        some: {
          isAvailable: true,
          ...(minPrice !== undefined && { price: { gte: minPrice } }),
          ...(maxPrice !== undefined && { price: { lte: maxPrice } }),
        },
      };
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take: limit,
        include: {
          category: { select: { id: true, name: true, slug: true } },
          inventory: {
            where: { isAvailable: true },
            select: { price: true, salePrice: true, stockQuantity: true, storeId: true },
          },
          _count: { select: { reviews: true } },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.product.count({ where }),
    ]);

    return { products, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  static async findById(id: string) {
    return prisma.product.findUnique({
      where: { id, isActive: true },
      include: {
        category: true,
        variants: true,
        inventory: {
          where: { isAvailable: true },
          include: {
            store: {
              select: {
                id: true,
                name: true,
                address: true,
                latitude: true,
                longitude: true,
                prepTimeMinutes: true,
                merchant: {
                  select: { businessName: true, rating: true },
                },
              },
            },
          },
        },
        reviews: {
          take: 10,
          orderBy: { createdAt: 'desc' },
          include: { user: { select: { name: true, avatarUrl: true } } },
        },
        _count: { select: { reviews: true } },
      },
    });
  }

  static async findBySlug(slug: string) {
    return prisma.product.findUnique({
      where: { slug, isActive: true },
      include: {
        category: true,
        variants: true,
        inventory: {
          where: { isAvailable: true },
          include: {
            store: {
              select: {
                id: true,
                name: true,
                address: true,
                latitude: true,
                longitude: true,
                prepTimeMinutes: true,
                merchant: {
                  select: { businessName: true, rating: true },
                },
              },
            },
          },
        },
        _count: { select: { reviews: true } },
      },
    });
  }

  static async create(data: {
    categoryId: string;
    name: string;
    slug: string;
    description?: string;
    imageUrl?: string;
    unit: string;
  }) {
    return prisma.product.create({ data });
  }

  static async update(id: string, data: Partial<{ name: string; slug: string; description: string; imageUrl: string; unit: string; isActive: boolean; categoryId: string }>) {
    return prisma.product.update({ where: { id }, data });
  }
}
