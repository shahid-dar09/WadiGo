import { z } from 'zod';

export const createMerchantProfileSchema = z.object({
  businessName: z.string().min(2, 'Business name is required'),
  businessRegNumber: z.string().optional(),
  contactEmail: z.string().email('Invalid contact email'),
  contactPhone: z.string().min(6, 'Contact phone is required'),
});

export const createStoreSchema = z.object({
  name: z.string().min(2, 'Store name is required'),
  address: z.string().min(5, 'Store address is required'),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  radiusKm: z.number().min(0.1).max(100).default(10),
  prepTimeMinutes: z.number().int().min(1).max(120).default(15),
});

export const updateStoreSchema = createStoreSchema.partial();

export const upsertInventorySchema = z.object({
  productId: z.string().min(1, 'Product ID required'),
  variantId: z.string().optional(),
  price: z.number().min(0, 'Price must be positive'),
  salePrice: z.number().min(0).optional(),
  stockQuantity: z.number().int().min(0).default(0),
  isAvailable: z.boolean().default(true),
});

export const createProductSchema = z.object({
  categoryId: z.string().min(1, 'Category ID required'),
  name: z.string().min(2, 'Product name is required'),
  slug: z.string().min(2, 'Slug is required').regex(/^[a-z0-9-]+$/, 'Slug must be lowercase with hyphens'),
  description: z.string().optional(),
  imageUrl: z.string().url().optional(),
  unit: z.string().min(1).default('piece'),
});

export const createCategorySchema = z.object({
  name: z.string().min(2, 'Category name is required'),
  slug: z.string().min(2).regex(/^[a-z0-9-]+$/, 'Slug must be lowercase with hyphens'),
  description: z.string().optional(),
  imageUrl: z.string().url().optional(),
  parentId: z.string().optional(),
});

export type CreateMerchantProfileInput = z.infer<typeof createMerchantProfileSchema>;
export type CreateStoreInput = z.infer<typeof createStoreSchema>;
export type UpdateStoreInput = z.infer<typeof updateStoreSchema>;
export type UpsertInventoryInput = z.infer<typeof upsertInventorySchema>;
export type CreateProductInput = z.infer<typeof createProductSchema>;
export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
