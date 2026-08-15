const Product = require('../models/Product');
const Store = require('../models/Store');
const Review = require('../models/Review');
const ApiError = require('../utils/apiError');
const { createSlug } = require('../utils/helpers');
const { deleteFromCloudinary } = require('./cloudinary.service');

class ProductService {
  async getProducts({
    page = 1,
    limit = 12,
    search = '',
    category = '',
    minPrice,
    maxPrice,
    minRating,
    vendorId,
    storeId,
    sort = 'newest',
    inStockOnly = false,
    featuredOnly = false,
    includeInactive = false
  }) {
    const query = {};

    if (!includeInactive) {
      query.isActive = true;
    }

    if (search) {
      query.$text = { $search: search };
    }

    if (category) {
      query.category = category;
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      query.price = {};
      if (minPrice !== undefined && minPrice !== '') query.price.$gte = Number(minPrice);
      if (maxPrice !== undefined && maxPrice !== '') query.price.$lte = Number(maxPrice);
    }

    if (minRating !== undefined && minRating !== '') {
      query.rating = { $gte: Number(minRating) };
    }

    if (vendorId) {
      query.vendor = vendorId;
    }

    if (storeId) {
      query.store = storeId;
    }

    if (inStockOnly) {
      query.stock = { $gt: 0 };
    }

    if (featuredOnly) {
      query.isFeatured = true;
    }

    // Sort options
    let sortOptions = { createdAt: -1 };
    if (sort === 'price-asc') sortOptions = { price: 1 };
    else if (sort === 'price-desc') sortOptions = { price: -1 };
    else if (sort === 'rating') sortOptions = { rating: -1, numReviews: -1 };
    else if (sort === 'oldest') sortOptions = { createdAt: 1 };
    else if (sort === 'name-asc') sortOptions = { name: 1 };

    const pageNumber = Math.max(1, parseInt(page, 10));
    const pageSize = Math.max(1, Math.min(50, parseInt(limit, 10)));
    const skip = (pageNumber - 1) * pageSize;

    const [products, total] = await Promise.all([
      Product.find(query)
        .populate('store', 'name slug logo')
        .populate('vendor', 'name')
        .sort(sortOptions)
        .skip(skip)
        .limit(pageSize)
        .lean(),
      Product.countDocuments(query)
    ]);

    return {
      products,
      pagination: {
        page: pageNumber,
        limit: pageSize,
        total,
        pages: Math.ceil(total / pageSize)
      }
    };
  }

  async getProductBySlug(slug) {
    const product = await Product.findOne({ slug })
      .populate('store', 'name slug logo banner description phone address')
      .populate('vendor', 'name avatar')
      .lean();

    if (!product) {
      throw new ApiError(404, 'Product not found');
    }

    return product;
  }

  async getProductById(id) {
    const product = await Product.findById(id)
      .populate('store', 'name slug logo')
      .populate('vendor', 'name avatar')
      .lean();

    if (!product) {
      throw new ApiError(404, 'Product not found');
    }

    return product;
  }

  async createProduct(vendorId, productData, images = []) {
    const store = await Store.findOne({ owner: vendorId, isApproved: true });
    if (!store) {
      throw new ApiError(403, 'You must have an approved store to create products.');
    }

    let baseSlug = createSlug(productData.name);
    let uniqueSlug = baseSlug;
    let counter = 1;
    while (await Product.findOne({ slug: uniqueSlug })) {
      uniqueSlug = `${baseSlug}-${counter}`;
      counter++;
    }

    const formattedImages = images.length > 0 ? images : [
      {
        url: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&q=80&w=600',
        publicId: null
      }
    ];

    const product = await Product.create({
      vendor: vendorId,
      store: store._id,
      name: productData.name,
      slug: uniqueSlug,
      description: productData.description,
      category: productData.category,
      price: Number(productData.price),
      compareAtPrice: productData.compareAtPrice ? Number(productData.compareAtPrice) : null,
      images: formattedImages,
      stock: Number(productData.stock),
      sku: productData.sku || `ART-${Date.now().toString(36).toUpperCase()}`,
      isActive: productData.isActive !== undefined ? productData.isActive : true,
      isFeatured: productData.isFeatured !== undefined ? productData.isFeatured : false
    });

    return product;
  }

  async updateProduct(productId, vendorId, updateData, newImages = null, userRole = 'VENDOR') {
    const product = await Product.findById(productId);
    if (!product) {
      throw new ApiError(404, 'Product not found');
    }

    // Ownership check (Rule 2)
    if (userRole !== 'ADMIN' && product.vendor.toString() !== vendorId.toString()) {
      throw new ApiError(403, 'Unauthorized: You can only modify your own products.');
    }

    if (updateData.name && updateData.name !== product.name) {
      product.name = updateData.name;
      product.slug = createSlug(updateData.name);
    }

    if (updateData.description) product.description = updateData.description;
    if (updateData.category) product.category = updateData.category;
    if (updateData.price !== undefined) product.price = Number(updateData.price);
    if (updateData.compareAtPrice !== undefined) product.compareAtPrice = updateData.compareAtPrice ? Number(updateData.compareAtPrice) : null;
    if (updateData.stock !== undefined) product.stock = Number(updateData.stock);
    if (updateData.sku !== undefined) product.sku = updateData.sku;
    if (updateData.isActive !== undefined) product.isActive = updateData.isActive;
    if (updateData.isFeatured !== undefined) product.isFeatured = updateData.isFeatured;

    if (newImages && newImages.length > 0) {
      // Clean up old images if replacing
      for (const img of product.images) {
        if (img.publicId) {
          await deleteFromCloudinary(img.publicId);
        }
      }
      product.images = newImages;
    }

    await product.save();
    return product;
  }

  async deleteProduct(productId, vendorId, userRole = 'VENDOR') {
    const product = await Product.findById(productId);
    if (!product) {
      throw new ApiError(404, 'Product not found');
    }

    // Ownership check
    if (userRole !== 'ADMIN' && product.vendor.toString() !== vendorId.toString()) {
      throw new ApiError(403, 'Unauthorized: You can only delete your own products.');
    }

    // Delete associated Cloudinary images
    for (const img of product.images) {
      if (img.publicId) {
        await deleteFromCloudinary(img.publicId);
      }
    }

    // Delete associated reviews
    await Review.deleteMany({ product: product._id });

    await Product.findByIdAndDelete(productId);
    return true;
  }

  async getFeaturedProducts(limit = 8) {
    return await Product.find({ isFeatured: true, isActive: true })
      .populate('store', 'name slug logo')
      .limit(limit)
      .lean();
  }

  async getCategoriesWithCount() {
    const categories = await Product.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    return categories;
  }
}

module.exports = new ProductService();
