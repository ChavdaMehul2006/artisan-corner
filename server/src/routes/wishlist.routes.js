const express = require('express');
const router = express.Router();
const wishlistController = require('../controllers/wishlist.controller');
const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/', wishlistController.getWishlist);
router.post('/toggle/:productId', wishlistController.toggleWishlist);

module.exports = router;
