const stripe = require('../config/stripe');
const Order = require('../models/Order');
const orderService = require('./order.service');
const ApiError = require('../utils/apiError');

class PaymentService {
  async createPaymentIntent(buyerId, items) {
    const prepared = await orderService.prepareOrderDetails(items);
    const amountInCents = Math.round(prepared.totalAmount * 100);

    // If real Stripe is configured
    if (
      stripe &&
      process.env.STRIPE_SECRET_KEY &&
      !process.env.STRIPE_SECRET_KEY.includes('Mock') &&
      !process.env.STRIPE_SECRET_KEY.includes('mock')
    ) {
      try {
        const paymentIntent = await stripe.paymentIntents.create({
          amount: amountInCents,
          currency: 'usd',
          metadata: {
            buyerId: buyerId.toString(),
            itemCount: items.length.toString()
          },
          automatic_payment_methods: {
            enabled: true
          }
        });

        return {
          clientSecret: paymentIntent.client_secret,
          paymentIntentId: paymentIntent.id,
          amount: prepared.totalAmount,
          subtotal: prepared.subtotal,
          tax: prepared.tax,
          platformFee: prepared.platformFee,
          vendorPayout: prepared.vendorPayout,
          publishableKey: process.env.STRIPE_PUBLISHABLE_KEY || 'pk_test_mock_artisan_corner_key',
          isMock: false
        };
      } catch (stripeErr) {
        console.error('[Stripe Error]', stripeErr.message);
        throw new ApiError(500, `Payment gateway error: ${stripeErr.message}`);
      }
    }

    // Seamless Dev/Test Mock Mode for local testing when mock Stripe key is used
    const mockIntentId = `pi_artisan_mock_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    const mockClientSecret = `${mockIntentId}_secret_${Math.random().toString(36).substring(7)}`;

    return {
      clientSecret: mockClientSecret,
      paymentIntentId: mockIntentId,
      amount: prepared.totalAmount,
      subtotal: prepared.subtotal,
      tax: prepared.tax,
      platformFee: prepared.platformFee,
      vendorPayout: prepared.vendorPayout,
      publishableKey: process.env.STRIPE_PUBLISHABLE_KEY || 'pk_test_mock_artisan_corner_key',
      isMock: true
    };
  }

  /**
   * Handle raw Stripe Webhook event
   */
  async handleWebhook(rawBody, signature) {
    let event;

    if (
      stripe &&
      process.env.STRIPE_WEBHOOK_SECRET &&
      !process.env.STRIPE_WEBHOOK_SECRET.includes('mock')
    ) {
      try {
        event = stripe.webhooks.constructEvent(
          rawBody,
          signature,
          process.env.STRIPE_WEBHOOK_SECRET
        );
      } catch (err) {
        console.error(`[Stripe Webhook Verification Failed]: ${err.message}`);
        throw new ApiError(400, `Webhook Error: ${err.message}`);
      }
    } else {
      // Mock event format in dev mode
      try {
        event = JSON.parse(rawBody.toString());
      } catch (err) {
        event = { type: 'payment_intent.succeeded', data: { object: {} } };
      }
    }

    // Idempotent processing of payment events
    switch (event.type) {
      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object;
        const paymentIntentId = paymentIntent.id;

        const order = await Order.findOne({ stripePaymentIntentId: paymentIntentId });
        if (order && order.paymentStatus !== 'PAID') {
          order.paymentStatus = 'PAID';
          order.orderStatus = 'CONFIRMED';
          order.paidAt = new Date();
          await order.save();
          console.log(`[Stripe Webhook] Order ${order.orderNumber} successfully marked as PAID`);
        }
        break;
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object;
        const paymentIntentId = paymentIntent.id;

        const order = await Order.findOne({ stripePaymentIntentId: paymentIntentId });
        if (order) {
          order.paymentStatus = 'FAILED';
          await order.save();
          console.log(`[Stripe Webhook] Order ${order.orderNumber} marked as FAILED`);
        }
        break;
      }

      default:
        console.log(`[Stripe Webhook] Unhandled event type: ${event.type}`);
    }

    return { received: true };
  }
}

module.exports = new PaymentService();
