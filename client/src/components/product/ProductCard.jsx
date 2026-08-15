import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Store, Sparkles, Check } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { addItem, addToCartAsync } from '../../store/slices/cartSlice';
import { toggleWishlistAsync } from '../../store/slices/wishlistSlice';
import { StarRating } from '../common/StarRating';
import { formatCurrency } from '../../utils/formatters';
import { useToast } from '../common/Toast';

export const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const { addToast } = useToast();
  const { productIds: wishlistIds } = useSelector((state) => state.wishlist);
  const { isAuthenticated } = useSelector((state) => state.auth);

  const [addedAnimation, setAddedAnimation] = useState(false);

  const isWishlisted = (wishlistIds || []).includes(product._id);
  const mainImage = product.images?.[0]?.url || 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&q=80&w=600';
  const isOutOfStock = (product.stock ?? 0) <= 0;

  const discountPercent = product.compareAtPrice && product.compareAtPrice > product.price
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
    : 0;

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOutOfStock) return;

    const cartProduct = {
      _id: product._id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      compareAtPrice: product.compareAtPrice,
      images: product.images,
      stock: product.stock,
      vendor: product.vendor?._id || product.vendor,
      store: product.store
    };

    dispatch(addItem({ product: cartProduct, quantity: 1 }));
    if (isAuthenticated) {
      dispatch(addToCartAsync({ product: cartProduct, quantity: 1 }));
    }

    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1500);

    addToast(`Added "${product.name}" to basket!`, 'success');
  };

  const handleToggleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      addToast('Please sign in to save items to your wishlist.', 'info');
      return;
    }

    dispatch(toggleWishlistAsync(product._id));
    addToast(isWishlisted ? 'Removed from wishlist' : 'Saved to wishlist', 'success');
  };

  return (
    <div className="artisan-card-interactive group flex flex-col h-full w-full overflow-hidden bg-white justify-between">
      {/* 1. Equal Aspect Ratio Product Image Frame */}
      <div className="relative aspect-square w-full overflow-hidden bg-artisan-100/80 shrink-0">
        <Link to={`/products/${product.slug}`} className="block w-full h-full">
          <img
            src={mainImage}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-cover object-center transform group-hover:scale-108 transition-transform duration-700 ease-out"
          />
        </Link>

        {/* Floating Top Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 pointer-events-none z-10">
          {product.isFeatured && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-charcoal-900/90 text-amberGold-400 text-[10px] font-extrabold rounded-full backdrop-blur-md shadow-xs">
              <Sparkles className="w-3 h-3 text-amberGold-400" />
              Featured
            </span>
          )}
          {discountPercent > 0 && (
            <span className="px-2 py-0.5 bg-terracotta-500 text-white text-[10px] font-extrabold rounded-full shadow-xs">
              Save {discountPercent}%
            </span>
          )}
          {isOutOfStock && (
            <span className="px-2 py-0.5 bg-stone-800 text-stone-300 text-[10px] font-bold rounded-full">
              Sold Out
            </span>
          )}
        </div>

        {/* Wishlist Heart Button */}
        <button
          onClick={handleToggleWishlist}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all duration-300 shadow-sm cursor-pointer z-10 ${
            isWishlisted
              ? 'bg-terracotta-500 text-white shadow-md scale-105'
              : 'bg-white/90 text-stone-600 hover:text-terracotta-600 hover:bg-white hover:scale-110'
          }`}
          title={isWishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
        >
          <Heart className={`w-4 h-4 transition-transform ${isWishlisted ? 'fill-current' : ''}`} />
        </button>

        {/* Category Pill Tag (Pinned to Bottom Left of Image) */}
        <span className="absolute bottom-2.5 left-2.5 px-2 py-0.5 bg-white/95 backdrop-blur-md rounded-md text-[10px] font-extrabold uppercase tracking-wider text-stone-700 border border-stone-200/70 shadow-2xs">
          {product.category || 'Handcrafted'}
        </span>
      </div>

      {/* 2. Structured Product Content Body (Fixed Heights for Uniform Alignment) */}
      <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between">
        <div className="space-y-2">
          {/* Row A: Studio/Artisan Link (Guaranteed height) */}
          <div className="h-5 flex items-center overflow-hidden">
            {product.store ? (
              <Link
                to={`/stores/${product.store.slug}`}
                className="inline-flex items-center gap-1 text-xs text-stone-500 hover:text-terracotta-600 font-medium transition-colors truncate max-w-full"
              >
                <Store className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                <span className="truncate">{product.store.name}</span>
              </Link>
            ) : (
              <span className="inline-flex items-center gap-1 text-xs text-stone-400 font-medium">
                <Store className="w-3.5 h-3.5 text-stone-300 shrink-0" />
                <span>Independent Studio</span>
              </span>
            )}
          </div>

          {/* Row B: Product Title (Strictly fixed 2-line height for all cards) */}
          <div className="h-12 overflow-hidden">
            <h3 className="font-serif text-sm sm:text-base font-bold text-stone-900 group-hover:text-terracotta-600 transition-colors line-clamp-2 leading-snug">
              <Link to={`/products/${product.slug}`}>
                {product.name}
              </Link>
            </h3>
          </div>

          {/* Row C: Ratings & Reviews (Strictly fixed height) */}
          <div className="h-5 flex items-center">
            <StarRating
              rating={product.rating || 0}
              numReviews={product.numReviews || 0}
              size="xs"
            />
          </div>
        </div>

        {/* 3. Standardized Bottom Pricing & Action Row */}
        <div className="pt-3.5 mt-3 border-t border-stone-100 flex items-center justify-between gap-2">
          <div className="flex flex-col min-w-0">
            <div className="flex items-baseline gap-1.5 truncate">
              <span className="font-mono text-base sm:text-lg font-extrabold text-stone-900 tracking-tight">
                {formatCurrency(product.price)}
              </span>
              {product.compareAtPrice && product.compareAtPrice > product.price && (
                <span className="text-xs text-stone-400 line-through font-mono">
                  {formatCurrency(product.compareAtPrice)}
                </span>
              )}
            </div>
            <span className="text-[10px] font-semibold text-stone-400 truncate">
              {product.stock > 5 ? 'In Stock' : product.stock > 0 ? `Only ${product.stock} left` : 'Out of stock'}
            </span>
          </div>

          {/* Consistent Add to Basket Button */}
          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className={`flex items-center justify-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer shrink-0 shadow-2xs ${
              isOutOfStock
                ? 'bg-stone-100 text-stone-400 cursor-not-allowed'
                : addedAnimation
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-stone-900 hover:bg-terracotta-500 text-white shadow-2xs hover:shadow active:scale-95'
            }`}
          >
            {addedAnimation ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Added</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Add</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
