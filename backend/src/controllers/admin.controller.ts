import { Request, Response, NextFunction } from 'express';
import { AdminService } from '../services/admin.service.js';
import { ApiResponse } from '../utils/api-response.js';

export class AdminController {
  static async getPlatformOverview(req: Request, res: Response, next: NextFunction) {
    try {
      const overview = await AdminService.getPlatformOverview();
      res.status(200).json(ApiResponse.success('Platform overview retrieved', overview));
    } catch (error) { next(error); }
  }

  static async getAllUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;
      const role = req.query.role as string | undefined;
      const result = await AdminService.getAllUsers(page, limit, role);
      res.status(200).json(ApiResponse.success('Users retrieved', result.users, {
        total: result.total, page: result.page, limit: result.limit, totalPages: result.totalPages,
      }));
    } catch (error) { next(error); }
  }

  static async setUserActive(req: Request, res: Response, next: NextFunction) {
    try {
      const { isActive } = req.body;
      const user = await AdminService.setUserActive(req.params.userId, isActive);
      res.status(200).json(ApiResponse.success(`User ${isActive ? 'activated' : 'deactivated'} successfully`, user));
    } catch (error) { next(error); }
  }

  static async getAllMerchants(req: Request, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;
      const status = req.query.status as string | undefined;
      const result = await AdminService.getAllMerchants(page, limit, status);
      res.status(200).json(ApiResponse.success('Merchants retrieved', result.merchants, {
        total: result.total, page: result.page, limit: result.limit, totalPages: result.totalPages,
      }));
    } catch (error) { next(error); }
  }

  static async approveMerchant(req: Request, res: Response, next: NextFunction) {
    try {
      const merchant = await AdminService.approveMerchant(req.params.merchantId);
      res.status(200).json(ApiResponse.success('Merchant approved successfully', merchant));
    } catch (error) { next(error); }
  }

  static async suspendMerchant(req: Request, res: Response, next: NextFunction) {
    try {
      const merchant = await AdminService.suspendMerchant(req.params.merchantId);
      res.status(200).json(ApiResponse.success('Merchant suspended', merchant));
    } catch (error) { next(error); }
  }

  static async rejectMerchant(req: Request, res: Response, next: NextFunction) {
    try {
      const merchant = await AdminService.rejectMerchant(req.params.merchantId);
      res.status(200).json(ApiResponse.success('Merchant rejected', merchant));
    } catch (error) { next(error); }
  }
}
