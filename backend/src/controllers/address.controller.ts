import { Request, Response, NextFunction } from 'express';
import { AddressService } from '../services/address.service.js';
import { ApiResponse } from '../utils/api-response.js';
import { createAddressSchema, updateAddressSchema } from '../schemas/address.schema.js';

export class AddressController {
  static async getMyAddresses(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user.id;
      const addresses = await AddressService.getMyAddresses(userId);
      res.status(200).json(ApiResponse.success('Addresses retrieved successfully', addresses));
    } catch (error) { next(error); }
  }

  static async createAddress(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user.id;
      const input = createAddressSchema.parse(req.body);
      const address = await AddressService.createAddress(userId, input);
      res.status(201).json(ApiResponse.success('Address added successfully', address));
    } catch (error) { next(error); }
  }

  static async updateAddress(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user.id;
      const input = updateAddressSchema.parse(req.body);
      const address = await AddressService.updateAddress(userId, req.params.addressId, input);
      res.status(200).json(ApiResponse.success('Address updated successfully', address));
    } catch (error) { next(error); }
  }

  static async deleteAddress(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user.id;
      const result = await AddressService.deleteAddress(userId, req.params.addressId);
      res.status(200).json(ApiResponse.success(result.message));
    } catch (error) { next(error); }
  }
}
