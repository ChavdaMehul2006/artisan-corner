const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cart.controller');
const { protect } = require('../middleware/auth');

router.use(protect); // All cart routes require user authentication

router.get('/', cartController.getCart);
router.post('/items', cartController.addToCart);
router.patch('/items/:productId', cartController.updateQuantity);
router.delete('/items/:productId', cartController.removeItem);
router.delete('/', cartController.clearCart);
router.post('/sync', cartController.syncCart);

module.exports = router;
