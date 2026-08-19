const ApiError = require('../utils/apiError');

const validate = (schema) => (req, res, next) => {
  try {
    const dataToValidate = {
      body: req.body,
      query: req.query,
      params: req.params
    };

    const validated = schema.parse(dataToValidate);
    
    if (validated.body) req.body = validated.body;
    if (validated.query) req.query = validated.query;
    if (validated.params) req.params = validated.params;

    next();
  } catch (error) {
    if (error.errors) {
      const formattedErrors = error.errors.map((err) => ({
        field: err.path.join('.').replace(/^(body|query|params)\./, ''),
        message: err.message
      }));
      const detailedMessage = formattedErrors.map(e => e.message).join('. ') || 'Validation failed';
      return next(new ApiError(400, detailedMessage, formattedErrors));
    }
    next(error);
  }
};

module.exports = validate;
