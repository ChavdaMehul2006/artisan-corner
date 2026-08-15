const mongoose = require('mongoose');

const orderItemSnapshotSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  vendor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  store: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Store'
  },
  productName: {
    type: String,
    required: true
  },
  image: {
    type: String,
    default: ''
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  unitPrice: {
    type: Number,
    required: true
  },
  subtotal: {
    type: Number,
    required: true
  },
  platformFee: {
    type: Number,
    required: true
  },
  vendorPayout: {
    type: Number,
    required: true
  },
  itemStatus: {
    type: String,
    enum: ['PROCESSING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED'],
    default: 'PROCESSING'
  }
});

const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    items: [orderItemSnapshotSchema],
    shippingAddress: {
      fullName: { type: String, required: true },
      addressLine1: { type: String, required: true },
      addressLine2: { type: String, default: '' },
      city: { type: String, required: true },
      state: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, required: true, default: 'United States' },
      phone: { type: String, required: true }
    },
    subtotal: {
      type: Number,
      required: true
    },
    platformFee: {
      type: Number,
      required: true
    },
    vendorPayout: {
      type: Number,
      required: true
    },
    shippingFee: {
      type: Number,
      default: 0
    },
    tax: {
      type: Number,
      default: 0
    },
    totalAmount: {
      type: Number,
      required: true
    },
    paymentStatus: {
      type: String,
      enum: ['PENDING', 'PAID', 'FAILED', 'REFUNDED'],
      default: 'PENDING',
      index: true
    },
    orderStatus: {
      type: String,
      enum: ['PROCESSING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED'],
      default: 'PROCESSING',
      index: true
    },
    stripePaymentIntentId: {
      type: String,
      default: null,
      index: true
    },
    paidAt: {
      type: Date
    },
    deliveredAt: {
      type: Date
    }
  },
  {
    timestamps: true
  }
);

orderSchema.index({ 'items.vendor': 1, createdAt: -1 });
orderSchema.index({ buyer: 1, createdAt: -1 });

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;
