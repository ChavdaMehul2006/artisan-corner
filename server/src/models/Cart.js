const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
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
  quantity: {
    type: Number,
    required: true,
    min: [1, 'Quantity must be at least 1'],
    default: 1
  },
  price: {
    type: Number,
    required: true
  }
});

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true
    },
    items: [cartItemSchema],
    subtotal: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

cartSchema.methods.calculateSubtotal = function () {
  this.subtotal = this.items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  this.subtotal = Math.round(this.subtotal * 100) / 100;
  return this.subtotal;
};

const Cart = mongoose.model('Cart', cartSchema);
module.exports = Cart;
