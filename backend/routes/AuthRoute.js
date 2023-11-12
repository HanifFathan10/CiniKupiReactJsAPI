import express from "express";
import { AuthGoogle, AuthGoogleCallback } from "../controller/AuthController.js";

const route = express.Router();

route.get("/google", AuthGoogle)
route.get("/google/callback", AuthGoogleCallback)

export default route