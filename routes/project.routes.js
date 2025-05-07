import { Router } from 'express';
import multer from 'multer';
import {
  createProject,
  getAllProjects,
  getProjectById,
  updateProject,
  deleteProject
} from '../controllers/project.controller.js';

// Configure multer for serverless environments
const storage = multer.memoryStorage(); // Store files in memory

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
    files: 1 // Only allow 1 file
  },
  fileFilter: (req, file, cb) => {
    // Validate image file types
    const allowedMimeTypes = [
      'image/jpeg',
      'image/png',
      'image/webp',
      'image/svg+xml'
    ];
    
    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only images are allowed.'), false);
    }
  }
});

const router = Router();

// Project routes with proper file handling
router.post('/post', upload.single('image'), createProject);
router.get('/get', getAllProjects);
router.get('/get/:id', getProjectById);
router.put('/update/:id', upload.single('image'), updateProject);
router.delete('/delete/:id', deleteProject);

// Error handling middleware for multer
router.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    // Handle multer-specific errors
    return res.status(400).json({
      success: false,
      error: err.code === 'LIMIT_FILE_SIZE' 
        ? 'File too large (max 5MB)'
        : err.message
    });
  } else if (err) {
    // Handle other errors
    return res.status(400).json({
      success: false,
      error: err.message
    });
  }
  next();
});

export default router;