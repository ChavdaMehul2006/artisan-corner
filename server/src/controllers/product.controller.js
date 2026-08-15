const productService = require('../services/product.service');
const { uploadToCloudinary } = require('../services/cloudinary.service');
const ApiResponse = require('../utils/apiResponse');

class ProductController {
  async getProducts(req, res, next) {
    try {
      const result = await productService.getProducts(req.query);
      return ApiResponse.send(res, 200, result, 'Products retrieved.');
    } catch (error) {
      next(error);
    }
  }

  async getFeaturedProducts(req, res, next) {
    try {
      const limit = parseInt(req.query.limit, 10) || 8;
      const products = await productService.getFeaturedProducts(limit);
      return ApiResponse.send(res, 200, products, 'Featured products retrieved.');
    } catch (error) {
      next(error);
    }
  }

  async getCategories(req, res, next) {
    try {
      const categories = await productService.getCategoriesWithCount();
      return ApiResponse.send(res, 200, categories, 'Categories retrieved.');
    } catch (error) {
      next(error);
    }
  }

  async getProductBySlug(req, res, next) {
    try {
      const product = await productService.getProductBySlug(req.params.slug);
      return ApiResponse.send(res, 200, product, 'Product details retrieved.');
    } catch (error) {
      next(error);
    }
  }

  async getProductById(req, res, next) {
    try {
      const product = await productService.getProductById(req.params.id);
      return ApiResponse.send(res, 200, product, 'Product retrieved.');
    } catch (error) {
      next(error);
    }
  }

  async getProductsByCategory(req, res, next) {
    try {
      const result = await productService.getProducts({
        ...req.query,
        category: req.params.category
      });
      return ApiResponse.send(res, 200, result, `Products in ${req.params.category} retrieved.`);
    } catch (error) {
      next(error);
    }
  }

  async getProductsByVendor(req, res, next) {
    try {
      const result = await productService.getProducts({
        ...req.query,
        vendorId: req.params.vendorId
      });
      return ApiResponse.send(res, 200, result, 'Vendor products retrieved.');
    } catch (error) {
      next(error);
    }
  }

  async createProduct(req, res, next) {
    try {
      const imageFiles = req.files || [];
      const uploadedImages = [];

      for (const file of imageFiles) {
        const uploaded = await uploadToCloudinary(
          file.buffer,
          'artisans_corner/products',
          file.mimetype
        );
        uploadedImages.push(uploaded);
      }

      const product = await productService.createProduct(req.user._id, req.body, uploadedImages);
      return ApiResponse.send(res, 201, product, 'Artisan product published successfully.');
    } catch (error) {
      next(error);
    }
  }

  async updateProduct(req, res, next) {
    try {
      let newImages = null;
      if (req.files && req.files.length > 0) {
        newImages = [];
        for (const file of req.files) {
          const uploaded = await uploadToCloudinary(
            file.buffer,
            'artisans_corner/products',
            file.mimetype
          );
          newImages.push(uploaded);
        }
      }

      const product = await productService.updateProduct(
        req.params.id,
        req.user._id,
        req.body,
        newImages,
        req.user.role
      );

      return ApiResponse.send(res, 200, product, 'Product updated successfully.');
    } catch (error) {
      next(error);
    }
  }

  async deleteProduct(req, res, next) {
    try {
      await productService.deleteProduct(req.params.id, req.user._id, req.user.role);
      return ApiResponse.send(res, 200, null, 'Product deleted successfully.');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ProductController();
