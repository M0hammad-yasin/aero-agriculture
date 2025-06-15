const jwt = require('jsonwebtoken');
const config = require('../config/config');
const AppError = require('./appError');

/**
 * Generate an access token for a user
 * @param {string} userId - The user ID to include in the token
 * @returns {string} The generated access token
 */
exports.generateAccessToken = (userId) => {
  try {
    const payload = {
      user: {
        id: userId,
      },
    };
    return jwt.sign(payload, config.jwtSecret, { expiresIn: config.accessTokenExpiry });
  } catch (err) {
    throw new AppError('Failed to generate access token', 500);
  }
};

/**
 * Generate a refresh token for a user
 * @param {string} userId - The user ID to include in the token
 * @returns {string} The generated refresh token
 */
exports.generateRefreshToken = (userId) => {
  try {
    const payload = {
      user: {
        id: userId,
      },
    };
    return jwt.sign(payload, config.refreshSecret, { expiresIn: config.refreshTokenExpiry });
  } catch (err) {
    throw new AppError('Failed to generate refresh token', 500);
  }
};

/**
 * Verify a JWT token
 * @param {string} token - The token to verify
 * @param {string} secret - The secret to use for verification
 * @param {Object} options - Optional verification options
 * @returns {Object} The decoded token payload
 */
exports.verifyToken = (token, secret, options = {}) => {
  try {
    return jwt.verify(token, secret, options);
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      throw new AppError('Token has expired', 401);
    }
    if (err.name === 'JsonWebTokenError') {
      throw new AppError('Invalid token', 401);
    }
    throw new AppError('Token verification failed', 401);
  }
};

/**
 * Calculate token expiry date
 * @param {number} minutes - Minutes from now when the token will expire
 * @returns {Date} The expiry date
 */
exports.calculateExpiryDate = (minutes) => {
  try {
    const expiryDate = new Date();
    expiryDate.setMinutes(expiryDate.getMinutes() + minutes);
    return expiryDate;
  } catch (err) {
    throw new AppError('Failed to calculate token expiry date', 500);
  }
};

/**
 * Calculate refresh token expiry date
 * @param {number} days - Days from now when the token will expire
 * @returns {Date} The expiry date
 */
exports.calculateRefreshExpiryDate = (days = 7) => {
  try {
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + days);
    return expiryDate;
  } catch (err) {
    throw new AppError('Failed to calculate refresh token expiry date', 500);
  }
};
