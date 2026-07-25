import { Request, Response, NextFunction } from 'express';
import { MerchantService } from '../services/merchant.service.js';
import { ApiResponse } from '../utils/api-response.js';
import {
  createMerchantProfileSchema,
  createStoreSchema,
  updateStoreSchema,
  upsertInventorySchema,
} from '../schemas/merchant.schema.js';
import { OrderService } from '../services/order.service.js';

export class MerchantController {
  static async getMyProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user.id;
      const profile = await MerchantService.getMyProfile(userId);
      res.status(200).json(ApiResponse.success('Merchant profile retrieved', profile));
    } catch (error) { next(error); }
  }

  static async createProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user.id;
      const input = createMerchantProfileSchema.parse(req.body);
      const profile = await MerchantService.createProfile(userId, input);
      res.status(201).json(ApiResponse.success('Merchant profile created. Pending admin approval.', profile));
    } catch (error) { next(error); }
  }

  static async updateProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user.id;
      const input = createMerchantProfileSchema.partial().parse(req.body);
      const profile = await MerchantService.updateProfile(userId, input);
      res.status(200).json(ApiResponse.success('Merchant profile updated', profile));
    } catch (error) { next(error); }
  }

  static async createStore(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user.id;
      const input = createStoreSchema.parse(req.body);
      const store = await MerchantService.createStore(userId, input);
      res.status(201).json(ApiResponse.success('Store created successfully', store));
    } catch (error) { next(error); }
  }

  static async updateStore(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user.id;
      const input = updateStoreSchema.parse(req.body);
      const store = await MerchantService.updateStore(userId, req.params.storeId, input);
      res.status(200).json(ApiResponse.success('Store updated successfully', store));
    } catch (error) { next(error); }
  }

  static async getStoreInventory(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user.id;
      const inventory = await MerchantService.getStoreInventory(userId, req.params.storeId);
      res.status(200).json(ApiResponse.success('Store inventory retrieved', inventory));
    } catch (error) { next(error); }
  }

  static async upsertInventory(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user.id;
      const input = upsertInventorySchema.parse(req.body);
      const item = await MerchantService.upsertInventory(userId, req.params.storeId, input);
      res.status(200).json(ApiResponse.success('Inventory updated successfully', item));
    } catch (error) { next(error); }
  }

  static async deleteInventoryItem(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user.id;
      await MerchantService.deleteInventoryItem(userId, req.params.storeId, req.params.itemId);
      res.status(200).json(ApiResponse.success('Inventory item removed'));
    } catch (error) { next(error); }
  }

  static async getMyOrders(req: Request, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;
      const status = req.query.status as string | undefined;
      const storeId = req.params.storeId;
      const result = await OrderService.getMerchantOrders(storeId, { page, limit, status });
      res.status(200).json(ApiResponse.success('Merchant orders retrieved', result.orders, {
        total: result.total, page: result.page, limit: result.limit, totalPages: result.totalPages,
      }));
    } catch (error) { next(error); }
  }

  static async updateOrderStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user.id;
      const order = await OrderService.updateOrderStatus(req.params.orderId, req.body, userId);
      res.status(200).json(ApiResponse.success('Order status updated', order));
    } catch (error) { next(error); }
  }
}
