import express from "express";
import { RegisterData, TampilDataUser, LoginData, LogoutData } from "../controller/UserController.js";
import { verifyToken } from "../middleware/verify.js";
import { refreshToken } from "../controller/RefreshToken.js";
import { TambahData, TampilData, DetailPost, TambahMenu, TampilMenu } from "../controller/MenuController.js";

const router = express.Router();

// CRUD
// Product
router.post("/post", TambahData);
router.get("/post", TampilData);
router.get("/post/:id", DetailPost);

// Menu
router.post("/menu", TambahMenu);
router.get("/menu", TampilMenu);

// Users
router.get("/users", verifyToken, TampilDataUser);
router.get("/token", refreshToken);
router.post("/users", RegisterData);
router.post("/login", LoginData);
router.delete("/logout", verifyToken, LogoutData);

export default router;
