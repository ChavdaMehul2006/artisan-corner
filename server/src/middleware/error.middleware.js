const ApiError = require('../utils/apiError');

const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;
  error.statusCode = err.statusCode || 500;
  error.errors = err.errors || [];

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    const message = `Resource not found with id of ${err.value}`;
    error = new ApiError(404, message);
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    const message = `Duplicate value entered for ${field} field. Please use another value.`;
    error = new ApiError(409, message, [{ field, message }]);
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = 'Validation Error';
    const errors = Object.values(err.errors).map((val) => ({
      field: val.path,
      message: val.message
    }));
    error = new ApiError(400, message, errors);
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    error = new ApiError(401, 'Invalid authentication token');
  }

  if (err.name === 'TokenExpiredError') {
    error = new ApiError(401, 'Token expired. Please login again.');
  }

  const isProduction = process.env.NODE_ENV === 'production';

  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || 'Internal Server Error',
    errors: error.errors.length > 0 ? error.errors : undefined,
    ...(isProduction ? {} : { stack: err.stack })
  });
};

module.exports = errorHandler;
