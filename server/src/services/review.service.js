const Review = require('../models/Review');
const Order = require('../models/Order');
const Product = require('../models/Product');
const ApiError = require('../utils/apiError');

class ReviewService {
  async addReview(userId, { productId, orderId, rating, comment }) {
    // Check product exists
    const product = await Product.findById(productId);
    if (!product) {
      throw new ApiError(404, 'Product not found');
    }

    // Verify purchase: User must have an order with this product and PAID status (Rule 4)
    const validOrder = await Order.findOne({
      _id: orderId,
      buyer: userId,
      paymentStatus: 'PAID',
      'items.product': productId
    });

    if (!validOrder) {
      throw new ApiError(
        403,
        'Verified purchase required: You can only review products you have purchased and paid for.'
      );
    }

    // Check if user has already reviewed this product for this order
    const existingReview = await Review.findOne({
      product: productId,
      user: userId,
      order: orderId
    });

    if (existingReview) {
      throw new ApiError(400, 'You have already submitted a review for this purchase.');
    }

    const review = await Review.create({
      product: productId,
      user: userId,
      order: orderId,
      rating: Number(rating),
      comment,
      isVerifiedPurchase: true
    });

    // Populate user details for immediate display
    await review.populate('user', 'name avatar');

    return review;
  }

  async getProductReviews(productId, page = 1, limit = 10) {
    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.max(1, Math.min(50, parseInt(limit, 10)));
    const skip = (pageNum - 1) * limitNum;

    const [reviews, total] = await Promise.all([
      Review.find({ product: productId })
        .populate('user', 'name avatar')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .lean(),
      Review.countDocuments({ product: productId })
    ]);

    // Calculate rating distribution (1 to 5 stars)
    const distributionRaw = await Review.aggregate([
      { $match: { product: new (require('mongoose').Types.ObjectId)(productId) } },
      { $group: { _id: '$rating', count: { $sum: 1 } } }
    ]);

    const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    distributionRaw.forEach((d) => {
      distribution[d._id] = d.count;
    });

    return {
      reviews,
      distribution,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum)
      }
    };
  }

  async checkEligibility(userId, productId) {
    const purchasedOrders = await Order.find({
      buyer: userId,
      paymentStatus: 'PAID',
      'items.product': productId
    }).select('_id orderNumber createdAt');

    if (purchasedOrders.length === 0) {
      return { eligible: false, reason: 'You have not purchased this product yet.' };
    }

    // Find any order that hasn't been reviewed yet
    for (const order of purchasedOrders) {
      const existingReview = await Review.findOne({
        product: productId,
        user: userId,
        order: order._id
      });
      if (!existingReview) {
        return {
          eligible: true,
          orderId: order._id,
          orderNumber: order.orderNumber
        };
      }
    }

    return { eligible: false, reason: 'You have already reviewed all purchases of this product.' };
  }
}

module.exports = new ReviewService();
