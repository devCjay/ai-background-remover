import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import connectDB from './configs/mongodb.js';
import userRouter from './routes/userRoute.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// DB Connection
await connectDB(); // This is now totally fine on Railway

// Routes
app.get('/', (req, res) => res.send('API is running...'));
app.use('api/user', userRouter); // Use the user router for user-related routes 


// Start Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});