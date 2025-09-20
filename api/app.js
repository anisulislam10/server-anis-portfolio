import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
dotenv.config();

import connectDB from '../config/db.config.js';
import superadminRoutes from '../routes/superadmin.routes.js';
import blogRoutes from '../routes/blog.routes.js';
import projectRoutes from '../routes/project.routes.js';
import contactRoutes from '../routes/contact.routes.js';
import paymentRoutes from '../routes/payment.routes.js';



const app = express();
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// Connect to database
connectDB();

// Middleware
// Middleware
app.use(express.json());
app.use(cors({
  origin: ['https://anisdev.vercel.app', 'http://localhost:5173',],  credentials: true
}));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/v1/superadmin', superadminRoutes);
app.use('/api/v1/blog', blogRoutes);
app.use('/api/v1/project', projectRoutes);
app.use('/api/v1/contact', contactRoutes);
app.use('/api/v1/payment', paymentRoutes);







// Test route
app.get('/server/status', (req, res) => {
  res.send('Superadmin API running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
