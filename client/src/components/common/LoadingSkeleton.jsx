import React from 'react';

export const ProductCardSkeleton = () => (
  <div className="artisan-card p-4 animate-pulse">
    <div className="w-full h-64 bg-stone-200 rounded-xl mb-4"></div>
    <div className="h-4 bg-stone-200 rounded w-1/3 mb-2"></div>
    <div className="h-5 bg-stone-200 rounded w-4/5 mb-3"></div>
    <div className="flex items-center justify-between mt-4">
      <div className="h-6 bg-stone-200 rounded w-1/4"></div>
      <div className="h-8 bg-stone-200 rounded-lg w-1/3"></div>
    </div>
  </div>
);

export const ProductGridSkeleton = ({ count = 8 }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
    {Array.from({ length: count }).map((_, i) => (
      <ProductCardSkeleton key={i} />
    ))}
  </div>
);

export const TableSkeleton = ({ rows = 5 }) => (
  <div className="w-full bg-white rounded-2xl p-4 shadow-artisan animate-pulse">
    <div className="h-10 bg-stone-200 rounded mb-4"></div>
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} className="h-14 bg-stone-100 rounded mb-2"></div>
    ))}
  </div>
);
