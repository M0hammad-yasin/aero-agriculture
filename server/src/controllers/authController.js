const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Constants
const ACCESS_TOKEN_EXPIRY = '15m'; // 15 minutes
const REFRESH_TOKEN_EXPIRY = '7d'; // 7 days
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';
const REFRESH_SECRET = process.env.REFRESH_SECRET || 'your_refresh_secret';

// User registration
exports.register = async (req, res) => {
  const { name, profileImg, email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ 
        error: 'User already exists',
        isSuccess: false
      });
    }
    
    const tempUser = {
      name,
      email,
      password,
      ...(profileImg && { profileImg })
    }
    
    const salt = await bcrypt.genSalt(10);
    tempUser.password = await bcrypt.hash(password, salt);
    user = new User(tempUser);
    
    // Create payload for tokens
    const payload = {
      user: {
        id: user.id,
      },
    };

    // Generate access token
    const accessToken = jwt.sign(payload, JWT_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRY });
    
    // Generate refresh token
    const refreshToken = jwt.sign(payload, REFRESH_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRY });
    
    // Calculate expiry date for refresh token
    const refreshExpiry = new Date();
    refreshExpiry.setDate(refreshExpiry.getDate() + 7); // 7 days from now
    
    // Add refresh token to user document
    user.refreshTokens = [{
      token: refreshToken,
      expiresAt: refreshExpiry,
      device: req.headers['user-agent'] || 'unknown'
    }];
    
    await user.save();
    
    // Calculate expiry timestamp for client
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 15); // 15 minutes from now
    
    // Return response in format expected by client
    res.json({
      isSuccess: true,
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.profileImg,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt
        },
        accessToken,
        refreshToken,
        expiresAt: expiresAt.toISOString()
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
};

// Refresh token
exports.refreshToken = async (req, res) => {
  const { refreshToken } = req.body;
  
  // Check if refresh token exists
  if (!refreshToken) {
    return res.status(400).json({
      error: 'Refresh token is required',
      isSuccess: false,
      status: 400
    });
  }
  
  try {
    // Verify refresh token
    const decoded = jwt.verify(refreshToken, REFRESH_SECRET);
    const userId = decoded.user.id;
    
    // Find user with this refresh token
    const user = await User.findById(userId);
    if (!user) {
      return res.status(401).json({
        error: 'Invalid refresh token',
        isSuccess: false,
        status: 401
      });
    }
    
    // Check if the provided refresh token exists in the user's refreshTokens array
    const tokenIndex = user.refreshTokens.findIndex(
      token => token.token === refreshToken && token.expiresAt > new Date()
    );
    
    if (tokenIndex === -1) {
      return res.status(401).json({
        error: 'Invalid or expired refresh token',
        isSuccess: false,
        status: 401
      });
    }
    
    // Create new tokens
    const payload = {
      user: {
        id: user.id,
      },
    };
    
    // Generate new access token
    const accessToken = jwt.sign(payload, JWT_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRY });
    
    // Generate new refresh token (token rotation for better security)
    const newRefreshToken = jwt.sign(payload, REFRESH_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRY });
    
    // Calculate expiry date for new refresh token
    const refreshExpiry = new Date();
    refreshExpiry.setDate(refreshExpiry.getDate() + 7); // 7 days from now
    
    // Replace old refresh token with new one
    user.refreshTokens[tokenIndex] = {
      token: newRefreshToken,
      expiresAt: refreshExpiry,
      device: user.refreshTokens[tokenIndex].device
    };
    
    await user.save();
    
    // Calculate expiry timestamp for client
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 15); // 15 minutes from now
    
    // Return response in format expected by client
    res.json({
      isSuccess: true,
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.profileImg,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt
        },
        accessToken,
        refreshToken: newRefreshToken,
        expiresAt: expiresAt.toISOString()
      },
      error: null,
      status: 200
    });
  } catch (err) {
    console.error('Refresh token error:', err.message);
    
    if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
      return res.status(401).json({
        error: 'Invalid or expired refresh token',
        isSuccess: false,
        status: 401
      });
    }
    
    res.status(500).json({
      error: 'Server error',
      isSuccess: false,
      status: 500
    });
  }
};

// Logout user
exports.logout = async (req, res) => {
  const { refreshToken } = req.body;
  
  // If no refresh token provided, just return success
  if (!refreshToken) {
    return res.json({
      isSuccess: true,
      data: null,
      error: null,
      status: 200
    });
  }
  
  try {
    // Try to decode the token to get the user ID
    const decoded = jwt.verify(refreshToken, REFRESH_SECRET, { ignoreExpiration: true });
    const userId = decoded.user.id;
    
    // Find user and remove the specific refresh token
    const user = await User.findById(userId);
    if (user) {
      user.refreshTokens = user.refreshTokens.filter(token => token.token !== refreshToken);
      await user.save();
    }
    
    res.json({
      isSuccess: true,
      data: null,
      error: null,
      status: 200
    });
  } catch (err) {
    // Even if there's an error, we consider the logout successful
    console.error('Logout error:', err.message);
    res.json({
      isSuccess: true,
      data: null,
      error: null,
      status: 200
    });
  }
};

