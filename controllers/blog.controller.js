// controllers/blogController.js
import BlogPost from '../models/Blog.models.js';
export const createPost = async (req, res) => {
  try {
    const { title, subtitle, description, category, } = req.body;

    const newPost = new BlogPost({
      title,
      subtitle,
      description,
      category,
    });

    await newPost.save();

    res.status(201).json({
      success: true,
      message: 'Blog post created successfully',
      post: newPost,
    });
  } catch (error) {
    console.error("Error creating blog post:", error);
    res.status(500).json({ success: false, message: error.message });
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

    // Update other fields
    post.title = title || post.title;
    post.subtitle = subtitle || post.subtitle;
    post.description = description || post.description;
    post.category = category || post.category;

    await post.save();
    res.json({
      success: true,
      message: 'Post updated successfully',
      post,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deletePost = async (req, res) => {
  try {
    const post = await BlogPost.findByIdAndDelete(req.params.id);
    
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
