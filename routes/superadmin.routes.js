import express from 'express';
import { 
  registerSuperadmin, 
  loginSuperadmin, 
  getMe 
} from '../controllers/superadmin.controller.js';
import { protect, isSuperadmin } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/register', registerSuperadmin);
router.post('/login', loginSuperadmin);
router.get('/me', protect, isSuperadmin, getMe);

export default router;