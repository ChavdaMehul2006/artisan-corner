import React from 'react';
import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus, Store } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { updateItemQty, removeItem, updateCartQtyAsync, removeCartItemAsync } from '../../store/slices/cartSlice';
import { formatCurrency } from '../../utils/formatters';

export const CartItemCard = ({ item }) => {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);

  const product = item.product || {};
  const productId = String(product._id || item.productId || item._id);
  const store = product.store || item.store;
  const mainImage = product.images?.[0]?.url || item.image || 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&q=80&w=400';
  const unitPrice = product.price ?? item.price ?? 0;
  const itemTotal = unitPrice * (item.quantity || 1);
  const maxStock = product.stock ?? 99;

  const handleIncrement = () => {
    if (item.quantity < maxStock) {
      const newQty = item.quantity + 1;
      dispatch(updateItemQty({ productId, quantity: newQty }));
      if (isAuthenticated) {
        dispatch(updateCartQtyAsync({ productId, quantity: newQty }));
      }
    }
  };

  const handleDecrement = () => {
    if (item.quantity > 1) {
      const newQty = item.quantity - 1;
      dispatch(updateItemQty({ productId, quantity: newQty }));
      if (isAuthenticated) {
        dispatch(updateCartQtyAsync({ productId, quantity: newQty }));
      }
    } else {
      handleRemove();
    }
  };

  const handleRemove = () => {
    dispatch(removeItem(productId));
    if (isAuthenticated) {
      dispatch(removeCartItemAsync(productId));
    }
  };

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 sm:p-5 bg-white rounded-2xl border border-stone-200/80 shadow-sm transition-all hover:border-stone-300">
      {/* Product info */}
      <div className="flex items-center gap-4 flex-1">
        <Link to={product.slug ? `/products/${product.slug}` : '/products'} className="shrink-0">
          <img
            src={mainImage}
            alt={product.name || 'Craft'}
            className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl object-cover border border-stone-200"
          />
        </Link>
        <div className="space-y-1">
          {store && store.slug && (
            <Link
              to={`/stores/${store.slug}`}
              className="inline-flex items-center gap-1 text-xs text-stone-500 hover:text-terracotta-600 font-medium"
            >
              <Store className="w-3 h-3 text-stone-400" />
              <span>{store.name}</span>
            </Link>
          )}
          <h4 className="font-serif text-sm sm:text-base font-bold text-stone-900 line-clamp-1">
            <Link
              to={product.slug ? `/products/${product.slug}` : '/products'}
              className="hover:text-terracotta-600 transition-colors"
            >
              {product.name || 'Handcrafted Item'}
            </Link>
          </h4>
          <p className="text-xs text-stone-500 font-mono">
            {formatCurrency(unitPrice)} each
          </p>
        </div>
      </div>

      {/* Quantity and Actions */}
      <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto">
        {/* Counter */}
        <div className="flex items-center border border-stone-300 rounded-xl overflow-hidden bg-artisan-50 shadow-inner">
          <button
            type="button"
            onClick={handleDecrement}
            className="p-2 text-stone-600 hover:bg-stone-200/60 transition-colors"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <span className="w-8 text-center text-xs font-bold text-stone-900 font-mono">
            {item.quantity}
          </span>
          <button
            type="button"
            onClick={handleIncrement}
            disabled={item.quantity >= maxStock}
            className="p-2 text-stone-600 hover:bg-stone-200/60 transition-colors disabled:opacity-30"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Total & Trash */}
        <div className="text-right">
          <p className="text-base font-bold text-stone-900 font-mono">
            {formatCurrency(itemTotal)}
          </p>
          <button
            onClick={handleRemove}
            className="inline-flex items-center gap-1 text-[11px] text-rose-600 hover:text-rose-700 font-medium mt-1 transition-colors cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Remove</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartItemCard;
