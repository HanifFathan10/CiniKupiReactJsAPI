import express from 'express'
import { TambahData, TampilData, DetailPost } from '../controller/UserController.js';

const router = express.Router();

// CRUD
// create data
router.post('/tambah', TambahData)

// show data
router.get('/post', TampilData)
router.get('/post/:id', DetailPost)

export default router