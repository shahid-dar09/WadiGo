import { Router } from 'express';
import { OrderController } from '../../../controllers/order.controller.js';
import { authenticate, authorizeRoles } from '../../../middlewares/auth.middleware.js';

const orderRouter = Router();

orderRouter.use(authenticate);

// Customer routes
orderRouter.post('/', authorizeRoles('CUSTOMER'), OrderController.placeOrder);
orderRouter.get('/me', authorizeRoles('CUSTOMER'), OrderController.getMyOrders);
orderRouter.get('/:orderId', OrderController.getOrderById);

// Admin + Merchant: update order status
orderRouter.patch('/:orderId/status', authorizeRoles('ADMIN', 'MERCHANT', 'DELIVERY_PARTNER'), OrderController.updateStatus);

// Admin only: all orders
orderRouter.get('/', authorizeRoles('ADMIN'), OrderController.getAllOrdersAdmin);

export default orderRouter;
