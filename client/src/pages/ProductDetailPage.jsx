import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  ShoppingBag,
  Heart,
  Store,
  ShieldCheck,
  Truck,
  RotateCcw,
  Sparkles,
  ArrowRight,
  Plus,
  Minus,
  CheckCircle2,
  AlertTriangle,
  Check,
  Layers,
  Leaf
} from 'lucide-react';
import ImageGallery from '../components/product/ImageGallery';
import ReviewList from '../components/product/ReviewList';
import StarRating from '../components/common/StarRating';
import { addItem, addToCartAsync } from '../store/slices/cartSlice';
import { toggleWishlistAsync } from '../store/slices/wishlistSlice';
import { formatCurrency } from '../utils/formatters';
import axiosClient from '../api/axiosClient';
import { useToast } from '../components/common/Toast';

export const ProductDetailPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { addToast } = useToast();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('story');
  const [addedAnimation, setAddedAnimation] = useState(false);

  const { productIds: wishlistIds } = useSelector((state) => state.wishlist);
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res = await axiosClient.get(`/products/slug/${slug}`);
        setProduct(res.data);
      } catch (err) {
        console.error('Failed to load product details', err);
      } finally {
        setLoading(false);
      }
    };
    if (slug) {
      fetchProduct();
      window.scrollTo(0, 0);
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 flex items-center justify-center min-h-[50vh]">
        <div className="w-9 h-9 border-3 border-terracotta-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center space-y-4">
        <h2 className="font-serif text-3xl font-bold text-stone-900">Craft Piece Not Found</h2>
        <p className="text-sm text-stone-500">The artisan piece you are looking for does not exist or has been retired from the catalog.</p>
        <Link
          to="/products"
          className="inline-block px-8 py-3 bg-stone-900 text-white rounded-full text-xs font-bold uppercase tracking-wider"
        >
          Return to Marketplace
        </Link>
      </div>
    );
  }

  const isWishlisted = (wishlistIds || []).includes(product._id);
  const isOutOfStock = (product.stock ?? 0) <= 0;
  const discountPercent =
    product.compareAtPrice && product.compareAtPrice > product.price
      ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
      : 0;

  const handleAddToCart = () => {
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

    dispatch(addItem({ product: cartProduct, quantity }));
    if (isAuthenticated) {
      dispatch(addToCartAsync({ product: cartProduct, quantity }));
    }

    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1500);

    addToast(`Added ${quantity} "${product.name}" to your basket!`, 'success');
  };

  const handleBuyNow = () => {
    if (isOutOfStock) return;
    handleAddToCart();
    navigate('/checkout');
  };

  const handleToggleWishlist = () => {
    if (!isAuthenticated) {
      addToast('Please sign in to save to your wishlist', 'info');
      return;
    }
    dispatch(toggleWishlistAsync(product._id));
    addToast(isWishlisted ? 'Removed from wishlist' : 'Saved to wishlist', 'success');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-14 space-y-16">
      {/* Breadcrumb navigation */}
      <nav className="flex items-center gap-2 text-xs font-semibold text-stone-500">
        <Link to="/" className="hover:text-stone-900">Home</Link>
        <span>/</span>
        <Link to="/products" className="hover:text-stone-900">Crafts</Link>
        <span>/</span>
        <Link to={`/products?category=${encodeURIComponent(product.category)}`} className="hover:text-terracotta-600">
          {product.category}
        </Link>
        <span>/</span>
        <span className="text-stone-900 font-bold truncate max-w-xs">{product.name}</span>
      </nav>

      {/* Main Showcase Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
        {/* Left Column: Multi-Angle Image Gallery */}
        <div className="lg:col-span-7">
          <ImageGallery images={product.images} productName={product.name} />
        </div>

        {/* Right Column: Purchasing & Studio Specs */}
        <div className="lg:col-span-5 space-y-6">
          {/* Artisan Studio Info Card */}
          {product.store && (
            <div className="flex items-center justify-between p-4 bg-artisan-100/80 rounded-2xl border border-stone-200/90 shadow-2xs">
              <Link
                to={`/stores/${product.store.slug}`}
                className="flex items-center gap-3 group"
              >
                <img
                  src={product.store.logo?.url || 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=200'}
                  alt={product.store.name}
                  className="w-11 h-11 rounded-xl object-cover border border-stone-300 shadow-2xs"
                />
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-terracotta-600">Artisan Studio</span>
                  <h4 className="text-xs font-bold text-stone-900 group-hover:text-terracotta-600 transition-colors">
                    {product.store.name}
                  </h4>
                </div>
              </Link>

              <Link
                to={`/stores/${product.store.slug}`}
                className="text-xs font-bold text-stone-700 hover:text-terracotta-600"
              >
                Visit Studio →
              </Link>
            </div>
          )}

          {/* Title, Category & Ratings */}
          <div className="space-y-2.5">
            <span className="inline-block text-[11px] font-extrabold uppercase tracking-widest text-terracotta-600">
              {product.category}
            </span>
            <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-extrabold text-stone-900 leading-tight">
              {product.name}
            </h1>

            <div className="flex items-center gap-3 pt-1">
              <StarRating rating={product.rating || 0} numReviews={product.numReviews || 0} size="sm" />
              {product.sku && (
                <span className="text-xs text-stone-400 font-mono">SKU: {product.sku}</span>
              )}
            </div>
          </div>

          {/* Price Box */}
          <div className="p-5 bg-white rounded-3xl border border-stone-200/90 shadow-sm flex items-center justify-between">
            <div className="flex items-baseline gap-3">
              <span className="font-mono text-3xl sm:text-4xl font-extrabold text-stone-900">
                {formatCurrency(product.price)}
              </span>
              {product.compareAtPrice && product.compareAtPrice > product.price && (
                <span className="text-base text-stone-400 line-through font-mono">
                  {formatCurrency(product.compareAtPrice)}
                </span>
              )}
            </div>
            {discountPercent > 0 && (
              <span className="px-3 py-1 bg-terracotta-500 text-white text-xs font-extrabold rounded-full shadow-2xs">
                Save {discountPercent}%
              </span>
            )}
          </div>

          {/* Stock Status Indicator */}
          <div className="flex items-center gap-2 text-xs">
            {product.stock > 5 ? (
              <span className="inline-flex items-center gap-1.5 text-emerald-800 font-bold bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                <CheckCircle2 className="w-3.5 h-3.5" />
                In Stock ({product.stock} pieces ready to ship)
              </span>
            ) : product.stock > 0 ? (
              <span className="inline-flex items-center gap-1.5 text-amberGold-600 font-bold bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                <AlertTriangle className="w-3.5 h-3.5" />
                Limited Stock: Only {product.stock} pieces available
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 text-rose-700 font-bold bg-rose-50 px-3 py-1 rounded-full border border-rose-200">
                Out of Stock
              </span>
            )}
          </div>

          {/* Quantity Stepper and Action Buttons */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-3">
              {/* Stepper */}
              <div className="flex items-center border border-stone-300 rounded-2xl bg-white px-2 py-1 shadow-inner">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1 || isOutOfStock}
                  className="p-2 text-stone-600 hover:text-stone-900 disabled:opacity-30 cursor-pointer"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-10 text-center font-mono font-bold text-sm text-stone-900">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  disabled={quantity >= product.stock || isOutOfStock}
                  className="p-2 text-stone-600 hover:text-stone-900 disabled:opacity-30 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Wishlist Button */}
              <button
                type="button"
                onClick={handleToggleWishlist}
                className={`p-3 rounded-2xl border transition-all cursor-pointer ${
                  isWishlisted
                    ? 'bg-terracotta-500 text-white border-terracotta-500 shadow-md'
                    : 'bg-white text-stone-700 border-stone-300 hover:bg-stone-50'
                }`}
                title="Save to wishlist"
              >
                <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
              </button>
            </div>

            {/* Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                disabled={isOutOfStock}
                onClick={handleAddToCart}
                className={`w-full py-4 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-200 shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
                  addedAnimation
                    ? 'bg-emerald-600 text-white'
                    : 'bg-stone-900 hover:bg-stone-800 text-white'
                }`}
              >
                {addedAnimation ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Added to Basket</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add to Basket</span>
                  </>
                )}
              </button>

              <button
                type="button"
                disabled={isOutOfStock}
                onClick={handleBuyNow}
                className="w-full py-4 bg-terracotta-500 hover:bg-terracotta-600 text-white rounded-full text-xs font-bold uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed transform active:scale-98"
              >
                <span>Buy It Now</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Reassurance Grid */}
          <div className="space-y-3 pt-4 border-t border-stone-200 text-xs text-stone-600">
            <div className="flex items-center gap-3">
              <Truck className="w-4 h-4 text-stone-500 shrink-0" />
              <span>Complimentary careful packaging by the artisan studio</span>
            </div>
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Direct Support Guarantee: 95% proceeds go to maker</span>
            </div>
            <div className="flex items-center gap-3">
              <RotateCcw className="w-4 h-4 text-stone-500 shrink-0" />
              <span>Buyer guarantee with verified tracking on all deliveries</span>
            </div>
          </div>
        </div>
      </div>

      {/* Craft Description & Detail Tabs */}
      <div className="bg-white rounded-3xl border border-stone-200/90 p-6 sm:p-10 shadow-sm space-y-6">
        {/* Tabs Bar */}
        <div className="flex items-center gap-4 border-b border-stone-200 pb-3">
          <button
            onClick={() => setActiveTab('story')}
            className={`pb-3 px-1 text-sm font-bold border-b-2 transition-colors cursor-pointer ${
              activeTab === 'story'
                ? 'border-terracotta-500 text-stone-900'
                : 'border-transparent text-stone-400 hover:text-stone-700'
            }`}
          >
            Craft Story & Technique
          </button>
          <button
            onClick={() => setActiveTab('materials')}
            className={`pb-3 px-1 text-sm font-bold border-b-2 transition-colors cursor-pointer ${
              activeTab === 'materials'
                ? 'border-terracotta-500 text-stone-900'
                : 'border-transparent text-stone-400 hover:text-stone-700'
            }`}
          >
            Materials & Sustainability
          </button>
          <button
            onClick={() => setActiveTab('shipping')}
            className={`pb-3 px-1 text-sm font-bold border-b-2 transition-colors cursor-pointer ${
              activeTab === 'shipping'
                ? 'border-terracotta-500 text-stone-900'
                : 'border-transparent text-stone-400 hover:text-stone-700'
            }`}
          >
            Packaging & Delivery
          </button>
        </div>

        {/* Tab Contents */}
        {activeTab === 'story' && (
          <div className="space-y-4 animate-in fade-in">
            <h3 className="font-serif text-xl font-bold text-stone-900">
              The Artisan Story
            </h3>
            <p className="text-stone-700 text-sm leading-relaxed whitespace-pre-line">
              {product.description}
            </p>
          </div>
        )}

        {activeTab === 'materials' && (
          <div className="space-y-4 animate-in fade-in">
            <h3 className="font-serif text-xl font-bold text-stone-900 flex items-center gap-2">
              <Leaf className="w-5 h-5 text-emerald-600" />
              Sourced Sustainably
            </h3>
            <p className="text-stone-700 text-sm leading-relaxed">
              Every creation is made using small-batch, sustainably harvested raw materials. Non-toxic glazes, natural dyes, and certified hardwoods ensure heirloom durability with minimal environmental impact.
            </p>
          </div>
        )}

        {activeTab === 'shipping' && (
          <div className="space-y-4 animate-in fade-in">
            <h3 className="font-serif text-xl font-bold text-stone-900 flex items-center gap-2">
              <Truck className="w-5 h-5 text-terracotta-500" />
              Studio Packaging & Care
            </h3>
            <p className="text-stone-700 text-sm leading-relaxed">
              Each piece is securely insulated with recyclable kraft padding and shipped with a personalized maker card. All packages include door-to-door tracking numbers sent via email.
            </p>
          </div>
        )}
      </div>

      {/* Customer Reviews & Ratings Section */}
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
            Collector Reviews & Ratings
          </h2>
        </div>
        <ReviewList
          productId={product._id}
          averageRating={product.rating || 0}
          numReviews={product.numReviews || 0}
        />
      </div>
    </div>
  );
};

export default ProductDetailPage;
