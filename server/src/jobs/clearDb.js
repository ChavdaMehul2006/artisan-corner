const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Store = require('../models/Store');
const Product = require('../models/Product');
const Cart = require('../models/Cart');
const Order = require('../models/Order');
const Review = require('../models/Review');
const Wishlist = require('../models/Wishlist');
const Setting = require('../models/Setting');

dotenv.config();

const clearDatabase = async () => {
  try {
    const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/artisan_corner';
    await mongoose.connect(mongoURI);
    console.log('[ClearDB] Connected to MongoDB at', mongoURI);

    const [usersResult, storesResult, productsResult, cartsResult, ordersResult, reviewsResult, wishlistsResult] = await Promise.all([
      User.deleteMany({}),
      Store.deleteMany({}),
      Product.deleteMany({}),
      Cart.deleteMany({}),
      Order.deleteMany({}),
      Review.deleteMany({}),
      Wishlist.deleteMany({})
    ]);

    console.log(`[ClearDB] Removed:
    - Users: ${usersResult.deletedCount}
    - Stores: ${storesResult.deletedCount}
    - Products: ${productsResult.deletedCount}
    - Carts: ${cartsResult.deletedCount}
    - Orders: ${ordersResult.deletedCount}
    - Reviews: ${reviewsResult.deletedCount}
    - Wishlists: ${wishlistsResult.deletedCount}`);

    // Ensure baseline marketplace settings exist
    await Setting.deleteMany({});
    await Setting.create({
      key: 'marketplace_config',
      platformCommissionPercent: 5,
      marketplaceName: "Artisan's Corner",
      supportEmail: 'support@artisanscorner.com',
      currency: 'USD'
    });
    console.log('[ClearDB] Initialized clean platform settings (5% commission).');

    console.log('[ClearDB] Database successfully wiped clean of all vendors and users!');
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('[ClearDB] Error clearing database:', error);
    process.exit(1);
  }
};

clearDatabase();
