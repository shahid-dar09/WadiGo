import { Request, Response, NextFunction } from 'express';
import { CartService } from '../services/cart.service.js';
import { ApiResponse } from '../utils/api-response.js';
import { addCartItemSchema, updateCartItemSchema } from '../schemas/cart.schema.js';

export class CartController {
  static async getCart(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user.id;
      const cart = await CartService.getCart(userId);
      res.status(200).json(ApiResponse.success('Cart retrieved successfully', cart));
    } catch (error) { next(error); }
  }

  static async addItem(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user.id;
      const input = addCartItemSchema.parse(req.body);
      const cart = await CartService.addItem(userId, input);
      res.status(200).json(ApiResponse.success('Item added to cart', cart));
    } catch (error) { next(error); }
  }

  static async updateItem(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user.id;
      const input = updateCartItemSchema.parse(req.body);
      const cart = await CartService.updateItem(userId, req.params.itemId, input);
      res.status(200).json(ApiResponse.success('Cart item updated', cart));
    } catch (error) { next(error); }
  }

  static async removeItem(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user.id;
      const cart = await CartService.removeItem(userId, req.params.itemId);
      res.status(200).json(ApiResponse.success('Item removed from cart', cart));
    } catch (error) { next(error); }
  }

  static async clearCart(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user.id;
      const result = await CartService.clearCart(userId);
      res.status(200).json(ApiResponse.success(result.message));
    } catch (error) { next(error); }
  }
}
