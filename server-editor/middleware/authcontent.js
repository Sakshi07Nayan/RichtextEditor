const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const protect = async (req, res, next) => {
  try {
    // Get token from header - now handles both formats
    let token = req.header('Authorization');
    
    // Check if token exists and extract it
    if (token && token.startsWith('Bearer ')) {
      token = token.slice(7);
    }
    
    if (!token) {
      return res.status(401).json({ 
        success: false,
        message: 'Access denied. No token provided.' 
      });
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Get user from token
      const user = await User.findById(decoded.id).select('-password');
      
      if (!user) {
        return res.status(401).json({ 
          success: false,
          message: 'Invalid token - User not found' 
        });
      }
      
      req.user = user;
      next();
    } catch (error) {
      return res.status(401).json({ 
        success: false,
        message: 'Invalid token - Authentication failed' 
      });
    }
  } catch (error) {
    return res.status(500).json({ 
      success: false,
      message: 'Server error during authentication' 
    });
  }
};

module.exports = { protect };