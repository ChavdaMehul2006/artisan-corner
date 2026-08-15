const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Store = require('../models/Store');
const ApiError = require('../utils/apiError');

// Protect routes - verify JWT from cookie or authorization header
const protect = async (req, res, next) => {
  try {
    let token = null;

    if (req.cookies && req.cookies.accessToken) {
      token = req.cookies.accessToken;
    } else if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return next(new ApiError(401, 'Authentication required. Please log in.'));
    }

    try {
      const decoded = jwt.verify(
        token,
        process.env.JWT_ACCESS_SECRET || 'fallback_access_secret_artisan_corner_2026'
      );

      const user = await User.findById(decoded.id).select('+password');

      if (!user) {
        return next(new ApiError(401, 'User account no longer exists.'));
      }

      if (!user.isActive) {
        return next(new ApiError(403, 'Your account has been deactivated. Please contact support.'));
      }

      // Attach user & store info if available
      req.user = user;
      if (user.role === 'VENDOR') {
        const store = await Store.findOne({ owner: user._id });
        req.store = store;
      }

      next();
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        return next(new ApiError(401, 'Session expired. Please refresh your token.'));
      }
      return next(new ApiError(401, 'Invalid authentication token.'));
    }
  } catch (error) {
    next(error);
  }
};

// Role-based authorization
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(
        new ApiError(403, `Access denied. Requires one of roles: [${roles.join(', ')}]`)
      );
    }
    next();
  };
};

// Require approved vendor or admin
const requireVendor = async (req, res, next) => {
  if (!req.user) {
    return next(new ApiError(401, 'Authentication required.'));
  }

  if (req.user.role === 'ADMIN') {
    return next(); // Admins have super-vendor privileges
  }

  if (req.user.role !== 'VENDOR') {
    return next(new ApiError(403, 'Vendor access required. Please apply to become a seller.'));
  }

  const store = await Store.findOne({ owner: req.user._id });
  if (!store || !store.isApproved) {
    return next(
      new ApiError(403, 'Your vendor store is pending admin approval. You cannot manage products yet.')
    );
  }

  req.store = store;
  next();
};

// Require admin
const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'ADMIN') {
    return next(new ApiError(403, 'Administrator access required.'));
  }
  next();
};

module.exports = {
  protect,
  authorize,
  requireVendor,
  requireAdmin
};
