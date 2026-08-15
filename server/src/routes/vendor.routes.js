const express = require('express');
const router = express.Router();
const vendorController = require('../controllers/vendor.controller');
const { protect, requireVendor } = require('../middleware/auth');

router.use(protect);
router.use(requireVendor);

router.get('/analytics', vendorController.getAnalytics);
router.get('/products', vendorController.getVendorProducts);
router.get('/orders', vendorController.getVendorOrders);

module.exports = router;
