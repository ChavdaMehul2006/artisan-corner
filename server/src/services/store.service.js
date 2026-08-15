const Store = require('../models/Store');
const User = require('../models/User');
const Product = require('../models/Product');
const ApiError = require('../utils/apiError');
const { createSlug } = require('../utils/helpers');

class StoreService {
  async applyForVendor(userId, storeData, logoData = null) {
    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    const existingStore = await Store.findOne({ owner: userId });
    if (existingStore) {
      if (existingStore.status === 'PENDING') {
        throw new ApiError(400, 'You already have a vendor application pending review.');
      }
      if (existingStore.status === 'APPROVED') {
        throw new ApiError(400, 'You already have an approved vendor store.');
      }
    }

    let baseSlug = createSlug(storeData.name);
    let uniqueSlug = baseSlug;
    let counter = 1;
    while (await Store.findOne({ slug: uniqueSlug })) {
      uniqueSlug = `${baseSlug}-${counter}`;
      counter++;
    }

    const newStore = await Store.create({
      owner: userId,
      name: storeData.name,
      slug: uniqueSlug,
      description: storeData.description,
      phone: storeData.phone,
      address: {
        street: storeData.street || '',
        city: storeData.city || '',
        state: storeData.state || '',
        postalCode: storeData.postalCode || '',
        country: storeData.country || 'United States'
      },
      logo: logoData || {
        url: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=400',
        publicId: null
      },
      isApproved: false,
      status: 'PENDING'
    });

    return newStore;
  }

  async getStoreBySlug(slug) {
    const store = await Store.findOne({ slug, isApproved: true }).populate('owner', 'name email avatar createdAt');
    if (!store) {
      throw new ApiError(404, 'Store not found or is not approved yet.');
    }

    const products = await Product.find({ store: store._id, isActive: true })
      .sort({ createdAt: -1 })
      .lean();

    return {
      store,
      products
    };
  }

  async getMyStore(userId) {
    const store = await Store.findOne({ owner: userId });
    if (!store) {
      throw new ApiError(404, 'No store found for this user.');
    }
    return store;
  }

  async updateStore(userId, updateData, logoData = null, bannerData = null) {
    const store = await Store.findOne({ owner: userId });
    if (!store) {
      throw new ApiError(404, 'Store not found');
    }

    if (updateData.name && updateData.name !== store.name) {
      const existing = await Store.findOne({ name: updateData.name, _id: { $ne: store._id } });
      if (existing) {
        throw new ApiError(409, 'A store with this name already exists.');
      }
      store.name = updateData.name;
      store.slug = createSlug(updateData.name);
    }

    if (updateData.description) store.description = updateData.description;
    if (updateData.phone) store.phone = updateData.phone;

    if (updateData.street !== undefined || updateData.city !== undefined || updateData.state !== undefined) {
      store.address = {
        street: updateData.street !== undefined ? updateData.street : store.address.street,
        city: updateData.city !== undefined ? updateData.city : store.address.city,
        state: updateData.state !== undefined ? updateData.state : store.address.state,
        postalCode: updateData.postalCode !== undefined ? updateData.postalCode : store.address.postalCode,
        country: updateData.country !== undefined ? updateData.country : store.address.country
      };
    }

    if (logoData) {
      store.logo = logoData;
    }

    if (bannerData) {
      store.banner = bannerData;
    }

    await store.save();
    return store;
  }

  async getAllApprovedStores(limit = 12) {
    const stores = await Store.find({ isApproved: true, status: 'APPROVED' })
      .populate('owner', 'name avatar')
      .limit(limit)
      .lean();

    // Attach product count for each store
    const storesWithCounts = await Promise.all(
      stores.map(async (store) => {
        const productCount = await Product.countDocuments({ store: store._id, isActive: true });
        return {
          ...store,
          productCount
        };
      })
    );

    return storesWithCounts;
  }
}

module.exports = new StoreService();
