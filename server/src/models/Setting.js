const mongoose = require('mongoose');

const settingSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      default: 'marketplace_config'
    },
    platformCommissionPercent: {
      type: Number,
      required: true,
      default: 5,
      min: 0,
      max: 50
    },
    marketplaceName: {
      type: String,
      default: "Artisan's Corner"
    },
    supportEmail: {
      type: String,
      default: 'support@artisanscorner.com'
    },
    currency: {
      type: String,
      default: 'USD'
    }
  },
  {
    timestamps: true
  }
);

const Setting = mongoose.model('Setting', settingSchema);
module.exports = Setting;
