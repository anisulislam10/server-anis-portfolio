import Project from '../models/project.models.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const deleteOldImage = (imageUrl) => {
  if (imageUrl) {
    const imagePath = path.join(__dirname, '..', 'public', imageUrl);
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }
  }
};
// Create new project
export const createProject = async (req, res) => {
  try {
    const { title, subtitle, description, technologies, githubUrl, liveDemoUrl, featured } = req.body;
    
    const newProject = new Project({
      title,
      subtitle,
      description,
      technologies: JSON.parse(technologies), // Convert stringified array to array
      githubUrl,
      liveDemoUrl,
      featured,
      imageUrl: req.file ? `/uploads/${req.file.filename}` : null
    });

    await newProject.save();
    res.status(201).json(newProject);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all projects
export const getProjects = async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single project
export const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update project
export const updateProject = async (req, res) => {
  try {
    const { title, subtitle, description, technologies, githubUrl, liveDemoUrl, featured } = req.body;
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Update fields
    project.title = title || project.title;
    project.subtitle = subtitle || project.subtitle;
    project.description = description || project.description;
    project.technologies = technologies ? JSON.parse(technologies) : project.technologies;
    project.githubUrl = githubUrl || project.githubUrl;
    project.liveDemoUrl = liveDemoUrl || project.liveDemoUrl;
    project.featured = featured !== undefined ? featured : project.featured;

    // Update image if new one uploaded
    if (req.file) {
      project.imageUrl = `/uploads/projects/${req.file.filename}`;
    }

    await project.save();
    res.json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete project
export const deleteProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params._id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    // Delete associated image file
    deleteOldImage(post.imageUrl);
    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};