/**
 * Response Utilities
 * Standardized API response formatting
 */

const successResponse = (res, data, message = 'Success', statusCode = 200) => {
  res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

const errorResponse = (res, message = 'Error', statusCode = 500, error = null) => {
  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && error && { error }),
  });
};

const paginatedResponse = (res, data, totalCount, page, limit, message = 'Success') => {
  const totalPages = Math.ceil(totalCount / limit);

  res.status(200).json({
    success: true,
    message,
    data,
    pagination: {
      page,
      limit,
      totalCount,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    },
  });
};

module.exports = {
  successResponse,
  errorResponse,
  paginatedResponse,
};
