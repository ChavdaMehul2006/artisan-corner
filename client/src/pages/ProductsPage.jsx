import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, X, SlidersHorizontal, ChevronLeft, ChevronRight } from 'lucide-react';
import ProductGrid from '../components/product/ProductGrid';
import ProductFilters from '../components/product/ProductFilters';
import axiosClient from '../api/axiosClient';

export const ProductsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 12, total: 0, pages: 1 });
  const [loading, setLoading] = useState(true);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Read state from URL search params
  const currentFilters = {
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    minRating: searchParams.get('minRating') || '',
    sort: searchParams.get('sort') || 'newest',
    inStockOnly: searchParams.get('inStockOnly') === 'true',
    page: parseInt(searchParams.get('page'), 10) || 1
  };

  const updateFilters = (newFilters) => {
    const merged = { ...currentFilters, ...newFilters };
    const params = new URLSearchParams();

    Object.entries(merged).forEach(([key, val]) => {
      if (val !== '' && val !== false && val !== null && val !== undefined) {
        params.set(key, val);
      }
    });

    setSearchParams(params);
  };

  const resetFilters = () => {
    setSearchParams(new URLSearchParams());
  };

  useEffect(() => {
    const fetchCatalog = async () => {
      try {
        setLoading(true);
        const queryParams = new URLSearchParams(searchParams);
        queryParams.set('limit', '12');

        const res = await axiosClient.get(`/products?${queryParams.toString()}`);
        setProducts(res.data.products || []);
        setPagination(res.data.pagination || { page: 1, limit: 12, total: 0, pages: 1 });
      } catch (err) {
        console.error('Failed to load products', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCatalog();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [searchParams]);

  // Active filter pills
  const activeFilters = [];
  if (currentFilters.category) activeFilters.push({ key: 'category', label: `Category: ${currentFilters.category}` });
  if (currentFilters.search) activeFilters.push({ key: 'search', label: `Search: "${currentFilters.search}"` });
  if (currentFilters.minPrice || currentFilters.maxPrice) {
    activeFilters.push({
      key: 'price',
      label: `Price: $${currentFilters.minPrice || '0'} - $${currentFilters.maxPrice || '∞'}`
    });
  }
  if (currentFilters.minRating) activeFilters.push({ key: 'minRating', label: `${currentFilters.minRating}★ & up` });
  if (currentFilters.inStockOnly) activeFilters.push({ key: 'inStockOnly', label: 'In Stock Only' });

  const removeFilter = (key) => {
    if (key === 'price') {
      updateFilters({ minPrice: '', maxPrice: '', page: 1 });
    } else if (key === 'inStockOnly') {
      updateFilters({ inStockOnly: false, page: 1 });
    } else {
      updateFilters({ [key]: '', page: 1 });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-stone-200">
        <div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900">
            {currentFilters.category || 'Handcrafted Catalog'}
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Showing {pagination.total} artisanal {pagination.total === 1 ? 'creation' : 'creations'}
          </p>
        </div>

        {/* Mobile filter toggle */}
        <div className="flex items-center gap-3 md:hidden">
          <button
            onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-stone-300 rounded-xl text-xs font-bold text-stone-800 shadow-2xs"
          >
            <SlidersHorizontal className="w-4 h-4 text-terracotta-600" />
            <span>Filters ({activeFilters.length})</span>
          </button>
        </div>
      </div>

      {/* Active Filter Pills */}
      {activeFilters.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 pt-4">
          <span className="text-xs font-semibold text-stone-400">Active filters:</span>
          {activeFilters.map((f) => (
            <span
              key={f.key}
              className="inline-flex items-center gap-1 px-3 py-1 bg-terracotta-50 text-terracotta-800 border border-terracotta-200 rounded-full text-xs font-medium"
            >
              <span>{f.label}</span>
              <button
                onClick={() => removeFilter(f.key)}
                className="hover:text-terracotta-900"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
          <button
            onClick={resetFilters}
            className="text-xs text-stone-500 hover:text-terracotta-600 underline font-medium ml-2"
          >
            Clear all
          </button>
        </div>
      )}

      {/* Main Grid & Filters Container */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pt-8">
        {/* Desktop Sidebar Filters */}
        <div className="hidden md:block md:col-span-1">
          <ProductFilters
            filters={currentFilters}
            onChange={updateFilters}
            onReset={resetFilters}
            totalResults={pagination.total}
          />
        </div>

        {/* Mobile Filters Drawer Modal */}
        {mobileFiltersOpen && (
          <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex justify-end md:hidden">
            <div className="w-4/5 max-w-sm bg-white h-full p-6 overflow-y-auto space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-stone-200">
                <h3 className="font-serif font-bold text-lg text-stone-900">Filters</h3>
                <button onClick={() => setMobileFiltersOpen(false)}>
                  <X className="w-5 h-5 text-stone-500" />
                </button>
              </div>
              <ProductFilters
                filters={currentFilters}
                onChange={(f) => {
                  updateFilters(f);
                  setMobileFiltersOpen(false);
                }}
                onReset={() => {
                  resetFilters();
                  setMobileFiltersOpen(false);
                }}
                totalResults={pagination.total}
              />
            </div>
          </div>
        )}

        {/* Products Grid */}
        <div className="md:col-span-3 space-y-8">
          <ProductGrid
            products={products}
            loading={loading}
            onClearFilters={resetFilters}
            columns="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
          />

          {/* Pagination Controls */}
          {pagination.pages > 1 && (
            <div className="flex items-center justify-center gap-3 pt-8 border-t border-stone-200">
              <button
                disabled={pagination.page <= 1}
                onClick={() => updateFilters({ page: pagination.page - 1 })}
                className="p-2.5 rounded-xl border border-stone-300 bg-white text-stone-700 hover:bg-stone-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <span className="text-xs font-semibold text-stone-700">
                Page {pagination.page} of {pagination.pages}
              </span>

              <button
                disabled={pagination.page >= pagination.pages}
                onClick={() => updateFilters({ page: pagination.page + 1 })}
                className="p-2.5 rounded-xl border border-stone-300 bg-white text-stone-700 hover:bg-stone-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;
