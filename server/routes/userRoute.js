import express from 'express';
import { clerkWebhook, paypalPayment, userCredits } from '../controllers/userController.js';
import authUser from '../middlewear/auth.js';

const userRouter = express.Router();   

userRouter.post('/webhooks', clerkWebhook); // Clerk webhook route   
userRouter.get('/credits', authUser, userCredits);
userRouter.post('/pay-paypal', authUser, paypalPayment);

export default userRouter;
