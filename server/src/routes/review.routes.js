const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/review.controller');
const { protect } = require('../middleware/auth');
const validate = require('../middleware/validate.middleware');
const { createReviewSchema } = require('../validators/review.validator');

// Public reviews on products
router.get('/product/:productId', reviewController.getProductReviews);

// Protected routes
router.get('/eligibility/:productId', protect, reviewController.checkEligibility);
router.post('/', protect, validate(createReviewSchema), reviewController.addReview);

module.exports = router;
