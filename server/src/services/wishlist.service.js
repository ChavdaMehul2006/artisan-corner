const Wishlist = require('../models/Wishlist');
const Product = require('../models/Product');
const ApiError = require('../utils/apiError');

class WishlistService {
  async getWishlist(userId) {
    let wishlist = await Wishlist.findOne({ user: userId }).populate({
      path: 'products',
      match: { isActive: true },
      populate: {
        path: 'store',
        select: 'name slug logo'
      }
    });

    if (!wishlist) {
      wishlist = await Wishlist.create({ user: userId, products: [] });
    }

    return wishlist;
  }

  async toggleWishlist(userId, productId) {
    const product = await Product.findById(productId);
    if (!product) {
      throw new ApiError(404, 'Product not found');
    }

    let wishlist = await Wishlist.findOne({ user: userId });
    if (!wishlist) {
      wishlist = new Wishlist({ user: userId, products: [] });
    }

    const index = wishlist.products.findIndex((p) => p.toString() === productId.toString());
    let isAdded = false;

    if (index > -1) {
      wishlist.products.splice(index, 1);
      isAdded = false;
    } else {
      wishlist.products.push(productId);
      isAdded = true;
    }

    await wishlist.save();
    return {
      isAdded,
      productId,
      count: wishlist.products.length
    };
  }
}

module.exports = new WishlistService();
