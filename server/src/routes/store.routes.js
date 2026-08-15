const express = require('express');
const router = express.Router();
const storeController = require('../controllers/store.controller');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload.middleware');
const validate = require('../middleware/validate.middleware');
const { storeApplicationSchema, storeUpdateSchema } = require('../validators/store.validator');

// Public routes
router.get('/featured', storeController.getApprovedStores);
router.get('/:slug', storeController.getStoreBySlug);

// Protected routes
router.post(
  '/apply',
  protect,
  upload.single('logo'),
  validate(storeApplicationSchema),
  storeController.applyForVendor
);

router.get('/vendor/me', protect, storeController.getMyStore);

router.patch(
  '/vendor/me',
  protect,
  upload.fields([
    { name: 'logo', maxCount: 1 },
    { name: 'banner', maxCount: 1 }
  ]),
  validate(storeUpdateSchema),
  storeController.updateStore
);

module.exports = router;
