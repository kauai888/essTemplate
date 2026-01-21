/**
 * Password Utilities
 * Password hashing and validation helpers
 */

const bcrypt = require('bcrypt');
const config = require('../config/app');

const hashPassword = async (password) => {
  try {
    const salt = await bcrypt.genSalt(config.security.bcryptRounds);
    return await bcrypt.hash(password, salt);
  } catch (error) {
    throw new Error('Error hashing password: ' + error.message);
  }
};


const comparePassword = async (password, hashedPassword) => {
  try {
    return await bcrypt.compare(password, hashedPassword);
  } catch (error) {
    throw new Error('Error comparing passwords: ' + error.message);
  }
};

const validatePasswordStrength = (password) => {
  const minLength = 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecialChar = /[!@#$%^&*]/.test(password);

  if (password.length < minLength) {
    return { valid: false, message: 'Password must be at least 8 characters' };
  }

  if (!hasUppercase) {
    return { valid: false, message: 'Password must contain an uppercase letter' };
  }

  if (!hasNumber) {
    return { valid: false, message: 'Password must contain a number' };
  }

  return { valid: true, message: 'Password is strong' };
};

module.exports = {
  hashPassword,
  comparePassword,
  validatePasswordStrength,
};
