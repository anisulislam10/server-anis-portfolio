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
router.get('/get/:id', getPostById);
router.put('/update/:id', updatePost);
router.delete('/delete/:id', deletePost);

export default router;