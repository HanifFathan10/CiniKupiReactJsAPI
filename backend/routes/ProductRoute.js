import express from "express";
import { RegisterData, TampilDataUser, LoginData, LogoutData } from "../controller/UserController.js";
import { verifyToken } from "../middleware/verify.js";
import { refreshToken } from "../controller/RefreshToken.js";
import { TambahData, TampilData, DetailPost, TambahMenu, TampilMenu, getMenuById, TambahMenuById, updateNestedData, getNestedDataById } from "../controller/MenuController.js";

const router = express.Router();

// CRUD
// Product
router.post("/post", TambahData);
router.get("/post", TampilData);
router.get("/post/:id", DetailPost);

// Menu
router.post("/menu", TambahMenu);
router.get("/menu", TampilMenu);
router.get("/menu/:id", getMenuById);
router.get("/nested/:id", getNestedDataById);
router.put("/menu/:id", TambahMenuById);
router.patch("/nested/:id", updateNestedData);

// Users
router.get("/users", verifyToken, TampilDataUser);
router.get("/token", refreshToken);
router.post("/users", RegisterData);
router.post("/login", LoginData);
router.delete("/logout", verifyToken, LogoutData);

export default router;
