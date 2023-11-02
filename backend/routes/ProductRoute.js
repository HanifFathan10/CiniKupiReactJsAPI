import express from "express";
import { RegisterData, TampilDataUser, LoginData, LogoutData } from "../controller/UserController.js";
import { verifyToken } from "../middleware/verify.js";
import { refreshToken } from "../controller/RefreshToken.js";
import { TambahData, TampilData, DetailPost, TambahMenu, TampilMenu, getMenuById, UbahMenuById, updateNestedData, getNestedMenuById, InsertNestedDataById, getNameByUrl } from "../controller/MenuController.js";

const router = express.Router();

// CRUD
// Product
router.post("/post", TambahData);

router.get("/post", TampilData);
router.get("/post/:id", DetailPost);

// Menu
router.post("/menu", TambahMenu);
router.post("/nested/:id", InsertNestedDataById);

router.get("/menu", TampilMenu);
router.get("/menu/:id", getMenuById);
router.get("/nested/:id", getNestedMenuById);
router.get("/menu/product/:nameurl", getNameByUrl); // controller for get by name url

router.put("/menu/:id", UbahMenuById);
router.patch("/nested/:id", updateNestedData);

// Users
router.get("/users", verifyToken, TampilDataUser);
router.get("/token", refreshToken);

router.post("/users", RegisterData);
router.post("/login", LoginData);

router.delete("/logout", verifyToken, LogoutData);

export default router;
