const adminService = require('../services/admin.service');
const analyticsService = require('../services/analytics.service');
const ApiResponse = require('../utils/apiResponse');

class AdminController {
  async getAnalytics(req, res, next) {
    try {
      const timeframe = req.query.timeframe || '30d';
      const data = await analyticsService.getAdminAnalytics(timeframe);
      return ApiResponse.send(res, 200, data, 'Marketplace analytics retrieved.');
    } catch (error) {
      next(error);
    }
  }

  async getUsers(req, res, next) {
    try {
      const data = await adminService.getUsers(req.query);
      return ApiResponse.send(res, 200, data, 'Users list retrieved.');
    } catch (error) {
      next(error);
    }
  }

  async toggleUserActive(req, res, next) {
    try {
      const user = await adminService.toggleUserActive(req.params.id, req.user._id);
      const status = user.isActive ? 'activated' : 'deactivated';
      return ApiResponse.send(res, 200, user, `User account ${status} successfully.`);
    } catch (error) {
      next(error);
    }
  }

  async deleteUser(req, res, next) {
    try {
      const result = await adminService.deleteUser(req.params.id, req.user._id);
      return ApiResponse.send(res, 200, result, 'User and all associated data permanently deleted.');
    } catch (error) {
      next(error);
    }
  }

  async getVendorApplications(req, res, next) {
    try {
      const applications = await adminService.getVendorApplications(req.query.status);
      return ApiResponse.send(res, 200, applications, 'Vendor applications retrieved.');
    } catch (error) {
      next(error);
    }
  }

  async reviewVendorApplication(req, res, next) {
    try {
      const { status, adminNotes } = req.body;
      const store = await adminService.reviewVendorApplication(req.params.id, { status, adminNotes });
      return ApiResponse.send(res, 200, store, `Vendor application ${status.toLowerCase()} successfully.`);
    } catch (error) {
      next(error);
    }
  }

  async getAllOrders(req, res, next) {
    try {
      const data = await adminService.getAllOrders(req.query);
      return ApiResponse.send(res, 200, data, 'Marketplace orders retrieved.');
    } catch (error) {
      next(error);
    }
  }

  async getSettings(req, res, next) {
    try {
      const settings = await adminService.getSettings();
      return ApiResponse.send(res, 200, settings, 'Settings retrieved.');
    } catch (error) {
      next(error);
    }
  }

  async updateSettings(req, res, next) {
    try {
      const settings = await adminService.updateSettings(req.body);
      return ApiResponse.send(res, 200, settings, 'Marketplace settings updated.');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AdminController();
