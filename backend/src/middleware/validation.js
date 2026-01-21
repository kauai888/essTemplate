/**
 * Request Validation Middleware
 * Validates incoming requests
 */

/**
 * Validate request body
 */
const validateRequest = (requiredFields) => {
  return (req, res, next) => {
    const { body } = req;
    const missingFields = [];

    requiredFields.forEach((field) => {
      if (!body[field] || body[field].toString().trim() === '') {
        missingFields.push(field);
      }
    });

    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Missing required fields: ${missingFields.join(', ')}`,
      });
    }

    next();
  };
};

/**
 * Sanitize user input
 */
const sanitizeInput = (req, res, next) => {
  if (req.body) {
    Object.keys(req.body).forEach((key) => {
      if (typeof req.body[key] === 'string') {
        req.body[key] = req.body[key].trim();
      }
    });
  }
  next();
};

module.exports = {
  validateRequest,
  sanitizeInput,
};
