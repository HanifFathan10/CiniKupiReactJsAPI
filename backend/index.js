import express from 'express';
import dotenv from "dotenv";
import router from './routes/ProductRoute.js';
import ConnectDb from './config/db.js';
import cors from 'cors';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser'


dotenv.config();
const app = express();

const jsonParser = bodyParser.json()
app.use(cookieParser())

// Routing
app.use('/api/v1', jsonParser, router)
app.use(express.urlencoded({extended : false}))

app.use(cors({ credentials: true, origin:'https://cini-kupi-react-js-api.vercel.app'}))

// ConnectDb()
ConnectDb();

// Server express
app.listen(process.env.PORT, () => {
  console.log(`server running brow di port ${process.env.PORT}`);
});