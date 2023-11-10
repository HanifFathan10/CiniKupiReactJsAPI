import express from "express";
import dotenv from "dotenv";
import router from "./routes/ProductRoute.js";
import ConnectDb from "./config/db.js";
import cors from "cors";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import { google } from "googleapis";
import usersConnection from "./models/UsersModel.js";
import jwt from "jsonwebtoken";
import session from "express-session";

dotenv.config();
const app = express();
app.use(express.json());

app.set("trust proxy", 1);

app.use(
  session({
    secret: "secretcode",
    resave: true,
    saveUninitialize: true,
    cookie: {
      sameSite: "none",
      secure: true,
      maxAge: 1000 * 60 * 60 * 24 * 7,
    },
  })
);

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.header("Access-Control-Allow-Credentials", true);
  next();
});

app.use(express.static("public"));

const jsonParser = bodyParser.json();
app.use(cookieParser());

const oauth2Client = new google.auth.OAuth2(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET, `${process.env.SERVER_URL_VERCEL}/auth/google/callback`);

const scopes = ["https://www.googleapis.com/auth/userinfo.email", "https://www.googleapis.com/auth/userinfo.profile"];

const authorizationUrl = oauth2Client.generateAuthUrl({
  access_type: "offline",
  scope: scopes,
  include_granted_scopes: true,
});

// Routing
app.get("/", (req, res) => {
  res.send("Hello World");
});
app.use("/api/v1", jsonParser, router);
app.use(express.urlencoded({ extended: false }));
app.use(cors({ origin: "https://cini-kupi.vercel.app", credentials: true }));

// GOOGLE Login
app.get("/auth/google", (req, res) => {
  res.redirect(authorizationUrl);
});
// GOOGLE callback login
app.get("/auth/google/callback", async (req, res) => {
  const { code } = req.query;
  const { tokens } = await oauth2Client.getToken(code);
  oauth2Client.setCredentials(tokens);

  const oauth2 = google.oauth2({
    auth: oauth2Client,
    version: "v2",
  });

  const { data } = await oauth2.userinfo.get();

  if (!data) {
    return res.json({ data: data });
  }

  let user = await usersConnection.findOne({ email: data.email });

  if (!user) {
    user = await usersConnection.create({
      username: data.username,
      email: data.email,
    });
  }

  const payload = {
    _id: user._id,
    username: user.username,
    email: user.email,
  };
  const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 60 * 60 * 1 });

  res.redirect(`${process.env.CLIENT_URL_VERCEL}/auth-success?accessToken=${accessToken}`);
});

// ConnectDb()
ConnectDb();

// Server express
app.listen(process.env.PORT, () => {
  console.log(`server running brow di port ${process.env.PORT}`);
});
