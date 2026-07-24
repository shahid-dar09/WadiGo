export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatarUrl?: string;
  roles: string[];
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  itemCount?: number;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  imageUrl: string;
  categoryName: string;
  unit: string;
  minPrice: number;
  maxPrice?: number;
  availableMerchantsCount: number;
  avgDeliveryMinutes: number;
  rating: number;
  isFreshProduct?: boolean;
}

export interface MerchantStore {
  id: string;
  storeName: string;
  merchantName: string;
  distanceKm: number;
  price: number;
  salePrice?: number;
  prepTimeMinutes: number;
  rating: number;
  stockQuantity: number;
}

export interface CartItem {
  id: string;
  productId: string;
  productName: string;
  imageUrl: string;
  price: number;
  quantity: number;
  unit: string;
  assignedStoreId?: string;
  assignedStoreName?: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data: T;
  errors?: any;
  meta?: any;
}
