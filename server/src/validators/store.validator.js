const { z } = require('zod');

const storeApplicationSchema = z.object({
  body: z.object({
    name: z.string().min(3, 'Store name must be at least 3 characters').max(100),
    description: z.string().min(20, 'Please describe your craft in at least 20 characters').max(1000),
    phone: z.string().min(5, 'Valid contact phone number is required'),
    street: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    postalCode: z.string().optional(),
    country: z.string().optional()
  })
});

const storeUpdateSchema = z.object({
  body: z.object({
    name: z.string().min(3).max(100).optional(),
    description: z.string().min(20).max(1000).optional(),
    phone: z.string().min(5).optional(),
    street: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    postalCode: z.string().optional(),
    country: z.string().optional()
  })
});

module.exports = {
  storeApplicationSchema,
  storeUpdateSchema
};
