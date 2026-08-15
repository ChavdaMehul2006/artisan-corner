const cartService = require('../services/cart.service');
const ApiResponse = require('../utils/apiResponse');

class CartController {
  async getCart(req, res, next) {
    try {
      const cart = await cartService.getCart(req.user._id);
      return ApiResponse.send(res, 200, cart, 'Cart retrieved.');
    } catch (error) {
      next(error);
    }
  }

  async addToCart(req, res, next) {
    try {
      const { productId, quantity } = req.body;
      const cart = await cartService.addToCart(req.user._id, productId, quantity || 1);
      return ApiResponse.send(res, 200, cart, 'Item added to cart.');
    } catch (error) {
      next(error);
    }
  }

  async updateQuantity(req, res, next) {
    try {
      const { quantity } = req.body;
      const cart = await cartService.updateItemQuantity(req.user._id, req.params.productId, quantity);
      return ApiResponse.send(res, 200, cart, 'Cart updated.');
    } catch (error) {
      next(error);
    }
  }

  async removeItem(req, res, next) {
    try {
      const cart = await cartService.removeItem(req.user._id, req.params.productId);
      return ApiResponse.send(res, 200, cart, 'Item removed from cart.');
    } catch (error) {
      next(error);
    }
  }

  async clearCart(req, res, next) {
    try {
      await cartService.clearCart(req.user._id);
      return ApiResponse.send(res, 200, { items: [], subtotal: 0 }, 'Cart cleared.');
    } catch (error) {
      next(error);
    }
  }

  async syncCart(req, res, next) {
    try {
      const { items } = req.body;
      const cart = await cartService.syncCart(req.user._id, items || []);
      return ApiResponse.send(res, 200, cart, 'Cart synchronized.');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new CartController();
