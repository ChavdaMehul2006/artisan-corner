import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  ShoppingBag,
  Heart,
  User as UserIcon,
  Search,
  Menu,
  X,
  Store,
  Shield,
  LogOut,
  Package,
  Layers,
  ChevronDown,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { logoutUser } from '../../store/slices/authSlice';
import { CATEGORIES } from '../../constants';

export const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const { user, isAuthenticated, isVendor, isAdmin } = useSelector((state) => state.auth);
  const { items: cartItems } = useSelector((state) => state.cart);
  const { productIds: wishlistIds } = useSelector((state) => state.wishlist);

  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);

  const userMenuRef = useRef(null);
  const categoryMenuRef = useRef(null);

  const totalCartCount = (cartItems || []).reduce((acc, i) => acc + (i.quantity || 1), 0);

  // Close menus on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
      if (categoryMenuRef.current && !categoryMenuRef.current.contains(event.target)) {
        setIsCategoriesOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/products');
    }
  };

  const handleLogout = async () => {
    await dispatch(logoutUser());
    setIsUserMenuOpen(false);
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-50 artisan-glass border-b border-stone-200/80 transition-all duration-300">
      {/* Top Announcement Bar */}

{/*        
      <div className="bg-charcoal-900 text-stone-300 text-xs py-2 px-4 text-center tracking-wide font-medium flex items-center justify-center gap-2">
        <Sparkles className="w-3.5 h-3.5 text-amberGold-400 shrink-0" />
        <span>Direct from Master Artisans • 95% Payout Guaranteed to Independent Makers</span>
      </div>
       */}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4 sm:gap-6">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3 shrink-0 group">
            <div className="w-10 h-10 rounded-2xl bg-terracotta-500 flex items-center justify-center text-white shadow-md group-hover:bg-terracotta-600 transition-all transform group-hover:scale-105 duration-300">
              <Store className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-2xl font-bold tracking-tight text-stone-900 leading-none group-hover:text-terracotta-600 transition-colors">
                Artisan's<span className="text-terracotta-500">.</span>Corner
              </span>
              <span className="text-[10px] uppercase font-bold tracking-widest text-stone-500 mt-1">
                Handcrafted Marketplace
              </span>
            </div>
          </Link>

          {/* Search Bar - Desktop */}
          <form
            onSubmit={handleSearchSubmit}
            className="hidden md:flex flex-1 max-w-md lg:max-w-lg items-center relative"
          >
            <input
              type="text"
              placeholder="Search ceramics, jewelry, textiles, woodwork..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-20 py-2.5 bg-white/90 border border-stone-300/90 rounded-full text-xs sm:text-sm placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-terracotta-500/20 focus:border-terracotta-500 focus:bg-white shadow-2xs transition-all"
            />
            <Search className="w-4 h-4 text-stone-400 absolute left-4 pointer-events-none" />
            <button
              type="submit"
              className="absolute right-1.5 px-3.5 py-1.5 bg-stone-900 hover:bg-terracotta-600 text-white rounded-full text-xs font-semibold transition-all shadow-2xs cursor-pointer"
            >
              Search
            </button>
          </form>

          {/* Navigation & Action Links */}
          <div className="flex items-center gap-1.5 sm:gap-3">
            {/* Categories Dropdown */}
            <div className="relative hidden lg:block" ref={categoryMenuRef}>
              <button
                onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-bold uppercase tracking-wider text-stone-700 hover:bg-artisan-100 hover:text-stone-900 transition-colors cursor-pointer"
              >
                <Layers className="w-4 h-4 text-terracotta-500" />
                <span>Crafts</span>
                <ChevronDown className={`w-3.5 h-3.5 text-stone-400 transition-transform duration-200 ${isCategoriesOpen ? 'rotate-180' : ''}`} />
              </button>

              {isCategoriesOpen && (
                <div className="absolute top-full right-0 mt-3 w-64 bg-white rounded-3xl shadow-xl border border-stone-200/90 py-3 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="px-4 py-2 text-[10px] font-bold text-stone-400 uppercase tracking-widest border-b border-stone-100">
                    Handmade Craft Mediums
                  </div>
                  <div className="py-1">
                    {CATEGORIES.map((cat) => (
                      <Link
                        key={cat}
                        to={`/products?category=${encodeURIComponent(cat)}`}
                        onClick={() => setIsCategoriesOpen(false)}
                        className="flex items-center justify-between px-4 py-2.5 text-xs font-medium text-stone-700 hover:bg-artisan-50 hover:text-terracotta-600 transition-colors"
                      >
                        <span>{cat}</span>
                        <ArrowRight className="w-3 h-3 text-stone-300 group-hover:text-terracotta-500" />
                      </Link>
                    ))}
                  </div>
                  <div className="border-t border-stone-100 pt-2 px-2 mt-1">
                    <Link
                      to="/products"
                      onClick={() => setIsCategoriesOpen(false)}
                      className="block text-center py-2 px-3 bg-artisan-100 hover:bg-terracotta-50 text-terracotta-600 rounded-xl text-xs font-bold transition-colors"
                    >
                      Browse Entire Catalog →
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Wishlist Button */}
            <Link
              to="/wishlist"
              className="relative p-2.5 text-stone-700 hover:text-terracotta-600 hover:bg-white rounded-full transition-all duration-200 border border-transparent hover:border-stone-200"
              title="Saved Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlistIds && wishlistIds.length > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-terracotta-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center shadow-sm">
                  {wishlistIds.length}
                </span>
              )}
            </Link>

            {/* Cart Button */}
            <Link
              to="/cart"
              className="relative p-2.5 text-stone-700 hover:text-terracotta-600 hover:bg-white rounded-full transition-all duration-200 border border-transparent hover:border-stone-200"
              title="Artisan Basket"
            >
              <ShoppingBag className="w-5 h-5" />
              {totalCartCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-amberGold-500 text-stone-900 rounded-full text-[10px] font-extrabold flex items-center justify-center shadow-sm">
                  {totalCartCount}
                </span>
              )}
            </Link>

            {/* User Account / Auth Dropdown */}
            {isAuthenticated ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 p-1.5 pl-2 pr-3 rounded-full hover:bg-white transition-all border border-stone-200/90 shadow-2xs cursor-pointer"
                >
                  <img
                    src={user?.avatar?.url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'}
                    alt={user?.name}
                    className="w-7 h-7 rounded-full object-cover border border-stone-300"
                  />
                  <span className="text-xs font-bold text-stone-800 max-w-[100px] truncate hidden sm:inline">
                    {user?.name?.split(' ')[0]}
                  </span>
                  <ChevronDown className={`w-3.5 h-3.5 text-stone-400 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-3 w-64 bg-white rounded-3xl shadow-xl border border-stone-200/90 py-3 z-50 animate-in fade-in slide-in-from-top-2">
                    <div className="px-4 py-3 border-b border-stone-100">
                      <p className="text-sm font-bold text-stone-900 truncate">{user?.name}</p>
                      <p className="text-xs text-stone-500 truncate font-mono">{user?.email}</p>
                      <span className="inline-block mt-1.5 px-2.5 py-0.5 bg-artisan-100 text-stone-700 text-[10px] font-extrabold rounded-full uppercase tracking-wider">
                        {user?.role} Account
                      </span>
                    </div>

                    <div className="py-1.5">
                      {isVendor && (
                        <Link
                          to="/dashboard/seller"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-bold text-terracotta-600 hover:bg-terracotta-50 transition-colors"
                        >
                          <Store className="w-4 h-4" />
                          <span>Vendor Studio</span>
                        </Link>
                      )}

                      {isAdmin && (
                        <Link
                          to="/dashboard/admin"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-bold text-indigo-600 hover:bg-indigo-50 transition-colors"
                        >
                          <Shield className="w-4 h-4" />
                          <span>Admin Control Center</span>
                        </Link>
                      )}

                      {!isVendor && !isAdmin && (
                        <Link
                          to="/become-vendor"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-bold text-amberGold-600 hover:bg-amber-50 transition-colors"
                        >
                          <Store className="w-4 h-4" />
                          <span>Open Artisan Studio</span>
                        </Link>
                      )}

                      <Link
                        to="/orders"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-stone-700 hover:bg-artisan-50 transition-colors"
                      >
                        <Package className="w-4 h-4 text-stone-400" />
                        <span>My Orders</span>
                      </Link>

                      <Link
                        to="/profile"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-stone-700 hover:bg-artisan-50 transition-colors"
                      >
                        <UserIcon className="w-4 h-4 text-stone-400" />
                        <span>Profile Settings</span>
                      </Link>
                    </div>

                    <div className="border-t border-stone-100 pt-1.5 px-2 mt-1">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-xs font-bold text-stone-700 hover:text-stone-900 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-5 py-2.5 rounded-full bg-stone-900 hover:bg-terracotta-500 text-white text-xs font-bold transition-all shadow-sm hover:shadow"
                >
                  Join Us
                </Link>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-stone-700 hover:bg-white rounded-xl border border-stone-200"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Search & Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-stone-200 space-y-4 animate-in fade-in">
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-stone-300 rounded-xl text-xs"
              />
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
            </form>

            <div className="space-y-1">
              <Link
                to="/products"
                className="block px-3 py-2 rounded-xl text-xs font-bold text-stone-900 hover:bg-artisan-100"
              >
                All Artisan Products
              </Link>
              {CATEGORIES.map((cat) => (
                <Link
                  key={cat}
                  to={`/products?category=${encodeURIComponent(cat)}`}
                  className="block px-3 py-1.5 rounded-xl text-xs text-stone-600 hover:bg-artisan-100"
                >
                  {cat}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
