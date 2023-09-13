import express from 'express';
import dotenv from "dotenv";
import router from './routes/ProductRoute.js';
import ConnectDb from './config/db.js';
import cors from 'cors';

dotenv.config();
const app = express();
const port = process.env.PORT

app.use(cors())

// ConnectDb()
ConnectDb();

// Routing
app.use('/api/v1', router)
app.use(express.json());

// Server express
app.listen(port, () => {
  console.log(`server running brow di port ${port}`);
});