import { Router } from 'express';
import { DeliveryController } from '../../../controllers/delivery.controller.js';
import { authenticate, authorizeRoles } from '../../../middlewares/auth.middleware.js';

const deliveryRouter = Router();

deliveryRouter.use(authenticate);
deliveryRouter.use(authorizeRoles('DELIVERY_PARTNER', 'ADMIN'));

deliveryRouter.get('/orders/available', DeliveryController.getAvailableOrders);
deliveryRouter.get('/orders/:orderId', DeliveryController.getOrderById);
deliveryRouter.patch('/orders/:orderId/status', DeliveryController.updateOrderStatus);

export default deliveryRouter;
