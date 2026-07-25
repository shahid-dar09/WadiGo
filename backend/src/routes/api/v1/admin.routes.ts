import { Router } from 'express';
import { AdminController } from '../../../controllers/admin.controller.js';
import { authenticate, authorizeRoles } from '../../../middlewares/auth.middleware.js';

const adminRouter = Router();

adminRouter.use(authenticate);
adminRouter.use(authorizeRoles('ADMIN'));

adminRouter.get('/overview', AdminController.getPlatformOverview);

// User management
adminRouter.get('/users', AdminController.getAllUsers);
adminRouter.patch('/users/:userId/status', AdminController.setUserActive);

// Merchant management
adminRouter.get('/merchants', AdminController.getAllMerchants);
adminRouter.patch('/merchants/:merchantId/approve', AdminController.approveMerchant);
adminRouter.patch('/merchants/:merchantId/suspend', AdminController.suspendMerchant);
adminRouter.patch('/merchants/:merchantId/reject', AdminController.rejectMerchant);

export default adminRouter;
