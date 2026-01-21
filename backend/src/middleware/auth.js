/**
 * Authentication Middleware
 * Validates JWT tokens and user roles
 */

const jwt = require('jsonwebtoken');
const config = require('../config/app');

/**
 * Verify JWT Token
 */
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'No token provided',
    });
  }

  try {
    const decoded = jwt.verify(token, config.jwt.secret);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token',
      error: error.message,
    });
  }
};

/**
 * Check if user has required role
 */
const hasRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated',
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Insufficient permissions.',
      });
    }

    next();
  };
};

/**
 * Admin-only access
 */
const isAdmin = hasRole('admin');

/**
 * Employee access
 */
const isEmployee = hasRole('employee', 'admin', 'approver');

module.exports = {
  verifyToken,
  hasRole,
  isAdmin,
  isEmployee,
};
