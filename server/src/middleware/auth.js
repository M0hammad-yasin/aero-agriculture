const {verifyToken}=require('../utils/jwtUtils');
const AppError=require('../utils/appError');
const config = require('../config/config');
const auth = (req, res, next) => {
  const authHeader = req.header('Authorization');
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;

  if (!token) {
    return next(new AppError('Authorization token missing', 401));
  }
  const decoded = verifyToken(token, config.jwtSecret);
  if (!decoded?.user?.id) {
    return next(new AppError('Invalid token payload', 401));
  }

  req.user = decoded.user;
  next();
};
module.exports=auth;