// User login
exports.login = async (req, res) => {
  const { email, password } = req.body;
  console.log(req.body)

  try {
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ 
        error: 'Invalid credentials',
        isSuccess: false,
        status: 400
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ 
        error: 'Invalid credentials',
        isSuccess: false,
        status: 400
      });
    }

    const payload = {
      user: {
        id: user.id,
      },
    };

    // Generate access token
    const accessToken = jwt.sign(payload, JWT_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRY });
    
    // Generate refresh token
    const refreshToken = jwt.sign(payload, REFRESH_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRY });
    
    // Calculate expiry date for refresh token
    const refreshExpiry = new Date();
    refreshExpiry.setDate(refreshExpiry.getDate() + 7); // 7 days from now
    
    // Add refresh token to user document
    const newRefreshToken = {
      token: refreshToken,
      expiresAt: refreshExpiry,
      device: req.headers['user-agent'] || 'unknown'
    };
    
    // Add the new refresh token to the user's refreshTokens array
    user.refreshTokens = user.refreshTokens || [];
    user.refreshTokens.push(newRefreshToken);
    
    // Limit the number of refresh tokens per user (optional)
    if (user.refreshTokens.length > 5) {
      // Keep only the 5 most recent tokens
      user.refreshTokens = user.refreshTokens.slice(-5);
    }
    
    await user.save();
    
    // Calculate expiry timestamp for client
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 15); // 15 minutes from now
    
    // Return response in format expected by client
    res.status(200).json({
      isSuccess: true,
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.profileImg,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt
        },
        accessToken,
        refreshToken,
        expiresAt: expiresAt.toISOString()
      },
      error: null,
    });

  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      error: 'Server error',
      isSuccess: false,
      status: 500
    });
  }
};

// Refresh token
exports.refreshToken = async (req, res) => {
  const { refreshToken } = req.body;
  
  // Check if refresh token exists
  if (!refreshToken) {
    return res.status(400).json({
      error: 'Refresh token is required',
      isSuccess: false,
      status: 400
    });
  }
  
  try {
    // Verify refresh token
    const decoded = jwt.verify(refreshToken, REFRESH_SECRET);
    const userId = decoded.user.id;
    
    // Find user with this refresh token
    const user = await User.findById(userId);
    if (!user) {
      return res.status(401).json({
        error: 'Invalid refresh token',
        isSuccess: false,
        status: 401
      });
    }
    
    // Check if the provided refresh token exists in the user's refreshTokens array
    const tokenIndex = user.refreshTokens.findIndex(
      token => token.token === refreshToken && token.expiresAt > new Date()
    );
    
    if (tokenIndex === -1) {
      return res.status(401).json({
        error: 'Invalid or expired refresh token',
        isSuccess: false,
        status: 401
      });
    }
    
    // Create new tokens
    const payload = {
      user: {
        id: user.id,
      },
    };
    
    // Generate new access token
    const accessToken = jwt.sign(payload, JWT_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRY });
    
    // Generate new refresh token (token rotation for better security)
    const newRefreshToken = jwt.sign(payload, REFRESH_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRY });
    
    // Calculate expiry date for new refresh token
    const refreshExpiry = new Date();
    refreshExpiry.setDate(refreshExpiry.getDate() + 7); // 7 days from now
    
    // Replace old refresh token with new one
    user.refreshTokens[tokenIndex] = {
      token: newRefreshToken,
      expiresAt: refreshExpiry,
      device: user.refreshTokens[tokenIndex].device
    };
    
    await user.save();
    
    // Calculate expiry timestamp for client
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 15); // 15 minutes from now
    
    // Return response in format expected by client
    res.json({
      isSuccess: true,
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.profileImg,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt
        },
        accessToken,
        refreshToken: newRefreshToken,
        expiresAt: expiresAt.toISOString()
      },
      error: null,
      status: 200
    });
  } catch (err) {
    console.error('Refresh token error:', err.message);
    
    if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
      return res.status(401).json({
        error: 'Invalid or expired refresh token',
        isSuccess: false,
        status: 401
      });
    }
    
    res.status(500).json({
      error: 'Server error',
      isSuccess: false,
      status: 500
    });
  }
};

// Logout user
exports.logout = async (req, res) => {
  const { refreshToken } = req.body;
  
  // If no refresh token provided, just return success
  if (!refreshToken) {
    return res.json({
      isSuccess: true,
      data: null,
      error: null,
      status: 200
    });
  }
  
  try {
    // Try to decode the token to get the user ID
    const decoded = jwt.verify(refreshToken, REFRESH_SECRET, { ignoreExpiration: true });
    const userId = decoded.user.id;
    
    // Find user and remove the specific refresh token
    const user = await User.findById(userId);
    if (user) {
      user.refreshTokens = user.refreshTokens.filter(token => token.token !== refreshToken);
      await user.save();
    }
    
    res.json({
      isSuccess: true,
      data: null,
      error: null,
      status: 200
    });
  } catch (err) {
    // Even if there's an error, we consider the logout successful
    console.error('Logout error:', err.message);
    res.json({
      isSuccess: true,
      data: null,
      error: null,
      status: 200
    });
  }
};