import { Request, Response, NextFunction } from 'express';
import { OrderService } from '../services/order.service.js';
import { ApiResponse } from '../utils/api-response.js';
import { placeOrderSchema, updateOrderStatusSchema } from '../schemas/order.schema.js';

export class OrderController {
  static async placeOrder(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user.id;
      const input = placeOrderSchema.parse(req.body);
      const order = await OrderService.placeOrder(userId, input);
      res.status(201).json(ApiResponse.success('Order placed successfully', order));
    } catch (error) { next(error); }
  }

  static async getMyOrders(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user.id;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const result = await OrderService.getMyOrders(userId, page, limit);
      res.status(200).json(ApiResponse.success('Orders retrieved successfully', result.orders, {
        total: result.total, page: result.page, limit: result.limit, totalPages: result.totalPages,
      }));
    } catch (error) { next(error); }
  }

  static async getOrderById(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user.id;
      const userRoles = (req as any).user.roles;
      const order = await OrderService.getOrderById(req.params.orderId, userId, userRoles);
      res.status(200).json(ApiResponse.success('Order details retrieved', order));
    } catch (error) { next(error); }
  }

  static async updateStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user.id;
      const input = updateOrderStatusSchema.parse(req.body);
      const order = await OrderService.updateOrderStatus(req.params.orderId, input, userId);
      res.status(200).json(ApiResponse.success('Order status updated', order));
    } catch (error) { next(error); }
  }

  static async getAllOrdersAdmin(req: Request, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;
      const status = req.query.status as string | undefined;
      const result = await OrderService.getAllOrdersForAdmin({ page, limit, status });
      res.status(200).json(ApiResponse.success('All orders retrieved', result.orders, {
        total: result.total, page: result.page, limit: result.limit, totalPages: result.totalPages,
      }));
    } catch (error) { next(error); }
  }
}
