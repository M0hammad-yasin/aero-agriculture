const express = require('express');
const router = express.Router();
const { register, login, refreshToken, logout, update, getUser } = require('../controllers/authController');
const auth = require('../middleware/auth');
const { uploadProfileImage } = require('../utils/fileUpload');
const asyncWrapper = require('../utils/asyncWrapper');

// @route   POST api/auth/register
// @desc    Register user
// @access  Public
router.post('/register', uploadProfileImage, asyncWrapper(register));

// @route   POST api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', asyncWrapper(login));

// @route   POST api/auth/refresh-token
// @desc    Refresh access token using refresh token
// @access  Public
router.post('/refresh-token', asyncWrapper(refreshToken));

// @route   POST api/auth/logout
// @desc    Logout user
// @access  Private
router.post('/logout', auth, asyncWrapper(logout));

// @route   GET api/auth/user
// @desc    Get user data
// @access  Private
router.get('/user', auth, asyncWrapper(getUser));

// @route   PUT api/auth/user/profile
// @desc    Update user profile
// @access  Private
router.put('/user/profile', auth, uploadProfileImage, asyncWrapper(update));

module.exports = router;