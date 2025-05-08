import express from 'express';
import {
  createPost,
  getPosts,
  getPostById,
  updatePost,
  deletePost
} from '../controllers/blog.controller.js';

const router = express.Router();

router.post('/post',  createPost);
router.get('/get', getPosts);
router.get('/get/:slug', getPostById);
router.put('/update/:slug', updatePost);
router.delete('/delete/:slug', deletePost);

export default router;