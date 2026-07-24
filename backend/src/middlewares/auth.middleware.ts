import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { ApiError } from '../utils/api-error.js';

export interface AuthenticatedUser {
  id: string;
  email: string;
  roles: string[];
}

export const authenticate = (req: Request, _res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw ApiError.unauthorized('Access token is required');
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as any;
    (req as any).user = {
      id: decoded.sub,
      email: decoded.email,
      roles: decoded.roles || [],
    };
    next();
  } catch (error) {
    throw ApiError.unauthorized('Invalid or expired access token');
  }
};

export const authorizeRoles = (...roles: string[]) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const user = (req as any).user as AuthenticatedUser;
    if (!user) {
      throw ApiError.unauthorized('Authentication required');
    }

    const hasRole = user.roles.some((role) => roles.includes(role));
    if (!hasRole) {
      throw ApiError.forbidden('You do not have permission to access this resource');
    }

    next();
  };
};
