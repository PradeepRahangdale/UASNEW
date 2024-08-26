import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectdb from './config/connectdb.js'; // Import default export
import userRoutes from './routes/userRoutes.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const DATABASE_URL = process.env.DATABASE_URL;

// Cors policy
app.use(cors());

// Database connection
connectdb(DATABASE_URL);

// JSON
app.use(express.json());

// Use the userRoutes
app.use('/api/user', userRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
