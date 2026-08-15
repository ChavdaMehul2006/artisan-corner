const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/payment.controller');
const { protect } = require('../middleware/auth');

router.get('/config', paymentController.getConfig);
router.post('/create-intent', protect, paymentController.createPaymentIntent);

// Note: webhook route will be wired with express.raw in app.js
router.post('/webhook', express.raw({ type: 'application/json' }), paymentController.handleWebhook);

module.exports = router;
