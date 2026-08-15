const analyticsService = require('../services/analytics.service');
const productService = require('../services/product.service');
const orderService = require('../services/order.service');
const ApiResponse = require('../utils/apiResponse');

class VendorController {
  async getAnalytics(req, res, next) {
    try {
      const timeframe = req.query.timeframe || '30d';
      const data = await analyticsService.getVendorAnalytics(req.user._id, timeframe);
      return ApiResponse.send(res, 200, data, 'Vendor analytics retrieved.');
    } catch (error) {
      next(error);
    }
  }

  async getVendorProducts(req, res, next) {
    try {
      const result = await productService.getProducts({
        ...req.query,
        vendorId: req.user._id,
        includeInactive: true
      });
      return ApiResponse.send(res, 200, result, 'Vendor products retrieved.');
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
}

module.exports = new VendorController();
