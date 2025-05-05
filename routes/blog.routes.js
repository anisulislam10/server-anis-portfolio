import express from 'express';
import {
  createPost,
  getPosts,
  getPostById,
  updatePost,
  deletePost
} from '../controllers/blog.controller.js';
import upload from '../config/multer.config.js';

const router = express.Router();

router.post('/post', upload.single('image'), createPost);
router.get('/get', getPosts);
router.get('/get/:id', getPostById);
router.put('/update/:id', upload.single('image'), updatePost);
router.delete('/delete/:id', deletePost);

export default router;