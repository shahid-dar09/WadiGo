import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/api-error.js';
import { ApiResponse } from '../utils/api-response.js';
import { ZodError } from 'zod';
import { env } from '../config/env.js';

export const errorMiddleware = (
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  if (err instanceof ApiError) {
    res.status(err.statusCode).json(ApiResponse.error(err.message, err.errors));
    return;
  }

  if (err instanceof ZodError) {
    const formattedErrors = err.errors.map((e) => ({
      field: e.path.join('.'),
      message: e.message,
    }));
    res
      .status(400)
      .json(ApiResponse.error('Validation failed', formattedErrors));
    return;
  }

  console.error('🔥 Unhandled Exception:', err);

  const message =
    env.NODE_ENV === 'production'
      ? 'An unexpected error occurred'
      : err.message || 'Internal Server Error';

  res.status(500).json(ApiResponse.error(message));
};
