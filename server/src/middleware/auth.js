const jwt = require('jsonwebtoken');

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
    const decoded = jwt.verify(token, process.env.JWT_SECRET );
    
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