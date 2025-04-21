import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import connectDB from './configs/mongodb.js';
import userRouter from './routes/userRoute.js';
import imageRouter from './routes/imageRoute.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());

// 👇 Only use raw parser for Clerk webhooks
app.use('/api/user/webhooks', express.raw({ type: 'application/json' }));

// 👇 For all other routes, use JSON parser
app.use(express.json());

// DB Connection
await connectDB();

// Routes
app.get('/', (req, res) => res.send('API is running...'));
app.use('/api/user', userRouter); // ✅ Fixed route path
app.use('/api/image', imageRouter);

// Start Server
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
