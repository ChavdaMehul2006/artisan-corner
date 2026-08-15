const Order = require('../models/Order');
const Product = require('../models/Product');
const Cart = require('../models/Cart');
const Setting = require('../models/Setting');
const ApiError = require('../utils/apiError');
const { calculateFinancials } = require('../utils/helpers');

class OrderService {
  async getCommissionRate() {
    const setting = await Setting.findOne({ key: 'marketplace_config' });
    if (setting && setting.platformCommissionPercent !== undefined) {
      return setting.platformCommissionPercent;
    }
    return Number(process.env.PLATFORM_COMMISSION_PERCENT) || 5;
  }

  /**
   * Validate items, fetch real MongoDB prices, check stock, calculate commission
   */
  async prepareOrderDetails(items) {
    const commissionPercent = await this.getCommissionRate();
    const preparedItems = [];
    let orderSubtotal = 0;
    let orderPlatformFee = 0;
    let orderVendorPayout = 0;

    for (const item of items) {
      const product = await Product.findById(item.productId).populate('store');
      if (!product) {
        throw new ApiError(404, `Product not found for ID: ${item.productId}`);
      }

      if (!product.isActive) {
        throw new ApiError(400, `Product "${product.name}" is currently unavailable.`);
      }

      if (product.stock < item.quantity) {
        throw new ApiError(400, `Insufficient stock for "${product.name}". Only ${product.stock} items left.`);
      }

      const financials = calculateFinancials(product.price, item.quantity, commissionPercent);

      const itemSnapshot = {
        product: product._id,
        vendor: product.vendor,
        store: product.store ? product.store._id : null,
        productName: product.name,
        image: product.images && product.images.length > 0 ? product.images[0].url : '',
        quantity: financials.quantity,
        unitPrice: financials.unitPrice,
        subtotal: financials.subtotal,
        platformFee: financials.platformFee,
        vendorPayout: financials.vendorPayout,
        itemStatus: 'PROCESSING'
      };

      preparedItems.push(itemSnapshot);
      orderSubtotal += financials.subtotal;
      orderPlatformFee += financials.platformFee;
      orderVendorPayout += financials.vendorPayout;
    }

    orderSubtotal = Math.round(orderSubtotal * 100) / 100;
    orderPlatformFee = Math.round(orderPlatformFee * 100) / 100;
    orderVendorPayout = Math.round(orderVendorPayout * 100) / 100;
    const shippingFee = 0; // Free shipping for artisan items or configurable
    const tax = Math.round(orderSubtotal * 0.05 * 100) / 100; // 5% standard tax
    const totalAmount = Math.round((orderSubtotal + shippingFee + tax) * 100) / 100;

    return {
      items: preparedItems,
      subtotal: orderSubtotal,
      platformFee: orderPlatformFee,
      vendorPayout: orderVendorPayout,
      shippingFee,
      tax,
      totalAmount,
      commissionPercent
    };
  }

