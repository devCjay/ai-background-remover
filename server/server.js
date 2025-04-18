import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import connectDB from './configs/mongodb.js';


// APP Config
const PORT = process.env.PORT || 5000;
const app = express();
await connectDB(); // Connect to MongoDB    


// Initialize Middleware
app.use(express.json());
app.use(cors());    


// API Routes
app.get('/', (req, res) => res.send('API is running...'));  

app.listen(PORT, () => {        
  console.log(`Server is running on port ${PORT}`);
});


