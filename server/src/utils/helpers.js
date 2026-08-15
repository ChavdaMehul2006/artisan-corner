const slugify = require('slugify');

const createSlug = (text) => {
  return slugify(text, {
    lower: true,
    strict: true,
    remove: /[*+~.()'"!:@]/g
  });
};

const calculateFinancials = (price, quantity, commissionPercent = 5) => {
  const itemPrice = Number(price);
  const qty = Number(quantity);
  const subtotal = Math.round(itemPrice * qty * 100) / 100;
  const platformFee = Math.round(subtotal * (commissionPercent / 100) * 100) / 100;
  const vendorPayout = Math.round((subtotal - platformFee) * 100) / 100;

  return {
    unitPrice: itemPrice,
    quantity: qty,
    subtotal,
    platformFee,
    vendorPayout
  };
};

module.exports = {
  createSlug,
  calculateFinancials
};
