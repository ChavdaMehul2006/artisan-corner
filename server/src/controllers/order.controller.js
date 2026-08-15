const orderService = require('../services/order.service');
const ApiResponse = require('../utils/apiResponse');

class OrderController {
  async createOrder(req, res, next) {
    try {
      const order = await orderService.createOrder(req.user._id, {
        shippingAddress: req.body.shippingAddress,
        items: req.body.items,
        paymentStatus: req.body.paymentStatus || 'PENDING',
        stripePaymentIntentId: req.body.stripePaymentIntentId || null
      });

      return ApiResponse.send(res, 201, order, 'Order placed successfully.');
    } catch (error) {
      next(error);
    }
  }

  async getBuyerOrders(req, res, next) {
    try {
      const orders = await orderService.getBuyerOrders(req.user._id);
      return ApiResponse.send(res, 200, orders, 'Orders retrieved.');
    } catch (error) {
      next(error);
    }
  }

  async getVendorOrders(req, res, next) {
    try {
      const orders = await orderService.getVendorOrders(req.user._id);
      return ApiResponse.send(res, 200, orders, 'Vendor orders retrieved.');
    } catch (error) {
      next(error);
    }
  }

  async getOrderById(req, res, next) {
    try {
      const order = await orderService.getOrderById(req.params.id, req.user._id, req.user.role);
      return ApiResponse.send(res, 200, order, 'Order details retrieved.');
    } catch (error) {
      next(error);
    }
  }

  async updateOrderStatus(req, res, next) {
    try {
      const { status } = req.body;
      const order = await orderService.updateOrderStatus(
        req.params.id,
        status,
        req.user._id,
        req.user.role
      );
      return ApiResponse.send(res, 200, order, `Order status updated to ${status}.`);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new OrderController();
