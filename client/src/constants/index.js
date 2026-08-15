export const CATEGORIES = [
  'Ceramics & Pottery',
  'Handmade Jewelry',
  'Woodworking & Carvings',
  'Textiles & Weaving',
  'Leather Goods',
  'Home & Living',
  'Art & Prints',
  'Candles & Apothecary',
  'Other Crafts'
];

export const ORDER_STATUSES = {
  PROCESSING: { label: 'Processing', color: 'bg-amber-100 text-amber-800 border-amber-300' },
  CONFIRMED: { label: 'Confirmed', color: 'bg-blue-100 text-blue-800 border-blue-300' },
  SHIPPED: { label: 'Shipped', color: 'bg-indigo-100 text-indigo-800 border-indigo-300' },
  DELIVERED: { label: 'Delivered', color: 'bg-emerald-100 text-emerald-800 border-emerald-300' },
  CANCELLED: { label: 'Cancelled', color: 'bg-rose-100 text-rose-800 border-rose-300' }
};

export const PAYMENT_STATUSES = {
  PENDING: { label: 'Pending', color: 'bg-stone-100 text-stone-700' },
  PAID: { label: 'Paid', color: 'bg-emerald-100 text-emerald-800' },
  FAILED: { label: 'Failed', color: 'bg-rose-100 text-rose-800' },
  REFUNDED: { label: 'Refunded', color: 'bg-purple-100 text-purple-800' }
};

export const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest Arrivals' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Top Rated' },
  { value: 'name-asc', label: 'Name: A to Z' }
];
