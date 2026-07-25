import { Request, Response, NextFunction } from 'express';
import { OrderService } from '../services/order.service.js';
import { ApiResponse } from '../utils/api-response.js';
import { updateOrderStatusSchema } from '../schemas/order.schema.js';

export class DeliveryController {
  static async getAvailableOrders(req: Request, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;
      const result = await OrderService.getAllOrdersForAdmin({ page, limit, status: 'READY_FOR_PICKUP' });
      res.status(200).json(ApiResponse.success('Available orders retrieved', result.orders, {
        total: result.total, page: result.page, limit: result.limit, totalPages: result.totalPages,
      }));
    } catch (error) { next(error); }
  }

  static async updateOrderStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user.id;
      const input = updateOrderStatusSchema.parse(req.body);
      const order = await OrderService.updateOrderStatus(req.params.orderId, input, userId);
      res.status(200).json(ApiResponse.success('Order status updated', order));
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
}
