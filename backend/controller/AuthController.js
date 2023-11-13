import { google } from "googleapis";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import usersConnection from "../models/UsersModel.js";
dotenv.config();

const oauth2Client = new google.auth.OAuth2(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET, `${process.env.SERVER_URL_VERCEL}/auth/google/callback`);

const scopes = ["https://www.googleapis.com/auth/userinfo.email", "https://www.googleapis.com/auth/userinfo.profile"];

const authorizationUrl = oauth2Client.generateAuthUrl({
  access_type: "offline",
  scope: scopes,
  include_granted_scopes: true,
});

export const AuthGoogle = (req, res) => {
  res.redirect(authorizationUrl);
};

export const AuthGoogleCallback = async (req, res) => {
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

  const payload = {
    _id: user?._id,
    username: user?.username,
    email: user?.email,
  };

  const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "1h" });
  const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "1d" });

  if (!user) {
    await usersConnection.create({
      username: data.name,
      email: data.email,
      refresh_token: refreshToken,
    });
  }

  await usersConnection.updateOne(
    {_id: user._id},
    { $set: { refresh_token: refreshToken}}
  )

  res.cookie("refreshToken", refreshToken, {
    secure: true, // aktifkan jika mengakses menggunakan https
    maxAge: 3600000,
    sameSite: "none",
  });

  res.redirect(`${process.env.CLIENT_URL_VERCEL}/auth-success?accessToken=${accessToken}`);
};
