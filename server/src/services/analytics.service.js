const mongoose = require('mongoose');
const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');
const Store = require('../models/Store');

class AnalyticsService {
  getDateRange(timeframe) {
    const now = new Date();
    let startDate = new Date();

    switch (timeframe) {
      case '7d':
        startDate.setDate(now.getDate() - 7);
        break;
      case '30d':
        startDate.setDate(now.getDate() - 30);
        break;
      case '90d':
        startDate.setDate(now.getDate() - 90);
        break;
      case '1y':
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      default:
        startDate.setDate(now.getDate() - 30);
    }
    return { startDate, endDate: now };
  }

  /**
   * Vendor analytics with real MongoDB aggregations
   */
  async getVendorAnalytics(vendorId, timeframe = '30d') {
    const { startDate, endDate } = this.getDateRange(timeframe);
    const vendorObjectId = new mongoose.Types.ObjectId(vendorId);

    // 1. Overall Lifetime / Filtered totals
    const totalStats = await Order.aggregate([
      { $match: { 'items.vendor': vendorObjectId, paymentStatus: 'PAID' } },
      { $unwind: '$items' },
      { $match: { 'items.vendor': vendorObjectId } },
      {
        $group: {
          _id: null,
          totalSales: { $sum: '$items.subtotal' },
          totalEarnings: { $sum: '$items.vendorPayout' },
          totalPlatformCommission: { $sum: '$items.platformFee' },
          totalItemsSold: { $sum: '$items.quantity' }
        }
      }
    ]);

    // Current month sales
    const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    const currentMonthStats = await Order.aggregate([
      {
        $match: {
          'items.vendor': vendorObjectId,
          paymentStatus: 'PAID',
          createdAt: { $gte: startOfMonth }
        }
      },
      { $unwind: '$items' },
      { $match: { 'items.vendor': vendorObjectId } },
      {
        $group: {
          _id: null,
          monthSales: { $sum: '$items.subtotal' },
          monthEarnings: { $sum: '$items.vendorPayout' }
        }
      }
    ]);

    // Pending and total orders count
    const [totalOrdersCount, pendingOrdersCount, totalProductsCount] = await Promise.all([
      Order.countDocuments({ 'items.vendor': vendorObjectId }),
      Order.countDocuments({ 'items.vendor': vendorObjectId, orderStatus: 'PROCESSING' }),
      Product.countDocuments({ vendor: vendorObjectId })
    ]);

    // 2. Sales and Earnings Over Time (grouped by day)
    const salesOverTime = await Order.aggregate([
      {
        $match: {
          'items.vendor': vendorObjectId,
          paymentStatus: 'PAID',
          createdAt: { $gte: startDate, $lte: endDate }
        }
      },
      { $unwind: '$items' },
      { $match: { 'items.vendor': vendorObjectId } },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
          },
          sales: { $sum: '$items.subtotal' },
          earnings: { $sum: '$items.vendorPayout' },
          orders: { $addToSet: '$_id' }
        }
      },
      {
        $project: {
          date: '$_id',
          sales: { $round: ['$sales', 2] },
          earnings: { $round: ['$earnings', 2] },
          orderCount: { $size: '$orders' }
        }
      },
      { $sort: { date: 1 } }
    ]);

    // 3. Top-selling products
    const topProducts = await Order.aggregate([
      { $match: { 'items.vendor': vendorObjectId, paymentStatus: 'PAID' } },
      { $unwind: '$items' },
      { $match: { 'items.vendor': vendorObjectId } },
      {
        $group: {
          _id: '$items.product',
          name: { $first: '$items.productName' },
          image: { $first: '$items.image' },
          unitsSold: { $sum: '$items.quantity' },
          totalRevenue: { $sum: '$items.subtotal' }
        }
      },
      { $sort: { totalRevenue: -1 } },
      { $limit: 5 }
    ]);

    const summary = totalStats[0] || {
      totalSales: 0,
      totalEarnings: 0,
      totalPlatformCommission: 0,
      totalItemsSold: 0
    };

    const monthSummary = currentMonthStats[0] || {
      monthSales: 0,
      monthEarnings: 0
    };

    return {
      overview: {
        totalSales: Math.round(summary.totalSales * 100) / 100,
        totalEarnings: Math.round(summary.totalEarnings * 100) / 100,
        platformCommission: Math.round(summary.totalPlatformCommission * 100) / 100,
        totalItemsSold: summary.totalItemsSold,
        currentMonthSales: Math.round(monthSummary.monthSales * 100) / 100,
        currentMonthEarnings: Math.round(monthSummary.monthEarnings * 100) / 100,
        totalOrders: totalOrdersCount,
        pendingOrders: pendingOrdersCount,
        totalProducts: totalProductsCount
      },
      salesOverTime,
      topProducts
    };
  }

  /**
   * Admin marketplace analytics
   */
  async getAdminAnalytics(timeframe = '30d') {
    const { startDate, endDate } = this.getDateRange(timeframe);

    const [totalUsers, totalVendors, pendingApplications, totalProducts, totalOrders] =
      await Promise.all([
        User.countDocuments(),
        Store.countDocuments({ isApproved: true }),
        Store.countDocuments({ status: 'PENDING' }),
        Product.countDocuments(),
        Order.countDocuments()
      ]);

    // Financial overview
    const financialStats = await Order.aggregate([
      { $match: { paymentStatus: 'PAID' } },
      {
        $group: {
          _id: null,
          grossSales: { $sum: '$subtotal' },
          platformEarnings: { $sum: '$platformFee' },
          vendorPayouts: { $sum: '$vendorPayout' }
        }
      }
    ]);

    const financials = financialStats[0] || {
      grossSales: 0,
      platformEarnings: 0,
      vendorPayouts: 0
    };

    // Revenue and orders trend over time
    const trendOverTime = await Order.aggregate([
      {
        $match: {
          paymentStatus: 'PAID',
          createdAt: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          grossSales: { $sum: '$subtotal' },
          platformRevenue: { $sum: '$platformFee' },
          orders: { $sum: 1 }
        }
      },
      {
        $project: {
          date: '$_id',
          grossSales: { $round: ['$grossSales', 2] },
          platformRevenue: { $round: ['$platformRevenue', 2] },
          orders: 1
        }
      },
      { $sort: { date: 1 } }
    ]);

    return {
      overview: {
        totalUsers,
        totalVendors,
        pendingApplications,
        totalProducts,
        totalOrders,
        grossSales: Math.round(financials.grossSales * 100) / 100,
        platformEarnings: Math.round(financials.platformEarnings * 100) / 100,
        vendorPayouts: Math.round(financials.vendorPayouts * 100) / 100
      },
      trendOverTime
    };
  }
}

module.exports = new AnalyticsService();
