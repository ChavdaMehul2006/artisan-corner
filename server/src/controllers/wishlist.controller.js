const wishlistService = require('../services/wishlist.service');
const ApiResponse = require('../utils/apiResponse');

class WishlistController {
  async getWishlist(req, res, next) {
    try {
      const wishlist = await wishlistService.getWishlist(req.user._id);
      return ApiResponse.send(res, 200, wishlist, 'Wishlist retrieved.');
    } catch (error) {
      next(error);
    }
  }

  async toggleWishlist(req, res, next) {
    try {
      const result = await wishlistService.toggleWishlist(req.user._id, req.params.productId);
      const message = result.isAdded ? 'Product added to wishlist.' : 'Product removed from wishlist.';
      return ApiResponse.send(res, 200, result, message);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new WishlistController();
