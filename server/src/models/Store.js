const mongoose = require('mongoose');

const storeSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true
    },
    name: {
      type: String,
      required: [true, 'Store name is required'],
      trim: true,
      unique: true,
      maxLength: [100, 'Store name cannot exceed 100 characters']
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    logo: {
      url: {
        type: String,
        default: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=400'
      },
      publicId: {
        type: String,
        default: null
      }
    },
    banner: {
      url: {
        type: String,
        default: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=1200'
      },
      publicId: {
        type: String,
        default: null
      }
    },
    description: {
      type: String,
      required: [true, 'Store description is required'],
      maxLength: [1000, 'Description cannot exceed 1000 characters']
    },
    phone: {
      type: String,
      required: [true, 'Contact phone is required']
    },
    address: {
      street: { type: String, default: '' },
      city: { type: String, default: '' },
      state: { type: String, default: '' },
      postalCode: { type: String, default: '' },
      country: { type: String, default: '' }
    },
    isApproved: {
      type: Boolean,
      default: false
    },
    status: {
      type: String,
      enum: ['PENDING', 'APPROVED', 'REJECTED', 'SUSPENDED'],
      default: 'PENDING'
    }
  },
  {
    timestamps: true
  }
);

storeSchema.index({ name: 'text', description: 'text' });

const Store = mongoose.model('Store', storeSchema);
module.exports = Store;
