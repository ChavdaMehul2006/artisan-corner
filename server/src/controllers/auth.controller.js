const authService = require('../services/auth.service');
const { sendTokenResponse, clearAuthCookies } = require('../utils/token');
const ApiResponse = require('../utils/apiResponse');

class AuthController {
  async register(req, res, next) {
    try {
      const user = await authService.register(req.body);
      return sendTokenResponse(user, 201, res, 'Registration successful. Welcome to Artisan\'s Corner!');
    } catch (error) {
      next(error);
    }
  }

  async login(req, res, next) {
    try {
      const { user, store } = await authService.login(req.body);
      return sendTokenResponse(user, 200, res, 'Login successful.');
    } catch (error) {
      next(error);
    }
  }

  async logout(req, res, next) {
    try {
      clearAuthCookies(res);
      return ApiResponse.send(res, 200, null, 'Logged out successfully.');
    } catch (error) {
      next(error);
    }
  }

  async refreshToken(req, res, next) {
    try {
      const token = req.cookies.refreshToken || req.body.refreshToken;
      const user = await authService.refreshToken(token);
      return sendTokenResponse(user, 200, res, 'Token refreshed.');
    } catch (error) {
      next(error);
    }
  }

  async getMe(req, res, next) {
    try {
      const data = await authService.getMe(req.user._id);
      return ApiResponse.send(res, 200, data, 'User profile retrieved.');
    } catch (error) {
      next(error);
    }
  }

  async updateProfile(req, res, next) {
    try {
      const user = await authService.updateProfile(req.user._id, req.body);
      return ApiResponse.send(res, 200, user, 'Profile updated successfully.');
    } catch (error) {
      next(error);
    }
  }

  async changePassword(req, res, next) {
    try {
      await authService.changePassword(req.user._id, req.body);
      return ApiResponse.send(res, 200, null, 'Password changed successfully.');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AuthController();
