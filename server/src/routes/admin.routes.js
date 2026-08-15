const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const { protect, requireAdmin } = require('../middleware/auth');

router.use(protect);
router.use(requireAdmin);

router.get('/analytics', adminController.getAnalytics);
router.get('/users', adminController.getUsers);
router.patch('/users/:id/toggle-active', adminController.toggleUserActive);
router.delete('/users/:id', adminController.deleteUser);
router.get('/vendors/applications', adminController.getVendorApplications);
router.patch('/vendors/applications/:id', adminController.reviewVendorApplication);
router.get('/orders', adminController.getAllOrders);
router.get('/settings', adminController.getSettings);
router.patch('/settings', adminController.updateSettings);

module.exports = router;
