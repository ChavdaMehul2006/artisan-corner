const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    store: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Store',
      required: true
    },
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
      maxLength: [150, 'Product name cannot exceed 150 characters']
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    description: {
      type: String,
      required: [true, 'Product description is required'],
      maxLength: [3000, 'Description cannot exceed 3000 characters']
    },
    category: {
      type: String,
      required: [true, 'Product category is required'],
      enum: [
        'Ceramics & Pottery',
        'Handmade Jewelry',
        'Woodworking & Carvings',
        'Textiles & Weaving',
        'Leather Goods',
        'Home & Living',
        'Art & Prints',
        'Candles & Apothecary',
        'Other Crafts'
      ],
      trim: true
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0.01, 'Price must be greater than 0']
    },
    compareAtPrice: {
      type: Number,
      default: null,
      validate: {
        validator: function (value) {
          if (value === null || value === undefined) return true;
          return value >= this.price;
        },
        message: 'Compare at price must be greater than or equal to current price'
      }
    },
    images: [
      {
        url: {
          type: String,
          required: true
        },
        publicId: {
          type: String,
          default: null
        }
      }
    ],
    stock: {
      type: Number,
      required: [true, 'Stock count is required'],
      min: [0, 'Stock cannot be negative'],
      default: 0
    },
    sku: {
      type: String,
      trim: true,
      default: ''
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    numReviews: {
      type: Number,
      default: 0,
      min: 0
    },
    isActive: {
      type: Boolean,
      default: true
    },
    isFeatured: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

productSchema.index({ name: 'text', description: 'text', category: 'text' });
productSchema.index({ vendor: 1, createdAt: -1 });
productSchema.index({ store: 1, isActive: 1 });
productSchema.index({ category: 1, price: 1 });
productSchema.index({ isFeatured: 1, isActive: 1 });

const Product = mongoose.model('Product', productSchema);
module.exports = Product;
