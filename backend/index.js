import express from "express";
import dotenv from "dotenv";
import router from "./routes/ProductRoute.js";
import ConnectDb from "./config/db.js";
import cors from "cors";
import bodyParser from "body-parser";
import route from "./routes/AuthRoute.js";
import cookieParser from 'cookie-parser'

dotenv.config();
const app = express();
app.use(express.json());
app.use(cookieParser())
app.use(express.static("public"));

const jsonParser = bodyParser.json();

const corsOptions = {
  origin: `${process.env.CLIENT_URL_VERCEL}`,
  methods: 'GET, POST, PATCH, PUT, DELETE',
  allowedHeaders: 'Content-Type, Authorization',
  credentials: true,
};

app.use(cors(corsOptions));

// Routing
app.get("/", (req, res) => {
  res.send("Hello World");
});
app.use("/api/v1", jsonParser, router);
app.use("/auth", jsonParser, route);

// ConnectDb()
ConnectDb();

// Server express
app.listen(process.env.PORT, () => {
  console.log(`server running brow di port ${process.env.PORT}`);
});
