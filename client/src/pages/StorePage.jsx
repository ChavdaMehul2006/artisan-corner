import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Store, MapPin, Phone, Calendar, ArrowLeft } from 'lucide-react';
import ProductGrid from '../components/product/ProductGrid';
import { formatDate } from '../utils/formatters';
import axiosClient from '../api/axiosClient';

export const StorePage = () => {
  const { slug } = useParams();
  const [storeData, setStoreData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStore = async () => {
      try {
        setLoading(true);
        const res = await axiosClient.get(`/stores/${slug}`);
        setStoreData(res.data);
      } catch (err) {
        console.error('Failed to load store', err);
      } finally {
        setLoading(false);
      }
    };
    if (slug) {
      fetchStore();
      window.scrollTo(0, 0);
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 border-3 border-terracotta-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!storeData || !storeData.store) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center space-y-4">
        <h2 className="font-serif text-3xl font-bold text-stone-900">Artisan Studio Not Found</h2>
        <p className="text-sm text-stone-500">This store is either private or awaiting approval.</p>
        <Link to="/products" className="inline-block px-6 py-2.5 bg-stone-900 text-white rounded-full text-xs font-bold">
          Explore Marketplace
        </Link>
      </div>
    );
  }

  const { store, products } = storeData;

  return (
    <div className="space-y-12 pb-20">
      {/* Store Banner */}
      <div className="relative h-64 sm:h-80 bg-stone-900 overflow-hidden">
        <img
          src={store.banner?.url || 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=1200'}
          alt={`${store.name} studio banner`}
          className="w-full h-full object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-transparent"></div>
      </div>

      {/* Store Profile Card */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 relative z-10">
        <div className="bg-white rounded-3xl border border-stone-200/80 p-6 sm:p-8 shadow-artisan">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
              <img
                src={store.logo?.url || 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=300'}
                alt={store.name}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-4 border-white shadow-md bg-stone-100"
              />
              <div className="space-y-1">
                <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  <Store className="w-3 h-3" />
                  Verified Artisan Studio
                </span>
                <h1 className="font-serif text-2xl sm:text-3xl font-extrabold text-stone-900">
                  {store.name}
                </h1>
                <p className="text-xs text-stone-500">
                  Crafted with dedication • Member since {formatDate(store.createdAt)}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-xs text-stone-600 bg-artisan-50 p-4 rounded-2xl border border-stone-200">
              {store.address?.city && (
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-terracotta-600 shrink-0" />
                  <span>{store.address.city}, {store.address.state}</span>
                </div>
              )}
              {store.phone && (
                <div className="flex items-center gap-1.5">
                  <Phone className="w-4 h-4 text-stone-500 shrink-0" />
                  <span>{store.phone}</span>
                </div>
              )}
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-stone-100">
            <p className="text-sm text-stone-700 leading-relaxed max-w-3xl">
              {store.description}
            </p>
          </div>
        </div>
      </div>

      {/* Store Products */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-stone-200">
          <div>
            <h3 className="font-serif text-2xl font-bold text-stone-900">
              Studio Creations
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              Browse {products?.length || 0} handcrafted items by {store.name}
            </p>
          </div>
          <Link
            to="/products"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-600 hover:text-stone-900"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>All Marketplace Crafts</span>
          </Link>
        </div>

        <ProductGrid
          products={products}
          loading={false}
          emptyTitle="No creations currently available"
          emptyDescription="This artisan is currently working on new studio releases. Check back soon!"
        />
      </div>
    </div>
  );
};

export default StorePage;
