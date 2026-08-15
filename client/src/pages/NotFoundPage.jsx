import React from 'react';
import { Link } from 'react-router-dom';
import { Store, ArrowLeft } from 'lucide-react';

export const NotFoundPage = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 py-16 space-y-6">
      <div className="w-16 h-16 rounded-full bg-artisan-100 text-terracotta-600 flex items-center justify-center shadow-inner">
        <Store className="w-8 h-8" />
      </div>
      <h1 className="font-serif text-5xl sm:text-6xl font-extrabold text-stone-900">
        404
      </h1>
      <h2 className="font-serif text-2xl font-bold text-stone-800">
        Artisan Piece Not Found
      </h2>
      <p className="text-sm text-stone-500 max-w-sm leading-relaxed">
        The page you are looking for might have been moved, renamed, or is unavailable in our catalog.
      </p>
      <Link
        to="/"
        className="inline-flex items-center gap-2 px-8 py-3 bg-stone-900 hover:bg-terracotta-600 text-white rounded-full text-xs font-bold uppercase tracking-wider transition-all shadow-md"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Return to Marketplace</span>
      </Link>
    </div>
  );
};

export default NotFoundPage;
