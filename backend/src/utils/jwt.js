/**
 * JWT Utilities
 * Token generation and validation helpers
 */

const jwt = require('jsonwebtoken');
const config = require('../config/app');

/**
 * Generate JWT Token
 */
const generateToken = (payload, expiresIn = config.jwt.expiresIn) => {
  return jwt.sign(payload, config.jwt.secret, { expiresIn });
};

/**
 * Generate Refresh Token
 */
const generateRefreshToken = (payload) => {
  return jwt.sign(payload, config.jwt.secret, {
    expiresIn: config.jwt.refreshExpiresIn,
  });
};

/**
 * Verify Token
 */
const verifyToken = (token) => {
  try {
    return jwt.verify(token, config.jwt.secret);
  } catch (error) {
    return null;
  }
};

/**
 * Decode Token (without verification)
 */
const decodeToken = (token) => {
  return jwt.decode(token);
};

module.exports = {
  generateToken,
  generateRefreshToken,
  verifyToken,
  decodeToken,
};
