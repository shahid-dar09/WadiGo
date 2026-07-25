import { Router } from 'express';
import { CategoryController } from '../../../controllers/product.controller.js';
import { authenticate, authorizeRoles } from '../../../middlewares/auth.middleware.js';

const categoryRouter = Router();

categoryRouter.get('/', CategoryController.getAll);
categoryRouter.get('/:id', CategoryController.getById);
categoryRouter.post('/', authenticate, authorizeRoles('ADMIN'), CategoryController.create);

export default categoryRouter;
