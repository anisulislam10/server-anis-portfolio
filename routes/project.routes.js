import { Router } from 'express';
import multer from 'multer';
import {
  createProject,
  getAllProjects,
  getProjectById,
  updateProject,
  deleteProject
} from '../controllers/project.controller.js';

const upload = multer({ dest: 'uploads/' });
const router = Router();

router.post('/post', upload.single('image'), createProject);
router.get('/get', getAllProjects);
router.get('/get/:id', getProjectById);
router.put('/update/:id', upload.single('image'), updateProject);
router.delete('/delete/:id', deleteProject);

export default router;
