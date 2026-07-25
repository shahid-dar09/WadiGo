import { Router } from 'express';
import { MerchantController } from '../../../controllers/merchant.controller.js';
import { authenticate, authorizeRoles } from '../../../middlewares/auth.middleware.js';

const merchantRouter = Router();

merchantRouter.use(authenticate);

// Merchant profile (any authenticated user can create — needed for onboarding)
merchantRouter.get('/profile', MerchantController.getMyProfile);
merchantRouter.post('/profile', MerchantController.createProfile);
merchantRouter.patch('/profile', authorizeRoles('MERCHANT', 'ADMIN'), MerchantController.updateProfile);

// Store management
merchantRouter.post('/stores', authorizeRoles('MERCHANT', 'ADMIN'), MerchantController.createStore);
merchantRouter.patch('/stores/:storeId', authorizeRoles('MERCHANT', 'ADMIN'), MerchantController.updateStore);

// Inventory management
merchantRouter.get('/stores/:storeId/inventory', authorizeRoles('MERCHANT', 'ADMIN'), MerchantController.getStoreInventory);
merchantRouter.post('/stores/:storeId/inventory', authorizeRoles('MERCHANT', 'ADMIN'), MerchantController.upsertInventory);
merchantRouter.delete('/stores/:storeId/inventory/:itemId', authorizeRoles('MERCHANT', 'ADMIN'), MerchantController.deleteInventoryItem);

// Order management for merchants
merchantRouter.get('/stores/:storeId/orders', authorizeRoles('MERCHANT', 'ADMIN'), MerchantController.getMyOrders);
merchantRouter.patch('/orders/:orderId/status', authorizeRoles('MERCHANT', 'ADMIN'), MerchantController.updateOrderStatus);

export default merchantRouter;
