import { Router } from 'express';
import { AuthController } from '../../../controllers/auth.controller.js';
import { authenticate } from '../../../middlewares/auth.middleware.js';

const authRouter = Router();

authRouter.post('/register', AuthController.registerInit);
authRouter.post('/verify-otp', AuthController.verifyOtp);
authRouter.post('/resend-otp', AuthController.resendOtp);
authRouter.post('/login', AuthController.login);
authRouter.post('/refresh', AuthController.refresh);
authRouter.post('/logout', AuthController.logout);
authRouter.get('/me', authenticate, AuthController.getMe);

export default authRouter;
