const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { protect } = require('../middleware/auth');
const validate = require('../middleware/validate.middleware');
const { authLimiter } = require('../middleware/rateLimiter');
const {
  registerSchema,
  loginSchema,
  updateProfileSchema,
  changePasswordSchema
} = require('../validators/auth.validator');

router.post('/register', authLimiter, validate(registerSchema), authController.register);
router.post('/login', authLimiter, validate(loginSchema), authController.login);
router.post('/logout', authController.logout);
router.post('/refresh-token', authController.refreshToken);

router.get('/me', protect, authController.getMe);
router.patch('/profile', protect, validate(updateProfileSchema), authController.updateProfile);
router.patch('/change-password', protect, validate(changePasswordSchema), authController.changePassword);

module.exports = router;
