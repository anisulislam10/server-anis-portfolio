import { Router } from 'express';
import {
  createProject,
  getAllProjects,
  getProjectById,
  updateProject,
  deleteProject
} from '../controllers/project.controller.js';

const router = Router();

router.post('/post', createProject);
router.get('/get', getAllProjects);
router.get('/get/:id', getProjectById);
router.put('/update/:id',  updateProject);
router.delete('/delete/:id', deleteProject);

export default router;
