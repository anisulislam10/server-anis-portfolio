import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  subtitle: String,
  description: String,
  technologies: [String],
  githubUrl: String,
  liveDemoUrl: String,
  featured: { type: Boolean, default: false },
  imageUrl: String,
}, { timestamps: true });

const Project = mongoose.model('Project', projectSchema);
export default Project;
