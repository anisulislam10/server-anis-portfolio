// models/BlogPost.js
import mongoose from 'mongoose';

const blogPostSchema = new mongoose.Schema({
  title: String,
  subtitle: String,
  description: String,
  imageUrl: String,
  category: String,
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('BlogPost', blogPostSchema);