import 'dotenv/config';
import express from 'express';
import serverless from 'serverless-http';
import cors from 'cors';
import connectDB from '../configs/mongodb.js';

const app = express();
app.use(cors());
app.use(express.json());

app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    return res.status(500).json({ error: 'Database connection failed' });
  }
});

app.get('/', (req, res) => {
  res.send('API is working 🎉');
});

export default serverless(app);
