import { Router } from 'express';
import { ProductController, CategoryController } from '../../../controllers/product.controller.js';
import { authenticate, authorizeRoles } from '../../../middlewares/auth.middleware.js';

const productRouter = Router();

// Public product routes
productRouter.get('/', ProductController.search);
productRouter.get('/:slug', ProductController.getBySlug);

// Admin-only product management
productRouter.post('/', authenticate, authorizeRoles('ADMIN'), ProductController.create);
productRouter.patch('/:id', authenticate, authorizeRoles('ADMIN'), ProductController.update);

export default productRouter;
