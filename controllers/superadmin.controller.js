import Superadmin from '../models/superadmin.model.js';
import { generateToken } from '../utils/jwt.utils.js';

// @desc    Register a new superadmin
// @route   POST /api/superadmin/register
export const registerSuperadmin = async (req, res) => {
  const { username, email, password } = req.body;
  
  try {
    // Check if superadmin already exists
    const existingSuperadmin = await Superadmin.findOne({ email });
    if (existingSuperadmin) {
      return res.status(400).json({ success: false, message: 'Superadmin already exists' });
    }
    
    // Create new superadmin
    const superadmin = await Superadmin.create({ username, email, password });
    
    // Generate token
    const token = generateToken(superadmin._id);
    
    res.status(201).json({
      success: true,
      token,
      data: {
        id: superadmin._id,
        username: superadmin.username,
        email: superadmin.email
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Authenticate superadmin & get token
// @route   POST /api/superadmin/login
export const loginSuperadmin = async (req, res) => {
  const { email, password } = req.body;
  
  try {
    // Check for superadmin
    const superadmin = await Superadmin.findOne({ email });
    if (!superadmin) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
    
    // Check password
    const isMatch = await superadmin.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
    
    // Generate token
    const token = generateToken(superadmin._id);
    
    res.status(200).json({
      success: true,
      token,
      data: {
        id: superadmin._id,
        username: superadmin.username,
        email: superadmin.email
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Get current logged in superadmin
// @route   GET /api/superadmin/me
export const getMe = async (req, res) => {
  try {
    const superadmin = await Superadmin.findById(req.superadmin._id).select('-password');
    
    res.status(200).json({
      success: true,
      data: superadmin
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};