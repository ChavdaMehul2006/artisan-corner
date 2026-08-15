import React from 'react';
import { CATEGORIES, SORT_OPTIONS } from '../../constants';
import { Filter, RotateCcw, Check } from 'lucide-react';

export const ProductFilters = ({
  filters,
  onChange,
  onReset,
  totalResults = 0
}) => {
  const handleCategoryClick = (cat) => {
    onChange({ category: filters.category === cat ? '' : cat, page: 1 });
  };

  const handleRatingClick = (rating) => {
    onChange({ minRating: filters.minRating === rating ? '' : rating, page: 1 });
  };

  const handleStockToggle = () => {
    onChange({ inStockOnly: !filters.inStockOnly, page: 1 });
  };

  return (
    <div className="bg-white rounded-2xl border border-stone-200/80 p-5 space-y-6 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-stone-100">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-terracotta-600" />
          <h3 className="font-semibold text-stone-900 text-sm">Filter Products</h3>
        </div>
        <button
          onClick={onReset}
          className="inline-flex items-center gap-1 text-xs text-stone-500 hover:text-terracotta-600 transition-colors"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset</span>
        </button>
      </div>

      {/* Sort By Dropdown for Mobile / Compact */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-stone-500">
          Sort By
        </label>
        <select
          value={filters.sort || 'newest'}
          onChange={(e) => onChange({ sort: e.target.value, page: 1 })}
          className="w-full px-3 py-2 bg-artisan-50 border border-stone-300 rounded-xl text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-terracotta-500/20 focus:border-terracotta-500"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Categories */}
      <div className="space-y-2.5">
        <label className="text-xs font-bold uppercase tracking-wider text-stone-500">
          Craft Categories
        </label>
        <div className="space-y-1">
          <button
            onClick={() => onChange({ category: '', page: 1 })}
            className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-xs font-medium text-left transition-colors ${
              !filters.category
                ? 'bg-terracotta-50 text-terracotta-700 font-bold'
                : 'text-stone-600 hover:bg-stone-50'
            }`}
          >
            <span>All Categories</span>
            {!filters.category && <Check className="w-3.5 h-3.5 text-terracotta-600" />}
          </button>
          {CATEGORIES.map((cat) => {
            const isSelected = filters.category === cat;
            return (
              <button
                key={cat}
                onClick={() => handleCategoryClick(cat)}
                className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-xs font-medium text-left transition-colors ${
                  isSelected
                    ? 'bg-terracotta-50 text-terracotta-700 font-bold'
                    : 'text-stone-600 hover:bg-stone-50'
                }`}
              >
                <span className="truncate">{cat}</span>
                {isSelected && <Check className="w-3.5 h-3.5 text-terracotta-600 shrink-0" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Price Range */}
      <div className="space-y-2.5 pt-4 border-t border-stone-100">
        <label className="text-xs font-bold uppercase tracking-wider text-stone-500">
          Price Range ($)
        </label>
        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder="Min"
            min="0"
            value={filters.minPrice || ''}
            onChange={(e) => onChange({ minPrice: e.target.value, page: 1 })}
            className="w-full px-3 py-1.5 bg-artisan-50 border border-stone-300 rounded-xl text-xs text-stone-800 focus:outline-none focus:border-terracotta-500"
          />
          <span className="text-stone-400 text-xs">-</span>
          <input
            type="number"
            placeholder="Max"
            min="0"
            value={filters.maxPrice || ''}
            onChange={(e) => onChange({ maxPrice: e.target.value, page: 1 })}
            className="w-full px-3 py-1.5 bg-artisan-50 border border-stone-300 rounded-xl text-xs text-stone-800 focus:outline-none focus:border-terracotta-500"
          />
        </div>
      </div>

      {/* Rating */}
      <div className="space-y-2.5 pt-4 border-t border-stone-100">
        <label className="text-xs font-bold uppercase tracking-wider text-stone-500">
          Minimum Rating
        </label>
        <div className="space-y-1.5">
          {[4, 3].map((stars) => {
            const isSelected = filters.minRating === String(stars);
            return (
              <button
                key={stars}
                onClick={() => handleRatingClick(String(stars))}
                className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-xs text-left transition-colors ${
                  isSelected ? 'bg-amber-50 text-amber-900 font-bold' : 'text-stone-600 hover:bg-stone-50'
                }`}
              >
                <span>{stars} Stars & Above</span>
                {isSelected && <Check className="w-3.5 h-3.5 text-amber-600" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Stock Availability */}
      <div className="pt-4 border-t border-stone-100">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={!!filters.inStockOnly}
            onChange={handleStockToggle}
            className="w-4 h-4 text-terracotta-600 rounded border-stone-300 focus:ring-terracotta-500"
          />
          <span className="text-xs font-medium text-stone-700">In-Stock Items Only</span>
        </label>
      </div>
    </div>
  );
};

export default ProductFilters;
