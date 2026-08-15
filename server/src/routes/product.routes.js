const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.controller');
const { protect, requireVendor } = require('../middleware/auth');
const upload = require('../middleware/upload.middleware');
const validate = require('../middleware/validate.middleware');
const { productSchema, productUpdateSchema } = require('../validators/product.validator');

// Public catalog routes
router.get('/', productController.getProducts);
router.get('/featured', productController.getFeaturedProducts);
router.get('/categories/list', productController.getCategories);
router.get('/category/:category', productController.getProductsByCategory);
router.get('/vendor/:vendorId', productController.getProductsByVendor);
router.get('/slug/:slug', productController.getProductBySlug);
router.get('/:id', productController.getProductById);

// Vendor product management routes
router.post(
  '/',
  protect,
  requireVendor,
  upload.array('images', 6),
  validate(productSchema),
  productController.createProduct
);

router.patch(
  '/:id',
  protect,
  requireVendor,
  upload.array('images', 6),
  validate(productUpdateSchema),
  productController.updateProduct
);

router.delete('/:id', protect, requireVendor, productController.deleteProduct);

module.exports = router;
