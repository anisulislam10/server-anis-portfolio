import { verifyToken } from '../utils/jwt.utils.js';
import Superadmin from '../models/superadmin.model.js';

export const protect = async (req, res, next) => {
  let token;
  
  // Check for token in Authorization header or cookies
  if (
    req.headers.authorization && 
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies?.token) {
    token = req.cookies.token;
  }
  
  if (!token) {
    return res.status(401).json({ 
      success: false, 
      message: 'Not authorized to access this route' 
    });
  }
  
  try {
    // Verify token
    const decoded = verifyToken(token);
    
    // Check if user still exists
    const currentSuperadmin = await Superadmin.findById(decoded.id);
    if (!currentSuperadmin) {
      return res.status(401).json({ 
        success: false, 
        message: 'The user belonging to this token no longer exists' 
      });
    }
    
    // Check if user changed password after token was issued
    if (currentSuperadmin.changedPasswordAfter(decoded.iat)) {
      return res.status(401).json({ 
        success: false, 
        message: 'User recently changed password. Please log in again' 
      });
    }
    
    // Grant access to protected route
    req.superadmin = currentSuperadmin;
    next();
  } catch (err) {
    return res.status(401).json({ 
      success: false, 
      message: 'Not authorized to access this route' 
    });
  }
};

export const isSuperadmin = (req, res, next) => {
  if (!req.superadmin) {
    return res.status(403).json({ 
      success: false, 
      message: 'Superadmin privileges required' 
    });
  }
  
  // You could add additional role checks here if needed
  // For example, if you have different admin levels
  
  next();
};

// Optional: Add rate limiting for contact form submissions
export const contactRateLimit = (req, res, next) => {
  // Implement rate limiting logic here
  // Example using express-rate-limit or custom logic
  next();
};