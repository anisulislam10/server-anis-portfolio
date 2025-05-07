import Project from '../models/project.models.js';
import cloudinary from '../utils/cloudinary.utils.js';
import fs from 'fs/promises';

export const createProject = async (req, res) => {
  try {
    const { path } = req.file;
    const result = await cloudinary.uploader.upload(path);
    const project = new Project({
      ...req.body,
      technologies: req.body.technologies?.split(','),
      imageUrl: result.secure_url,
    });
    await project.save();
    await fs.unlink(path);
    res.status(201).json({ success: true, project });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const getAllProjects = async (_req, res) => {
  try {
    const projects = await Project.find();
    res.status(200).json({ success: true, projects });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ success: false, message: 'Project not found' });
    res.status(200).json({ success: true, project });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const updateProject = async (req, res) => {
  try {
    let updatedData = {
      ...req.body,
      technologies: req.body.technologies?.split(','),
    };

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path);
      updatedData.imageUrl = result.secure_url;
      await fs.unlink(req.file.path);
    }

    const project = await Project.findByIdAndUpdate(req.params.id, updatedData, { new: true });
    if (!project) return res.status(404).json({ success: false, message: 'Project not found' });
    res.status(200).json({ success: true, project });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const deleteProject = async (req, res) => {
  try {
    const deleted = await Project.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ success: false, message: 'Project not found' });
    res.status(200).json({ success: true, message: 'Project deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
