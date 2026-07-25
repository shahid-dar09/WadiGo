import { z } from 'zod';

export const productSearchSchema = z.object({
  query: z.string().optional(),
  categoryId: z.string().optional(),
  minPrice: z.coerce.number().min(0).optional(),
  maxPrice: z.coerce.number().min(0).optional(),
  lat: z.coerce.number().optional(),
  lng: z.coerce.number().optional(),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(50).default(20),
});

export type ProductSearchInput = z.infer<typeof productSearchSchema>;

export const createProductSchema = z.object({
  categoryId: z.string().min(1, { message: 'Category is required' }),
  name: z.string().min(2, { message: 'Product name must be at least 2 characters' }),
  slug: z.string().optional(),
  description: z.string().optional(),
  imageUrl: z.string().optional(),
  unit: z.string().default('piece'),
});

export type CreateProductInput = z.infer<typeof createProductSchema>;
