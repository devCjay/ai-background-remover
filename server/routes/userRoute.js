import exopress from 'express';
import { clerkWebhook } from '../controllers/userController.js';

const userRouter = exopress.Router();   

userRouter.post('/webhook', clerkWebhook); // Clerk webhook route   

export default userRouter;
