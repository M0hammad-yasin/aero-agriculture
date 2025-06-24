const User = require('../models/User');
const config = require('../config/config');
const passwordUtils = require('../utils/passwordUtils');
const jwtUtils = require('../utils/jwtUtils');
const parseExpiry = require('../utils/parseExpiry');
const AppError = require('../utils/appError');

// User registration
exports.register = async (req, res) => {
  const { name, email, password, confirmPassword } = req.body;
  
  // Check if password and confirmPassword match
  if (password !== confirmPassword) {
    return res.status(400).json({
      data: null,
      error: 'Passwords do not match',
      isSuccess: false
    });
  }
  
  let user = await User.findOne({ email });
  if (user) {
    return res.status(403).json({ 
      data: null,
      error: 'User already exists',
      isSuccess: false
    });
  }
  
  const tempUser = {
    name,
    email,
    password,
    ...(req.file && { profileImg: req.file.path.replace(/\\/g, '/') }) // Convert Windows path to URL format
  }
  
  tempUser.password = await passwordUtils.hashPassword(password);
  user = new User(tempUser);
  
  // Generate tokens
  const accessToken = jwtUtils.generateAccessToken(user.id);
  const refreshToken = jwtUtils.generateRefreshToken(user.id);
  
  // Calculate expiry date for refresh token
  const refreshExpiry = jwtUtils.calculateRefreshExpiryDate();
  
  // Add refresh token to user document
  user.refreshTokens = [{
    token: refreshToken,
    expiresAt: refreshExpiry,
    device: req.headers['user-agent'] || 'unknown'
  }];
  
  await user.save();
  
  // Calculate expiry timestamp for client
  const expiresAt = jwtUtils.calculateExpiryDate(15);
  
  // Set refresh token in HTTP-only cookie
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: config.isProduction,
    sameSite: 'strict',
    maxAge: parseExpiry(config.refreshTokenExpiry),
    path: '/'
  });
  
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
      expiresAt: expiresAt.toISOString()
    },
    error: null,
    status: 200
  });
};

exports.update = async (req, res) => {
  const { name, email } = req.body;
  const id = req.user.id;
  
  let user = await User.findById(id);
  if (!user) {
    throw new AppError('User not found', 404);
  }

  // Check if new email already exists
  if (email && user.email !== email) {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new AppError('Email already exists', 403);
    }
  }
  
  // Update user data
  user = await User.findByIdAndUpdate(
    id,
    {
      ...(name && { name }),
      ...(email && { email }),
      ...(req.file && { profileImg: req.file.path.replace(/\\/g, '/') })
    },
    {
      new: true,
      runValidators: true
    }
  );

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
};

// Refresh token
exports.refreshToken = async (req, res) => {
  // Try to get refresh token from request body first, then from cookie
  let refreshToken = req.body?.refreshToken || req.cookies.refreshToken;
  // Check if refresh token exists
  if (!refreshToken) {
    return res.status(400).json({
      error: 'Refresh token is required',
      isSuccess: false,
      status: 400
    });
  }
  
  // Verify refresh token
  const decoded = jwtUtils.verifyToken(refreshToken, config.refreshSecret);
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
  const accessToken = jwtUtils.generateAccessToken(user.id);
  
  // Generate new refresh token (token rotation for better security)
  const newRefreshToken = jwtUtils.generateRefreshToken(user.id);
  
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
  const expiresAt = jwtUtils.calculateExpiryDate(15);
  
  // Set new refresh token in HTTP-only cookie
  res.cookie('refreshToken', newRefreshToken, {
    httpOnly: true, // Prevents JavaScript access to the cookie
    secure: config.isProduction, // Use secure cookies in production
    sameSite: 'strict', // Prevents the cookie from being sent in cross-site requests
    maxAge: parseExpiry(config.refreshTokenExpiry), 
    path: '/' // Cookie is accessible from all paths
  });
  
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
      expiresAt: expiresAt.toISOString()
    },
    error: null,
    status: 200
  });
};

// Logout user
exports.logout = async (req, res) => {
  // Try to get refresh token from request body first, then from cookie
  let refreshToken = req.body?.refreshToken || req.cookies.refreshToken;
  
  // Clear the refresh token cookie regardless of whether a token was provided
  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/'
  });
  
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
    const decoded = jwtUtils.verifyToken(refreshToken, config.refreshSecret, { ignoreExpiration: true });
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

  let user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ 
      error: 'email is not registered',
      isSuccess: false,
      status: 400
    });
  }

  const isMatch = await passwordUtils.comparePassword(password, user.password);
  if (!isMatch) {
    return res.status(400).json({ 
      error: 'password is incorrect',
      isSuccess: false,
      status: 400
    });
  }

  // Generate access token
  const accessToken = jwtUtils.generateAccessToken(user.id);

  const refreshToken = jwtUtils.generateRefreshToken(user.id);
  
  // Calculate expiry date for refresh token
  const refreshExpiry = jwtUtils.calculateRefreshExpiryDate();
  
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
  const expiresAt = jwtUtils.calculateExpiryDate(15);
  
  // Set refresh token in HTTP-only cookie
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true, // Prevents JavaScript access to the cookie
    secure: config.isProduction, // Use secure cookies in production
    sameSite: 'strict', // Prevents the cookie from being sent in cross-site requests
    maxAge: parseExpiry(config.refreshTokenExpiry),
    path: '/' // Cookie is accessible from all paths
  });
  
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
      expiresAt: expiresAt.toISOString()
    },
    error: null,
  });
};

// Get user data
exports.getUser = async (req, res) => {
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
};