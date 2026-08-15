const reviewService = require('../services/review.service');
const ApiResponse = require('../utils/apiResponse');

class ReviewController {
  async addReview(req, res, next) {
    try {
      const review = await reviewService.addReview(req.user._id, req.body);
      return ApiResponse.send(res, 201, review, 'Thank you for your verified artisan review!');
    } catch (error) {
      next(error);
    }
  }

  async getProductReviews(req, res, next) {
    try {
      const data = await reviewService.getProductReviews(
        req.params.productId,
        req.query.page,
        req.query.limit
      );
      return ApiResponse.send(res, 200, data, 'Reviews retrieved.');
    } catch (error) {
      next(error);
    }
  }

  async checkEligibility(req, res, next) {
    try {
      const eligibility = await reviewService.checkEligibility(req.user._id, req.params.productId);
      return ApiResponse.send(res, 200, eligibility, 'Eligibility status.');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ReviewController();
