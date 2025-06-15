const auth = (req, res, next) => {
  const authHeader = req.header('Authorization');
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;

  if (!token) {
    return next(new AppError('Authorization token missing', 401));
  }

  const decoded = jwtUtils.verifyToken(token, config.jwtSecret);

  // ✅ Still necessary to check structure
  if (!decoded?.user?.id) {
    return next(new AppError('Invalid token payload', 401));
  }

  req.user = decoded.user;
  next();
};
module.exports=auth;