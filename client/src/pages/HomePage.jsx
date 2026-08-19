import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  Store,
  ShieldCheck,
  Heart,
  Truck,
  Layers,
  ChevronRight,
  Star,
  Quote,
  CheckCircle2
} from 'lucide-react';
import ProductGrid from '../components/product/ProductGrid';
import axiosClient from '../api/axiosClient';
import { CATEGORIES } from '../constants';

export const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [popularStores, setPopularStores] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        setLoading(true);
        const [prodRes, storeRes] = await Promise.all([
          axiosClient.get('/products/featured?limit=8'),
          axiosClient.get('/stores/featured?limit=3')
        ]);
        setFeaturedProducts(prodRes.data || []);
        setPopularStores(storeRes.data || []);
      } catch (err) {
        console.error('Failed to load home data', err);
      } finally {
        setLoading(false);
      }
    };
    loadHomeData();
  }, []);

  return (
    <div className="space-y-20 sm:space-y-28 pb-24">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-artisan-100/90 via-artisan-100/40 to-artisan-50 border-b border-stone-200/80 py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Hero Text */}
            <div className="lg:col-span-7 space-y-6 sm:space-y-8">
              {/* <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-stone-200 text-terracotta-700 text-xs font-bold tracking-wide shadow-2xs">
                <Sparkles className="w-4 h-4 text-amberGold-500" />
                <span>Curated Handcrafted Marketplace</span>
              </div> */}

              <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-extrabold text-stone-900 leading-[1.1] tracking-tight">
                Handcrafted Stories, <br />
                <span className="text-terracotta-500 italic font-medium"> Made With Soul.</span>
              </h1>

              <p className="text-base sm:text-lg text-stone-600 max-w-xl leading-relaxed">
                Explore unique ceramics, hand-loomed textiles, timeless woodwork, and thoughtfully crafted jewelry—created by independent artisans who bring tradition, creativity, and passion to every piece.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  to="/products"
                  className="px-8 py-4 rounded-full bg-stone-900 hover:bg-terracotta-500 text-white font-bold text-sm transition-all shadow-md hover:shadow-lg flex items-center gap-2 transform active:scale-98"
                >
                  <span>Explore Marketplace</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/become-vendor"
                  className="px-8 py-4 rounded-full bg-white hover:bg-artisan-100 text-stone-900 border border-stone-300 font-bold text-sm transition-all shadow-2xs"
                >
                  Open Artisan Studio
                </Link>
              </div>

              {/* Stats badges */}
              <div className="pt-6 grid grid-cols-3 gap-6 border-t border-stone-200/80 max-w-lg">
                <div>
                  <h4 className="font-serif text-2xl sm:text-3xl font-extrabold text-stone-900">95%</h4>
                  <p className="text-xs text-stone-500 font-medium mt-0.5">Direct Maker Payout</p>
                </div>
                <div>
                  <h4 className="font-serif text-2xl sm:text-3xl font-extrabold text-stone-900">100%</h4>
                  <p className="text-xs text-stone-500 font-medium mt-0.5">Verified Studios</p>
                </div>
                <div>
                  <h4 className="font-serif text-2xl sm:text-3xl font-extrabold text-stone-900">0%</h4>
                  <p className="text-xs text-stone-500 font-medium mt-0.5">Mass Production</p>
                </div>
              </div>
            </div>

            {/* Hero Visual Collage */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                <div className="aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-stone-200">
                  <img
                    src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&q=80&w=800"
                    alt="Master artisan ceramicist sculpting clay"
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Floating Artisan Spotlight Card */}
                <div className="absolute -bottom-6 -left-6 sm:-left-8 bg-white/95 backdrop-blur-md p-4 sm:p-5 rounded-3xl border border-stone-200/90 shadow-xl max-w-xs flex items-center gap-3.5 animate-in fade-in">
                  <img
                    src="https://images.unsplash.com/photo-1521119989659-a83eee488004?auto=format&fit=crop&q=80&w=200"
                    alt="Silas Thorne Artisan"
                    className="w-13 h-13 rounded-2xl object-cover border border-stone-200 shadow-xs"
                  />
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-terracotta-500">Maker Spotlight</span>
                    <h5 className="text-sm font-bold text-stone-900">Silas Thorne</h5>
                    <p className="text-xs text-stone-500">Terra & Kiln Pottery, VT</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Featured Craft Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-terracotta-500">
              Curated Collections
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-stone-900 mt-1">
              Explore by Craft Medium
            </h2>
          </div>
          <Link
            to="/products"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-900 hover:text-terracotta-500 transition-colors group"
          >
            <span>View All Categories</span>
            <ChevronRight className="w-4 h-4 text-stone-400 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {CATEGORIES.slice(0, 6).map((cat) => (
            <Link
              key={cat}
              to={`/products?category=${encodeURIComponent(cat)}`}
              className="p-6 bg-white rounded-3xl border border-stone-200/80 shadow-artisan hover:shadow-artisan-hover hover:-translate-y-1 hover:border-terracotta-300 transition-all text-center group flex flex-col items-center justify-center gap-3"
            >
              <div className="w-13 h-13 rounded-2xl bg-artisan-100 group-hover:bg-terracotta-50 text-terracotta-600 flex items-center justify-center transition-colors shadow-2xs">
                <Layers className="w-6 h-6" />
              </div>
              <h4 className="font-serif text-xs sm:text-sm font-bold text-stone-900 group-hover:text-terracotta-500 transition-colors">
                {cat}
              </h4>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. Featured Handcrafted Goods Spotlight */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-terracotta-500">
              Handpicked Spotlight
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-stone-900 mt-1">
              Featured Artisan Releases
            </h2>
          </div>
          <Link
            to="/products"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-900 hover:text-terracotta-500 transition-colors group"
          >
            <span>Browse Full Catalog</span>
            <ChevronRight className="w-4 h-4 text-stone-400 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <ProductGrid products={featuredProducts} loading={loading} />
      </section>

      {/* 4. Popular Artisan Studios Showcase */}
      <section className="bg-artisan-100/60 border-y border-stone-200/80 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-terracotta-500">
              The Creators
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-stone-900">
              Meet Our Featured Artisan Studios
            </h2>
            <p className="text-sm text-stone-600 leading-relaxed">
              Every shop is independently owned and operated by the maker. Support small craft workshops directly with transparent pricing.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {popularStores.map((store) => (
              <div
                key={store._id}
                className="bg-white rounded-3xl border border-stone-200/90 shadow-artisan overflow-hidden flex flex-col group hover:shadow-artisan-hover hover:-translate-y-1 transition-all duration-300"
              >
                <div className="h-44 bg-stone-200 relative overflow-hidden">
                  <img
                    src={store.banner?.url || 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=800'}
                    alt={store.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute -bottom-7 left-6">
                    <img
                      src={store.logo?.url || 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=200'}
                      alt={store.name}
                      className="w-16 h-16 rounded-2xl object-cover border-4 border-white shadow-md bg-white"
                    />
                  </div>
                </div>

                <div className="p-6 pt-11 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="font-serif text-lg font-bold text-stone-900 group-hover:text-terracotta-500 transition-colors">
                      <Link to={`/stores/${store.slug}`}>{store.name}</Link>
                    </h3>
                    <p className="text-xs text-stone-500 line-clamp-2 mt-1.5 leading-relaxed">
                      {store.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
                    <span className="text-xs font-bold text-stone-600">
                      {store.productCount || 0} Crafts Available
                    </span>
                    <Link
                      to={`/stores/${store.slug}`}
                      className="inline-flex items-center gap-1 text-xs font-bold text-terracotta-500 hover:text-terracotta-600 group"
                    >
                      <span>Visit Studio</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Verified Collector Testimonials */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-terracotta-500">
            Collector Stories
          </span>
          <h2 className="font-serif text-3xl font-bold text-stone-900">
            Loved by Mindful Collectors Worldwide
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-7 rounded-3xl border border-stone-200/90 shadow-sm space-y-4">
            <div className="flex items-center gap-1 text-amberGold-500">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-current" />
              ))}
            </div>
            <p className="text-xs text-stone-600 leading-relaxed italic">
              "The handcrafted ceramic mug from Clay & Hearth arrived beautifully packed in natural wood shavings, accompanied by a personal handwritten note. Every detail reflects the warmth and authenticity of true artisan craftsmanship."
            </p>
            <div className="pt-3 border-t border-stone-100 flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-artisan-200 text-stone-700 font-bold text-xs flex items-center justify-center">
                EV
              </div>
              <div>
                <h5 className="text-xs font-bold text-stone-900">Clara Whitmore</h5>
                <span className="text-[10px] text-stone-400">Verified Buyer • San Francisco, CA</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-7 rounded-3xl border border-stone-200/90 shadow-sm space-y-4">
            <div className="flex items-center gap-1 text-amberGold-500">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-current" />
              ))}
            </div>
            <p className="text-xs text-stone-600 leading-relaxed italic">
              "Finally, a marketplace that truly supports independent artisans, with most of the value going directly to the craftspeople. The handcrafted walnut serving board has become a beautiful centerpiece in our kitchen."
            </p>
            <div className="pt-3 border-t border-stone-100 flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-artisan-200 text-stone-700 font-bold text-xs flex items-center justify-center">
                JM
              </div>
              <div>
                <h5 className="text-xs font-bold text-stone-900">Julian Morales</h5>
                <span className="text-[10px] text-stone-400">Verified Buyer • Austin, TX</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-7 rounded-3xl border border-stone-200/90 shadow-sm space-y-4">
            <div className="flex items-center gap-1 text-amberGold-500">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-current" />
              ))}
            </div>
            <p className="text-xs text-stone-600 leading-relaxed italic">
              "The linen throw is stunning, featuring a rich botanical indigo dye. The seamless multi-maker checkout was quick, secure, and made it incredibly easy to shop from several independent artisans at once."
            </p>
            <div className="pt-3 border-t border-stone-100 flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-artisan-200 text-stone-700 font-bold text-xs flex items-center justify-center">
                CH
              </div>
              <div>
                <h5 className="text-xs font-bold text-stone-900">Clara Higgins</h5>
                <span className="text-[10px] text-stone-400">Verified Buyer • Seattle, WA</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Marketplace Manifesto Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center bg-charcoal-900 text-white rounded-3xl p-8 sm:p-14 shadow-2xl">
          <div className="space-y-6">
            <span className="text-xs font-bold uppercase tracking-widest text-amberGold-400">
              Our Craft Marketplace Promise
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-extrabold leading-tight">
              Low Fees.<br />
              More Support for Independent Makers.
            </h2>
            <p className="text-sm text-stone-300 leading-relaxed max-w-lg">
              Many traditional marketplaces take high commissions that can significantly reduce an artisan’s earnings. At Artisan’s Corner, we charge just a 5% platform fee to help cover hosting, maintenance, and secure payment processing — so 98% of every sale goes directly to the creator.
            </p>

            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
                <span className="text-xs sm:text-sm text-stone-200">100% Verified buyer reviews for genuine customer experiences</span>
              </div>
              <div className="flex items-center gap-3">
                <Store className="w-5 h-5 text-amberGold-400 shrink-0" />
                <span className="text-xs sm:text-sm text-stone-200">Independent studio profiles with custom banners, stories, and maker bios</span>
              </div>
              <div className="flex items-center gap-3">
                <Truck className="w-5 h-5 text-indigo-400 shrink-0" />
                <span className="text-xs sm:text-sm text-stone-200">Seamless multi-vendor checkout with secure Stripe payments</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center p-8 sm:p-10 bg-stone-800/80 rounded-3xl border border-stone-700 text-center space-y-4 backdrop-blur-sm">
            <Store className="w-12 h-12 text-terracotta-400" />
            <h3 className="font-serif text-2xl font-bold text-white">
              Are you an artisan, artist, or independent maker?
            </h3>
            <p className="text-xs text-stone-400 max-w-sm leading-relaxed">
              Create your own digital studio, showcase your craftsmanship to collectors around the world, and keep 98% of your hard-earned sales.
            </p>
            <Link
              to="/become-vendor"
              className="px-8 py-3.5 bg-terracotta-500 hover:bg-terracotta-600 text-white rounded-full text-xs font-bold uppercase tracking-wider transition-all shadow-lg hover:shadow-xl transform active:scale-95"
            >
              Apply for Vendor Studio
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
