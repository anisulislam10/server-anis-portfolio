import express from 'express';
import {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject
} from '../controllers/project.controller.js';
import upload from '../config/multer.config.js';

const router = express.Router();

// Create project with image upload
router.post('/post', upload.single('image'), createProject);

// Get all projects
router.get('/get', getProjects);

// Get single project
router.get('/get/:id', getProjectById);

// Update project (with optional image update)
router.put('/update/:id', upload.single('image'), updateProject);

// Delete project
router.delete('/delete/:id', deleteProject);

export default router;