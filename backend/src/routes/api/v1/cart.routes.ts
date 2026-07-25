import { Router } from 'express';
import { CartController } from '../../../controllers/cart.controller.js';
import { authenticate, authorizeRoles } from '../../../middlewares/auth.middleware.js';

const cartRouter = Router();

// All cart routes require authentication
cartRouter.use(authenticate);
cartRouter.use(authorizeRoles('CUSTOMER'));

cartRouter.get('/', CartController.getCart);
cartRouter.post('/items', CartController.addItem);
cartRouter.patch('/items/:itemId', CartController.updateItem);
cartRouter.delete('/items/:itemId', CartController.removeItem);
cartRouter.delete('/', CartController.clearCart);

export default cartRouter;
