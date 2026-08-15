import React from 'react';
import { Link } from 'react-router-dom';
import { Store, Heart, ShieldCheck, Truck, RefreshCw, Mail } from 'lucide-react';
import { CATEGORIES } from '../../constants';

export const Footer = () => {
  return (
    <footer className="bg-stone-900 text-stone-300 mt-auto border-t border-stone-800">
      {/* Values Banner */}
      <div className="border-b border-stone-800 bg-stone-950/60 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-terracotta-600/20 text-terracotta-400 flex items-center justify-center shrink-0">
                <Store className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">Direct Artisan Payout</h4>
                <p className="text-xs text-stone-400">95% of proceeds go directly to the maker</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-600/20 text-emerald-400 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">Verified Authenticity</h4>
                <p className="text-xs text-stone-400">Every artisan store is vetted & approved</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-amberGold-500/20 text-amberGold-400 flex items-center justify-center shrink-0">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">Secure Packaging</h4>
                <p className="text-xs text-stone-400">Carefully packed by the creators</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-indigo-600/20 text-indigo-400 flex items-center justify-center shrink-0">
                <RefreshCw className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">Buyer Protection</h4>
                <p className="text-xs text-stone-400">Encrypted Stripe payments & verified reviews</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10">
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-terracotta-600 flex items-center justify-center text-white">
                <Store className="w-5 h-5" />
              </div>
              <span className="font-serif text-2xl font-bold text-white tracking-tight">
                Artisan's<span className="text-terracotta-500">.</span>Corner
              </span>
            </Link>
            <p className="text-sm text-stone-400 max-w-sm leading-relaxed">
              A curated global marketplace connecting passionate makers and mindful collectors. From ceramic studios to heritage woodshops, discover pieces made with soul.
            </p>
            <div className="pt-2">
              <Link
                to="/become-vendor"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-terracotta-600 hover:bg-terracotta-700 text-white text-xs font-semibold uppercase tracking-wider transition-all"
              >
                Apply to Sell Your Craft →
              </Link>
            </div>
          </div>

          {/* Categories Col */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-stone-200 mb-4">
              Handcrafted Categories
            </h4>
            <ul className="space-y-2 text-sm text-stone-400">
              {CATEGORIES.slice(0, 6).map((cat) => (
                <li key={cat}>
                  <Link
                    to={`/products?category=${encodeURIComponent(cat)}`}
                    className="hover:text-terracotta-400 transition-colors"
                  >
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Marketplace Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-stone-200 mb-4">
              Marketplace
            </h4>
            <ul className="space-y-2 text-sm text-stone-400">
              <li>
                <Link to="/products" className="hover:text-terracotta-400 transition-colors">
                  All Products
                </Link>
              </li>
              <li>
                <Link to="/products?sort=rating" className="hover:text-terracotta-400 transition-colors">
                  Top Rated Craft
                </Link>
              </li>
              <li>
                <Link to="/become-vendor" className="hover:text-terracotta-400 transition-colors">
                  Sell on Artisan's Corner
                </Link>
              </li>
              <li>
                <Link to="/orders" className="hover:text-terracotta-400 transition-colors">
                  Order Tracking
                </Link>
              </li>
              <li>
                <Link to="/wishlist" className="hover:text-terracotta-400 transition-colors">
                  Saved Wishlist
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-stone-200 mb-4">
              Artisan Stories
            </h4>
            <p className="text-xs text-stone-400 mb-3 leading-relaxed">
              Subscribe for weekly maker spotlights, studio visits, and exclusive seasonal releases.
            </p>
            <form onSubmit={(e) => { e.preventDefault(); alert('Thank you for subscribing to Artisan Stories!'); }} className="space-y-2">
              <input
                type="email"
                required
                placeholder="Enter your email"
                className="w-full px-3.5 py-2 bg-stone-800 border border-stone-700 rounded-xl text-xs text-white placeholder-stone-500 focus:outline-none focus:border-terracotta-500"
              />
              <button
                type="submit"
                className="w-full py-2 bg-stone-700 hover:bg-stone-600 text-white rounded-xl text-xs font-semibold transition-colors"
              >
                Join Newsletter
              </button>
            </form>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="border-t border-stone-800/80 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <p>© {new Date().getFullYear()} Artisan's Corner Marketplace Inc. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span>Made with passion for independent makers worldwide</span>
            <span className="flex items-center gap-1 text-stone-400">
              <Heart className="w-3.5 h-3.5 text-terracotta-500 fill-terracotta-500" />
              Handcrafted Web
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
