const express = require('express');
const router = express.Router();
const { register, login, refreshToken, logout, update } = require('../controllers/authController');
const auth = require('../middleware/auth');
const User = require('../models/User');

// @route   POST api/auth/register
// @desc    Register user
// @access  Public
router.post('/register', register);

// @route   POST api/auth/login
// @desc    Authenticate user & get token (Login)
// @access  Public
router.post('/login', login);

// @route   POST api/auth/refresh
// @desc    Refresh access token using refresh token
// @access  Public
router.post('/refresh-token', refreshToken);

// @route   POST api/auth/logout
// @desc    Logout user and invalidate refresh token
// @access  Public
router.post('/logout',auth, logout);

// @route   GET api/auth/user
// @desc    Get user data
// @access  Private
router.put('/user/profile',auth, update);

router.get('/user', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password -refreshTokens');
    if (!user) {
      return res.status(404).json({
        error: 'User not found',
        isSuccess: false,
        status: 404
      });
    }
    
    res.json({
      isSuccess: true,
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        image: user.profileImg,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      },
      error: null,
      status: 200
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      error: 'Server error',
      isSuccess: false,
      status: 500
    });
  }
});

module.exports = router;