const Stripe = require('stripe');

let stripeInstance = null;

const stripeKey = process.env.STRIPE_SECRET_KEY || 'sk_test_mock_artisan_corner_key';

try {
  stripeInstance = new Stripe(stripeKey, {
    apiVersion: '2024-12-18.acacia'
  });
} catch (err) {
  console.warn('[Stripe] Initialized in fallback mode:', err.message);
}

module.exports = stripeInstance;
