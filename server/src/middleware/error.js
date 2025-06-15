/**
 * Global error handling middleware for Express
 * This middleware catches all errors passed by asyncWrapper and other middleware
 * and sends a consistent error response to the client
 */
const error = (err, req, res, next) => {
    console.error('Error caught by global error handler:', err);
  
    // Default error response
    let data = {
      isSuccess: false,
      error: 'Internal Server Error',
      status: 500,
      data: null
    };
  
    // Handle specific error types
    if (err.name === 'ValidationError') {
      // Mongoose validation error
      data.error = Object.values(err.errors).map(val => val.message).join(', ');
      data.status = 400;
    } else if (err.name === 'CastError') {
      // Mongoose bad ObjectId
      data.error = 'Resource not found';
      data.status = 404;
    } else if (err.code === 11000) {
      // Mongoose duplicate key error
      const field = Object.keys(err.keyValue)[0];
      data.error = `Duplicate field value: ${field}`;
      data.status = 400;
    } else if (err.name === 'JsonWebTokenError') {
      // JWT error
      data.error = 'Invalid token';
      data.status = 401;
    } else if (err.name === 'TokenExpiredError') {
      // JWT expired
      data.error = 'Token expired';
      data.status = 401;
    } else if (err.message) {
      // Use the error message if available
      data.error = err.message;
      data.status = err.status || err.statusCode || 500;
    }
  
    res.status(data.status).json(data);
  };
  
  module.exports = error;