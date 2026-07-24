import { Router, Request, Response } from 'express';
import { ApiResponse } from '../../../utils/api-response.js';
import authRouter from './auth.routes.js';

const v1Router = Router();

v1Router.use('/auth', authRouter);

v1Router.get('/health', (_req: Request, res: Response) => {
  res.status(200).json(
    ApiResponse.success('WadiGo Hyperlocal API Service is Operational', {
      service: 'wadigo-backend',
      version: 'v1.0.0',
      timestamp: new Date().toISOString(),
    })
  );
});

export default v1Router;
