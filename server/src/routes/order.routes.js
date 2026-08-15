const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order.controller');
const { protect, requireVendor } = require('../middleware/auth');
const validate = require('../middleware/validate.middleware');
const { createOrderSchema, updateOrderStatusSchema } = require('../validators/order.validator');

router.use(protect);

router.post('/', validate(createOrderSchema), orderController.createOrder);
router.get('/my-orders', orderController.getBuyerOrders);
router.get('/vendor/my-orders', requireVendor, orderController.getVendorOrders);
router.get('/:id', orderController.getOrderById);
router.patch('/:id/status', validate(updateOrderStatusSchema), orderController.updateOrderStatus);

module.exports = router;
