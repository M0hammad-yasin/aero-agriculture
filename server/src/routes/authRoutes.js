const express = require('express');
const router = express.Router();
const { register, login, refreshToken, logout, update, getUser } = require('../controllers/authController');
const auth = require('../middleware/auth');
const User = require('../models/User');
const asyncWrapper=require('../utils/asyncWrapper');
// @route   POST api/auth/register
// @desc    Register user
// @access  Public
router.post('/register', asyncWrapper(register));

// @route   POST api/auth/login
// @desc    Authenticate user & get token (Login)
// @access  Public
router.post('/login', asyncWrapper(login));

// @route   POST api/auth/refresh
// @desc    Refresh access token using refresh token
// @access  Public
router.post('/refresh-token', asyncWrapper(refreshToken));

// @route   POST api/auth/logout
// @desc    Logout user and invalidate refresh token
// @access  Public
router.post('/logout',auth, asyncWrapper(logout));

// @route   GET api/auth/user
// @desc    Get user data
// @access  Private
router.put('/user/profile',auth, asyncWrapper(update));

// @route   GET api/auth/user
// @desc    Get user data
// @access  Private
router.get('/user', auth, asyncWrapper(getUser));

module.exports = router;