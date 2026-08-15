const User = require('../models/User');
const Store = require('../models/Store');
const ApiError = require('../utils/apiError');
const jwt = require('jsonwebtoken');

class AuthService {
  async register({ name, email, password, phone }) {
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      throw new ApiError(409, 'An account with this email address already exists.');
    }

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      phone: phone || '',
      role: 'BUYER',
      isActive: true
    });

    return user;
  }

  async login({ email, password }) {
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user) {
      throw new ApiError(401, 'Invalid email or password.');
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      throw new ApiError(401, 'Invalid email or password.');
    }

    if (!user.isActive) {
      throw new ApiError(403, 'Your account is deactivated. Please contact support.');
    }

    // Attach store if user is a vendor
    let store = null;
    if (user.role === 'VENDOR') {
      store = await Store.findOne({ owner: user._id });
    }

    return { user, store };
  }

  async refreshToken(token) {
    if (!token) {
      throw new ApiError(401, 'Refresh token required');
    }

    try {
      const decoded = jwt.verify(
        token,
        process.env.JWT_REFRESH_SECRET || 'fallback_refresh_secret_artisan_corner_2026'
      );

      const user = await User.findById(decoded.id);
      if (!user || !user.isActive) {
        throw new ApiError(401, 'Invalid session or deactivated account.');
      }

      return user;
    } catch (err) {
      throw new ApiError(401, 'Invalid or expired refresh token.');
    }
  }

  async getMe(userId) {
    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    let store = null;
    if (user.role === 'VENDOR' || user.role === 'ADMIN') {
      store = await Store.findOne({ owner: user._id });
    }

    return { user, store };
  }

  async updateProfile(userId, { name, phone, avatar }) {
    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    if (name) user.name = name;
    if (phone !== undefined) user.phone = phone;
    if (avatar) {
      user.avatar = typeof avatar === 'string' ? { url: avatar } : avatar;
    }

    await user.save();
    return user;
  }

  async changePassword(userId, { currentPassword, newPassword }) {
    const user = await User.findById(userId).select('+password');
    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      throw new ApiError(400, 'Current password does not match');
    }

    user.password = newPassword;
    await user.save();
    return true;
  }
}

module.exports = new AuthService();
