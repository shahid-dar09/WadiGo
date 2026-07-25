import { Router } from 'express';
import { AddressController } from '../../../controllers/address.controller.js';
import { authenticate, authorizeRoles } from '../../../middlewares/auth.middleware.js';

const addressRouter = Router();

addressRouter.use(authenticate);
addressRouter.use(authorizeRoles('CUSTOMER'));

addressRouter.get('/', AddressController.getMyAddresses);
addressRouter.post('/', AddressController.createAddress);
addressRouter.patch('/:addressId', AddressController.updateAddress);
addressRouter.delete('/:addressId', AddressController.deleteAddress);

export default addressRouter;
