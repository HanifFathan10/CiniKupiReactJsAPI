import express from 'express'
import { TambahData, TampilData, DetailPost, RegisterData, TampilDataUser, LoginData, LogoutData } from '../controller/UserController.js';
import { verifyToken } from '../middleware/verify.js';
import { refreshToken } from '../controller/RefreshToken.js';

const router = express.Router();

// CRUD
// Product
router.post('/post', TambahData)
router.get('/post', TampilData)
router.get('/post/:id', DetailPost)


// Users
router.get('/users', verifyToken, TampilDataUser)
router.get('/token', refreshToken)
router.post('/users', RegisterData)
router.post('/login', LoginData)
router.delete('/logout', LogoutData)

export default router