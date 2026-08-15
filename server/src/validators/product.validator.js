const { z } = require('zod');

const productSchema = z.object({
  body: z.object({
    name: z.string().min(3, 'Product name must be at least 3 characters').max(150),
    description: z.string().min(10, 'Description must be at least 10 characters').max(3000),
    category: z.enum([
      'Ceramics & Pottery',
      'Handmade Jewelry',
      'Woodworking & Carvings',
      'Textiles & Weaving',
      'Leather Goods',
      'Home & Living',
      'Art & Prints',
      'Candles & Apothecary',
      'Other Crafts'
    ]),
    price: z.coerce.number().min(0.01, 'Price must be greater than 0'),
    compareAtPrice: z.coerce.number().optional().nullable(),
    stock: z.coerce.number().int().min(0, 'Stock cannot be negative'),
    sku: z.string().optional(),
    isActive: z.coerce.boolean().optional(),
    isFeatured: z.coerce.boolean().optional()
  })
});

const productUpdateSchema = z.object({
  body: z.object({
    name: z.string().min(3).max(150).optional(),
    description: z.string().min(10).max(3000).optional(),
    category: z.enum([
      'Ceramics & Pottery',
      'Handmade Jewelry',
      'Woodworking & Carvings',
      'Textiles & Weaving',
      'Leather Goods',
      'Home & Living',
      'Art & Prints',
      'Candles & Apothecary',
      'Other Crafts'
    ]).optional(),
    price: z.coerce.number().min(0.01).optional(),
    compareAtPrice: z.coerce.number().optional().nullable(),
    stock: z.coerce.number().int().min(0).optional(),
    sku: z.string().optional(),
    isActive: z.coerce.boolean().optional(),
    isFeatured: z.coerce.boolean().optional()
  })
});

module.exports = {
  productSchema,
  productUpdateSchema
};
