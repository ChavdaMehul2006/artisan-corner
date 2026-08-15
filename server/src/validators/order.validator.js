const { z } = require('zod');

const createOrderSchema = z.object({
  body: z.object({
    shippingAddress: z.object({
      fullName: z.string().min(2, 'Full name is required'),
      addressLine1: z.string().min(3, 'Address is required'),
      addressLine2: z.string().optional(),
      city: z.string().min(2, 'City is required'),
      state: z.string().min(2, 'State is required'),
      postalCode: z.string().min(2, 'Postal code is required'),
      country: z.string().default('United States'),
      phone: z.string().min(5, 'Phone number is required')
    }),
    items: z.array(
      z.object({
        productId: z.string().min(1, 'Product ID is required'),
        quantity: z.number().int().min(1, 'Quantity must be at least 1')
      })
    ).min(1, 'Cart cannot be empty'),
    paymentStatus: z.enum(['PENDING', 'PAID', 'FAILED', 'REFUNDED']).optional(),
    stripePaymentIntentId: z.string().optional().nullable()
  })
});

const updateOrderStatusSchema = z.object({
  body: z.object({
    status: z.enum(['PROCESSING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED'])
  })
});

module.exports = {
  createOrderSchema,
  updateOrderStatusSchema
};
