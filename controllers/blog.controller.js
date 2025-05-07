// controllers/blogController.js
import BlogPost from '../models/Blog.models.js';
import cloudinary from '../utils/cloudinary.utils.js';

import fs from 'fs/promises';


// Helper function to delete old image file
const deleteOldImage = (imageUrl) => {
  if (imageUrl) {
    const imagePath = path.join(__dirname, '..', 'public', imageUrl);
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }
  }
};

// Create new post
export const createPost = async (req, res) => {
  try {
    const { path } = req.file;
    const result = await cloudinary.uploader.upload(path);

    // const { title, subtitle, description, category } = req.body;
    
    const newPost = new BlogPost({
      ...req.body,
      imageUrl: result.secure_url,
     
    });

    await newPost.save();
        await fs.unlink(path);

    res.status(201).json(newPost);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all posts
export const getPosts = async (req, res) => {
  try {
    const posts = await BlogPost.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single post by ID
export const getPostById = async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update post
export const updatePost = async (req, res) => {
  try {
    const { title, subtitle, description, category } = req.body;
    const post = await BlogPost.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // If new image uploaded, delete old image and update with new one
    if (req.file) {
      deleteOldImage(post.imageUrl);
      post.imageUrl = `/uploads/${req.file.filename}`;
    }

    // Update other fields
    post.title = title || post.title;
    post.subtitle = subtitle || post.subtitle;
    post.description = description || post.description;
    post.category = category || post.category;

    await post.save();
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete post
export const deletePost = async (req, res) => {
  try {
    const post = await BlogPost.findByIdAndDelete(req.params.id);
    
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Delete associated image file
    deleteOldImage(post.imageUrl);
    
    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};