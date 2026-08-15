const paymentService = require('../services/payment.service');
const ApiResponse = require('../utils/apiResponse');

class PaymentController {
  async createPaymentIntent(req, res, next) {
    try {
      const { items } = req.body;
      if (!items || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ success: false, message: 'Cart items required for checkout' });
      }

      const data = await paymentService.createPaymentIntent(req.user._id, items);
      return ApiResponse.send(res, 200, data, 'PaymentIntent initialized.');
    } catch (error) {
      next(error);
    }
  }

  async handleWebhook(req, res, next) {
    try {
      const signature = req.headers['stripe-signature'];
      const result = await paymentService.handleWebhook(req.body, signature);
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async getConfig(req, res) {
    return ApiResponse.send(res, 200, {
      publishableKey: process.env.STRIPE_PUBLISHABLE_KEY || 'pk_test_mock_artisan_corner_key'
    });
  }
}

module.exports = new PaymentController();
