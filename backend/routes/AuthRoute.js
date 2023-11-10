import express from "express";
import { AuthGoogle, AuthGoogleCallback } from "../controller/AuthController";

export const route = express.Router();

route.get("/google", AuthGoogle)
route.get("/google/callback", AuthGoogleCallback)