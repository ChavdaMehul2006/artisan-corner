const { z } = require('zod');

const createReviewSchema = z.object({
  body: z.object({
    productId: z.string().min(1, 'Product ID is required'),
    orderId: z.string().min(1, 'Order ID is required'),
    rating: z.coerce.number().min(1, 'Rating must be at least 1').max(5, 'Rating cannot exceed 5'),
    comment: z.string().min(5, 'Review must be at least 5 characters').max(1000)
  })
});

const updateReviewSchema = z.object({
  body: z.object({
    rating: z.coerce.number().min(1).max(5).optional(),
    comment: z.string().min(5).max(1000).optional()
  })
});

module.exports = {
  createReviewSchema,
  updateReviewSchema
};
