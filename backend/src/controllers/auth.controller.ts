import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service.js';
import { ApiResponse } from '../utils/api-response.js';
import {
  registerInitSchema,
  verifyOtpSchema,
  resendOtpSchema,
  loginSchema,
  refreshTokenSchema,
} from '../schemas/auth.schema.js';

export class AuthController {
  static async registerInit(req: Request, res: Response, next: NextFunction) {
    try {
      const validatedInput = registerInitSchema.parse(req.body);
      const result = await AuthService.initiateRegistration(validatedInput);
      res.status(200).json(ApiResponse.success(result.message, result));
    } catch (error) {
      next(error);
    }
  }

  static async verifyOtp(req: Request, res: Response, next: NextFunction) {
    try {
      const validatedInput = verifyOtpSchema.parse(req.body);
      const result = await AuthService.verifyOtpAndCompleteRegister(validatedInput);
      res.status(201).json(ApiResponse.success('Registration completed successfully', result));
    } catch (error) {
      next(error);
    }
  }

  static async resendOtp(req: Request, res: Response, next: NextFunction) {
    try {
      const validatedInput = resendOtpSchema.parse(req.body);
      const result = await AuthService.resendOtp(validatedInput.email, validatedInput.purpose);
      res.status(200).json(ApiResponse.success(result.message, result));
    } catch (error) {
      next(error);
    }
  }

  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const validatedInput = loginSchema.parse(req.body);
      const result = await AuthService.loginUser(validatedInput, validatedInput.requiredRole);
      res.status(200).json(ApiResponse.success('Logged in successfully', result));
    } catch (error) {
      next(error);
    }
  }

  static async refresh(req: Request, res: Response, next: NextFunction) {
    try {
      const validatedInput = refreshTokenSchema.parse(req.body);
      const result = await AuthService.refreshAccessToken(validatedInput.refreshToken);
      res.status(200).json(ApiResponse.success('Access token refreshed', result));
    } catch (error) {
      next(error);
    }
  }

  static async logout(req: Request, res: Response, next: NextFunction) {
    try {
      const refreshToken = req.body.refreshToken;
      const userId = (req as any).user?.id;
      const result = await AuthService.logoutUser(refreshToken, userId);
      res.status(200).json(ApiResponse.success('Logged out successfully', result));
    } catch (error) {
      next(error);
    }
  }

  static async getMe(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user.id;
      const user = await AuthService.getCurrentUser(userId);
      res.status(200).json(ApiResponse.success('User profile retrieved', user));
    } catch (error) {
      next(error);
    }
  }
}
