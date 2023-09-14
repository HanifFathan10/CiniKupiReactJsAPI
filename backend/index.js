import express from 'express';
import dotenv from "dotenv";
import router from './routes/ProductRoute.js';
import ConnectDb from './config/db.js';
import cors from 'cors';

dotenv.config();
const app = express();

app.use(cors())

// ConnectDb()
ConnectDb();

// Routing
app.use('/api/v1', router)
app.use(express.json());

// Server express
app.(process.env.PORT, () => {
  console.log(`server running brow di port 5000`);
});