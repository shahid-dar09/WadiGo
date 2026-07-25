import api from './api';
import type { ApiResponse } from '../types';

export interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  imageUrl: string | null;
  _count: { products: number };
}

export const categoryService = {
  async getAll(): Promise<ApiResponse<CategoryItem[]>> {
    return api.get('/categories');
  },
};
