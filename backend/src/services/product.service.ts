import { CategoryRepository } from '../repositories/category.repository.js';
import { ProductRepository } from '../repositories/product.repository.js';
import { ApiError } from '../utils/api-error.js';
import { ProductSearchInput } from '../schemas/product.schema.js';

export class ProductService {
  static async searchProducts(params: ProductSearchInput) {
    const result = await ProductRepository.findMany({
      query: params.query,
      categoryId: params.categoryId,
      minPrice: params.minPrice,
      maxPrice: params.maxPrice,
      page: params.page,
      limit: params.limit,
    });

    const products = result.products.map((p) => {
      const prices = p.inventory.map((i) => i.salePrice ?? i.price);
      const minPrice = prices.length ? Math.min(...prices) : null;
      const maxPrice = prices.length ? Math.max(...prices) : null;

      return {
        id: p.id,
        name: p.name,
        slug: p.slug,
        description: p.description,
        imageUrl: p.imageUrl,
        unit: p.unit,
        category: p.category,
        minPrice,
        maxPrice,
        availableMerchantsCount: p.inventory.length,
        reviewCount: (p as any)._count.reviews,
        isAvailable: p.inventory.some((i) => i.stockQuantity > 0),
      };
    });

    return {
      products,
      meta: {
        total: result.total,
        page: result.page,
        limit: result.limit,
        totalPages: result.totalPages,
      },
    };
  }

  static async getProductBySlug(slug: string) {
    const product = await ProductRepository.findBySlug(slug);
    if (!product) {
      throw ApiError.notFound('Product not found');
    }
    return product;
  }

  static async getProductById(id: string) {
    const product = await ProductRepository.findById(id);
    if (!product) {
      throw ApiError.notFound('Product not found');
    }
    return product;
  }

  static async getAllCategories() {
    return CategoryRepository.findAll(true);
  }

  static async getCategoryById(id: string) {
    const category = await CategoryRepository.findById(id);
    if (!category) {
      throw ApiError.notFound('Category not found');
    }
    return category;
  }

  static async createProduct(data: {
    categoryId: string;
    name: string;
    slug: string;
    description?: string;
    imageUrl?: string;
    unit: string;
  }) {
    const existing = await ProductRepository.findBySlug(data.slug);
    if (existing) {
      throw ApiError.badRequest('A product with this slug already exists');
    }
    return ProductRepository.create(data);
  }

  static async updateProduct(id: string, data: any) {
    const existing = await ProductRepository.findById(id);
    if (!existing) {
      throw ApiError.notFound('Product not found');
    }
    return ProductRepository.update(id, data);
  }

  static async createCategory(data: {
    name: string;
    slug: string;
    description?: string;
    imageUrl?: string;
    parentId?: string;
  }) {
    const existing = await CategoryRepository.findBySlug(data.slug);
    if (existing) {
      throw ApiError.badRequest('A category with this slug already exists');
    }
    return CategoryRepository.create(data);
  }
}
