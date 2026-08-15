class ApiResponse {
  constructor(statusCode, data, message = 'Success') {
    this.statusCode = statusCode;
    this.data = data;
    this.message = message;
    this.success = statusCode < 400;
  }

  static send(res, statusCode, data = null, message = 'Success') {
    return res.status(statusCode).json({
      success: statusCode < 400,
      message,
      data
    });
  }
}

module.exports = ApiResponse;
