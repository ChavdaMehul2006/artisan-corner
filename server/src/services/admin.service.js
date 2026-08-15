const User = require('../models/User');
const Store = require('../models/Store');
const Product = require('../models/Product');
const Order = require('../models/Order');
const Setting = require('../models/Setting');
const ApiError = require('../utils/apiError');

class AdminService {
  async getUsers({ page = 1, limit = 20, search = '', role = '' }) {
    const query = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    if (role) {
      query.role = role;
    }

    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.max(1, parseInt(limit, 10));
    const skip = (pageNum - 1) * limitNum;

    const [users, total] = await Promise.all([
      User.find(query)
        .select('-password')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .lean(),
      User.countDocuments(query)
    ]);

    return {
      users,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum)
      }
    };
  }

  async toggleUserActive(userId, currentAdminId) {
    if (userId.toString() === currentAdminId.toString()) {
      throw new ApiError(400, 'Cannot deactivate your own administrator account.');
    }

    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    user.isActive = !user.isActive;
    await user.save();

    return user;
  }

  async deleteUser(userId, currentAdminId) {
    if (userId.toString() === currentAdminId.toString()) {
      throw new ApiError(400, 'Cannot delete your own administrator account.');
    }

    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    const Cart = require('../models/Cart');
    const Wishlist = require('../models/Wishlist');
    const Review = require('../models/Review');

    // If user has a store or products, clean them up
    await Promise.all([
      Store.deleteMany({ owner: userId }),
      Product.deleteMany({ vendor: userId }),
      Cart.deleteMany({ user: userId }),
      Wishlist.deleteMany({ user: userId }),
      Review.deleteMany({ user: userId }),
      User.findByIdAndDelete(userId)
    ]);

    return { success: true, message: `User "${user.name}" and associated data permanently deleted.` };
  }

  async getVendorApplications(status = 'PENDING') {
    const query = {};
    if (status) query.status = status;

    const applications = await Store.find(query)
      .populate('owner', 'name email phone avatar createdAt')
      .sort({ createdAt: -1 })
      .lean();

    return applications;
  }

  async reviewVendorApplication(storeId, { status, adminNotes = '' }) {
    if (!['APPROVED', 'REJECTED'].includes(status)) {
      throw new ApiError(400, 'Status must be APPROVED or REJECTED');
    }

    const store = await Store.findById(storeId);
    if (!store) {
      throw new ApiError(404, 'Store application not found');
    }

    store.status = status;
    store.isApproved = status === 'APPROVED';
    await store.save();

    // If approved, update user role to VENDOR
    if (status === 'APPROVED') {
      await User.findByIdAndUpdate(store.owner, {
        role: 'VENDOR',
        store: store._id
      });
    }

    return store;
  }

  async getSettings() {
    let setting = await Setting.findOne({ key: 'marketplace_config' });
    if (!setting) {
      setting = await Setting.create({
        key: 'marketplace_config',
        platformCommissionPercent: Number(process.env.PLATFORM_COMMISSION_PERCENT) || 5,
        marketplaceName: "Artisan's Corner",
        supportEmail: 'support@artisanscorner.com'
      });
    }
    return setting;
  }

  async updateSettings({ platformCommissionPercent, marketplaceName, supportEmail }) {
    let setting = await Setting.findOne({ key: 'marketplace_config' });
    if (!setting) {
      setting = new Setting({ key: 'marketplace_config' });
    }

    if (platformCommissionPercent !== undefined) {
      const comm = Number(platformCommissionPercent);
      if (isNaN(comm) || comm < 0 || comm > 50) {
        throw new ApiError(400, 'Commission must be a percentage between 0% and 50%');
      }
      setting.platformCommissionPercent = comm;
    }

    if (marketplaceName) setting.marketplaceName = marketplaceName;
    if (supportEmail) setting.supportEmail = supportEmail;

    await setting.save();
    return setting;
  }

  async getAllOrders({ page = 1, limit = 20, status = '' }) {
    const query = {};
    if (status) query.orderStatus = status;

    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.max(1, parseInt(limit, 10));
    const skip = (pageNum - 1) * limitNum;

    const [orders, total] = await Promise.all([
      Order.find(query)
        .populate('buyer', 'name email phone')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .lean(),
      Order.countDocuments(query)
    ]);

    return {
      orders,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum)
      }
    };
  }
}

module.exports = new AdminService();
