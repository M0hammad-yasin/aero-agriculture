const jwt = require('jsonwebtoken');
const config = require('../config/config');

/**
 * Generate an access token for a user
 * @param {string} userId - The user ID to include in the token
 * @returns {string} The generated access token
 */
exports.generateAccessToken = (userId) => {
  const payload = {
    user: {
      id: userId,
    },
  };
  
  return jwt.sign(payload, config.jwtSecret, { expiresIn: config.accessTokenExpiry });
};

/**
 * Generate a refresh token for a user
 * @param {string} userId - The user ID to include in the token
 * @returns {string} The generated refresh token
 */
exports.generateRefreshToken = (userId) => {
  const payload = {
    user: {
      id: userId,
    },
  };
  
  return jwt.sign(payload, config.refreshSecret, { expiresIn: config.refreshTokenExpiry });
};

/**
 * Verify a JWT token
 * @param {string} token - The token to verify
 * @param {string} secret - The secret to use for verification
 * @param {Object} options - Optional verification options
 * @returns {Object} The decoded token payload
 */
exports.verifyToken = (token, secret, options = {}) => {
  return jwt.verify(token, secret, options);
};

/**
 * Calculate token expiry date
 * @param {number} minutes - Minutes from now when the token will expire
 * @returns {Date} The expiry date
 */
exports.calculateExpiryDate = (minutes) => {
  const expiryDate = new Date();
  expiryDate.setMinutes(expiryDate.getMinutes() + minutes);
  return expiryDate;
};

/**
 * Calculate refresh token expiry date
 * @param {number} days - Days from now when the token will expire
 * @returns {Date} The expiry date
 */
exports.calculateRefreshExpiryDate = (days = 7) => {
  const expiryDate = new Date();
  expiryDate.setDate(expiryDate.getDate() + days);
  return expiryDate;
};