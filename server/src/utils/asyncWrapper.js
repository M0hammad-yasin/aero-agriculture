/**
 * Async wrapper utility to handle rejected promises in Express route handlers
 * This wrapper catches any errors from async functions and passes them to Express error handling middleware
 * 
 * @param {Function} fn - The async function to wrap
 * @returns {Function} - Express middleware function
 */
const asyncWrapper = (fn) => {
    return (req, res, next) => {
      // Execute the async function and catch any promise rejections
      Promise.resolve(fn(req, res, next)).catch(next);
    };
  };
  
  module.exports = asyncWrapper;