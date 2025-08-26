import { Router } from 'express';
import {
  createProject,
  getAllProjects,
  getProjectById,
  updateProject,
  deleteProject
} from '../controllers/project.controller.js';
import upload from './../middlewares/upload.js'; 

const router = Router();

router.post('/post', upload.single('projectImage'), createProject);
router.get('/get', getAllProjects);
router.get('/get/:id', getProjectById);
router.put('/update/:id', upload.single('projectImage'), updateProject);
router.delete('/delete/:id', deleteProject);

export default router;