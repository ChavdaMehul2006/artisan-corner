import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { ShoppingBag, ArrowLeft, Trash2 } from 'lucide-react';
import CartItemCard from '../components/cart/CartItemCard';
import CartSummaryCard from '../components/cart/CartSummaryCard';
import EmptyState from '../components/common/EmptyState';
import { clearCart, clearCartAsync, fetchServerCart } from '../store/slices/cartSlice';

export const CartPage = () => {
  const dispatch = useDispatch();
  const { items, subtotal } = useSelector((state) => state.cart);
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchServerCart());
    }
  }, [isAuthenticated, dispatch]);

  const handleClearCart = () => {
    dispatch(clearCart());
    if (isAuthenticated) {
      dispatch(clearCartAsync());
    }
  };

  if (!items || items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <EmptyState
          icon={ShoppingBag}
          title="Your shopping cart is empty"
          description="Looks like you haven't added any handcrafted artisan creations to your basket yet."
          actionText="Discover Artisan Crafts"
          actionLink="/products"
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-14 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-200">
        <div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900">
            Artisan Basket
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            {items.reduce((acc, i) => acc + (i.quantity || 1), 0)} items ready for unified multi-vendor checkout
          </p>
        </div>

        <div className="flex items-center gap-4">
          <Link
            to="/products"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-600 hover:text-stone-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Continue Browsing</span>
          </Link>
          <button
            onClick={handleClearCart}
            className="inline-flex items-center gap-1 text-xs font-semibold text-rose-600 hover:text-rose-700 transition-colors cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Cart</span>
          </button>
        </div>
      </div>

      {/* Cart Grid: Items on left, summary on right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Items List */}
        <div className="lg:col-span-8 space-y-4">
          {items.map((item, idx) => (
            <CartItemCard key={item.product?._id || item._id || idx} item={item} />
          ))}
        </div>

        {/* Summary Card */}
        <div className="lg:col-span-4 sticky top-28">
          <CartSummaryCard subtotal={subtotal} />
        </div>
      </div>
    </div>
  );
};

export default CartPage;