  /**
   * Create an Order in MongoDB and decrement stock atomically
   */
  async createOrder(buyerId, { shippingAddress, items, paymentStatus = 'PENDING', stripePaymentIntentId = null }) {
    const prepared = await this.prepareOrderDetails(items);

    const orderNumber = `ORD-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

    const order = await Order.create({
      orderNumber,
      buyer: buyerId,
      items: prepared.items,
      shippingAddress,
      subtotal: prepared.subtotal,
      platformFee: prepared.platformFee,
      vendorPayout: prepared.vendorPayout,
      shippingFee: prepared.shippingFee,
      tax: prepared.tax,
      totalAmount: prepared.totalAmount,
      paymentStatus,
      orderStatus: paymentStatus === 'PAID' ? 'CONFIRMED' : 'PROCESSING',
      stripePaymentIntentId,
      paidAt: paymentStatus === 'PAID' ? new Date() : null
    });

    // Atomically decrement stock
    for (const item of prepared.items) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: -item.quantity }
      });
    }

    // Clear user's cart
    await Cart.findOneAndUpdate({ user: buyerId }, { items: [], subtotal: 0 });

    return order;
  }

  async getBuyerOrders(buyerId) {
    const orders = await Order.find({ buyer: buyerId })
      .sort({ createdAt: -1 })
      .lean();
    return orders;
  }

  async getOrderById(orderId, userId, userRole) {
    const order = await Order.findById(orderId)
      .populate('buyer', 'name email phone')
      .populate('items.product', 'slug')
      .populate('items.store', 'name slug logo')
      .lean();

    if (!order) {
      throw new ApiError(404, 'Order not found');
    }

    // If buyer, verify buyer ownership
    if (userRole === 'BUYER' && order.buyer._id.toString() !== userId.toString()) {
      throw new ApiError(403, 'Unauthorized to view this order');
    }

    // If vendor, filter order items to only vendor's items (Rule 3)
    if (userRole === 'VENDOR') {
      const vendorItems = order.items.filter((item) => item.vendor.toString() === userId.toString());
      if (vendorItems.length === 0) {
        throw new ApiError(403, 'Unauthorized: You have no items in this order.');
      }
      return {
        ...order,
        items: vendorItems,
        vendorSubtotal: vendorItems.reduce((acc, i) => acc + i.subtotal, 0),
        vendorPayoutTotal: vendorItems.reduce((acc, i) => acc + i.vendorPayout, 0)
      };
    }

    return order;
  }

  /**
   * Vendor orders - retrieve only orders containing vendor's items
   */
  async getVendorOrders(vendorId) {
    const orders = await Order.find({ 'items.vendor': vendorId })
      .populate('buyer', 'name email phone')
      .sort({ createdAt: -1 })
      .lean();

    // Filter items to vendor's items only and calculate vendor-specific totals
    const formattedOrders = orders.map((order) => {
      const vendorItems = order.items.filter((item) => item.vendor.toString() === vendorId.toString());
      const vendorSubtotal = vendorItems.reduce((acc, i) => acc + i.subtotal, 0);
      const vendorFee = vendorItems.reduce((acc, i) => acc + i.platformFee, 0);
      const vendorPayout = vendorItems.reduce((acc, i) => acc + i.vendorPayout, 0);

      return {
        _id: order._id,
        orderNumber: order.orderNumber,
        buyer: order.buyer,
        shippingAddress: order.shippingAddress,
        items: vendorItems,
        vendorSubtotal: Math.round(vendorSubtotal * 100) / 100,
        vendorFee: Math.round(vendorFee * 100) / 100,
        vendorPayout: Math.round(vendorPayout * 100) / 100,
        paymentStatus: order.paymentStatus,
        orderStatus: order.orderStatus,
        createdAt: order.createdAt
      };
    });

    return formattedOrders;
  }

  /**
   * Update item/order status (Vendor updates their items, Admin can update whole order)
   */
  async updateOrderStatus(orderId, status, userId, userRole) {
    const order = await Order.findById(orderId);
    if (!order) {
      throw new ApiError(404, 'Order not found');
    }

    if (userRole === 'ADMIN') {
      order.orderStatus = status;
      order.items.forEach((item) => {
        item.itemStatus = status;
      });
      if (status === 'DELIVERED') {
        order.deliveredAt = new Date();
      }
    } else if (userRole === 'VENDOR') {
      let hasVendorItem = false;
      order.items.forEach((item) => {
        if (item.vendor.toString() === userId.toString()) {
          item.itemStatus = status;
          hasVendorItem = true;
        }
      });

      if (!hasVendorItem) {
        throw new ApiError(403, 'Unauthorized: You do not own any items in this order.');
      }

      // If all items are delivered, set overall status to delivered
      const allDelivered = order.items.every((i) => i.itemStatus === 'DELIVERED');
      if (allDelivered) {
        order.orderStatus = 'DELIVERED';
        order.deliveredAt = new Date();
      } else {
        const allShipped = order.items.every((i) => ['SHIPPED', 'DELIVERED'].includes(i.itemStatus));
        if (allShipped) {
          order.orderStatus = 'SHIPPED';
        }
      }
    }

    await order.save();
    return order;
  }
}

module.exports = new OrderService();
