import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Heart } from 'lucide-react';
import { fetchWishlist } from '../store/slices/wishlistSlice';
import ProductGrid from '../components/product/ProductGrid';
import EmptyState from '../components/common/EmptyState';

export const WishlistPage = () => {
  const dispatch = useDispatch();
  const { items, loading } = useSelector((state) => state.wishlist);
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchWishlist());
    }
  }, [isAuthenticated, dispatch]);

  if (!isAuthenticated) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="font-serif text-3xl font-bold text-stone-900">Your Saved Wishlist</h2>
        <p className="text-sm text-stone-500">Please sign in to view and manage your saved artisan crafts.</p>
        <Link to="/login" className="inline-block px-8 py-3 bg-stone-900 text-white rounded-full text-xs font-bold uppercase tracking-wider">
          Sign In
        </Link>
      </div>
    );
  }

  if (!items || items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <EmptyState
          icon={Heart}
          title="Your wishlist is empty"
          description="Click the heart icon on any craft to curate your personal collection of favorite handmade pieces."
          actionText="Discover Artisan Creations"
          actionLink="/products"
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-14 space-y-8">
      <div className="pb-4 border-b border-stone-200">
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900">
          Saved Artisan Wishlist
        </h1>
        <p className="text-xs text-stone-500 mt-1">
          {items.length} unique handcrafted {items.length === 1 ? 'piece' : 'pieces'} saved in your collection
        </p>
      </div>

      <ProductGrid
        products={items}
        loading={loading}
        emptyTitle="Your wishlist is empty"
        emptyDescription="Explore one-of-a-kind handcrafted pieces to save for later."
      />
    </div>
  );
};

export default WishlistPage;
