const jwt = require('jsonwebtoken');
const config = require('../config/config');

/**
 * Middleware to verify JWT token and protect routes
 */
module.exports = function(req, res, next) {
  // Get token from header
  const authHeader = req.header('Authorization');
  const token = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null;
  // Check if no token
  if (!token) {
    return res.status(401).json({ 
      error: 'No token, authorization denied',
      isSuccess: false 
    });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, config.jwtSecret);
    
    // Add user from payload
    req.user = decoded.user;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        error: 'Token expired', 
        isSuccess: false 
      });
    }
    res.status(401).json({ 
      error: 'Token is not valid',
      isSuccess: false 
    });
  }
};