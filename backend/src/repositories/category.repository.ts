import { prisma } from '../config/prisma.js';

export class CategoryRepository {
  static async findAll(onlyActive = true) {
    return prisma.category.findMany({
      where: onlyActive ? { isActive: true } : undefined,
      include: {
        _count: { select: { products: true } },
      },
      orderBy: { name: 'asc' },
    });
  }

  static async findById(id: string) {
    return prisma.category.findUnique({
      where: { id },
      include: { _count: { select: { products: true } } },
    });
  }

  static async findBySlug(slug: string) {
    return prisma.category.findUnique({ where: { slug } });
  }

  static async create(data: {
    name: string;
    slug: string;
    description?: string;
    imageUrl?: string;
    parentId?: string;
  }) {
    return prisma.category.create({ data });
  }

  static async update(id: string, data: Partial<{ name: string; slug: string; description: string; imageUrl: string; isActive: boolean }>) {
    return prisma.category.update({ where: { id }, data });
  }

  static async delete(id: string) {
    return prisma.category.update({ where: { id }, data: { isActive: false } });
  }
}
