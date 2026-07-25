import { Router } from 'express';
import { ProductController, CategoryController } from '../../../controllers/product.controller.js';
import { authenticate, authorizeRoles } from '../../../middlewares/auth.middleware.js';

const productRouter = Router();

// Public product routes
productRouter.get('/', ProductController.search);
productRouter.get('/:slug', ProductController.getBySlug);

// Admin and Merchant product creation
productRouter.post('/', authenticate, authorizeRoles('ADMIN', 'MERCHANT'), ProductController.create);
productRouter.patch('/:id', authenticate, authorizeRoles('ADMIN', 'MERCHANT'), ProductController.update);

export default productRouter;
