import { Router, Request, Response } from 'express';
import { ApiResponse } from '../../../utils/api-response.js';
import authRouter from './auth.routes.js';
import productRouter from './product.routes.js';
import categoryRouter from './category.routes.js';
import cartRouter from './cart.routes.js';
import orderRouter from './order.routes.js';
import addressRouter from './address.routes.js';
import merchantRouter from './merchant.routes.js';
import deliveryRouter from './delivery.routes.js';
import adminRouter from './admin.routes.js';

const v1Router = Router();

// Auth
v1Router.use('/auth', authRouter);

// Products & Categories (public)
v1Router.use('/products', productRouter);
v1Router.use('/categories', categoryRouter);

// Customer Portal (authenticated)
v1Router.use('/cart', cartRouter);
v1Router.use('/orders', orderRouter);
v1Router.use('/addresses', addressRouter);

// Merchant Portal
v1Router.use('/merchant', merchantRouter);

// Delivery Partner Portal
v1Router.use('/delivery', deliveryRouter);

// Admin Portal
v1Router.use('/admin', adminRouter);

// Health Check
v1Router.get('/health', (_req: Request, res: Response) => {
  res.status(200).json(
    ApiResponse.success('WadiGo Hyperlocal API Service is Operational', {
      service: 'wadigo-backend',
      version: 'v1.0.0',
      timestamp: new Date().toISOString(),
      routes: ['/auth', '/products', '/categories', '/cart', '/orders', '/addresses', '/merchant', '/delivery', '/admin'],
    })
  );
});

export default v1Router;
