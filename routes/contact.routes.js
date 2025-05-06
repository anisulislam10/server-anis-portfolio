import express from 'express';
import { contactFormHandler } from '../controllers/contact.controller.js';

const router = express.Router();

router.post('/sent-email', contactFormHandler);

export default router;
