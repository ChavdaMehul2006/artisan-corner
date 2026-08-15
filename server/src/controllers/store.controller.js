const storeService = require('../services/store.service');
const { uploadToCloudinary } = require('../services/cloudinary.service');
const ApiResponse = require('../utils/apiResponse');

class StoreController {
  async applyForVendor(req, res, next) {
    try {
      let logoData = null;
      if (req.file) {
        logoData = await uploadToCloudinary(req.file.buffer, 'artisans_corner/stores/logos', req.file.mimetype);
      }

      const store = await storeService.applyForVendor(req.user._id, req.body, logoData);
      return ApiResponse.send(
        res,
        201,
        store,
        'Vendor application submitted successfully. Your store is pending administrator approval.'
      );
    } catch (error) {
      next(error);
    }
  }

  async getStoreBySlug(req, res, next) {
    try {
      const data = await storeService.getStoreBySlug(req.params.slug);
      return ApiResponse.send(res, 200, data, 'Store retrieved successfully.');
    } catch (error) {
      next(error);
    }
  }

  async getMyStore(req, res, next) {
    try {
      const store = await storeService.getMyStore(req.user._id);
      return ApiResponse.send(res, 200, store, 'Store details retrieved.');
    } catch (error) {
      next(error);
    }
  }

  async updateStore(req, res, next) {
    try {
      let logoData = null;
      let bannerData = null;

      if (req.files) {
        if (req.files.logo && req.files.logo[0]) {
          logoData = await uploadToCloudinary(
            req.files.logo[0].buffer,
            'artisans_corner/stores/logos',
            req.files.logo[0].mimetype
          );
        }
        if (req.files.banner && req.files.banner[0]) {
          bannerData = await uploadToCloudinary(
            req.files.banner[0].buffer,
            'artisans_corner/stores/banners',
            req.files.banner[0].mimetype
          );
        }
      }

      const store = await storeService.updateStore(req.user._id, req.body, logoData, bannerData);
      return ApiResponse.send(res, 200, store, 'Store profile updated successfully.');
    } catch (error) {
      next(error);
    }
  }

  async getApprovedStores(req, res, next) {
    try {
      const stores = await storeService.getAllApprovedStores(parseInt(req.query.limit, 10) || 12);
      return ApiResponse.send(res, 200, stores, 'Artisan stores retrieved.');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new StoreController();
