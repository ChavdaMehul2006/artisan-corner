import React from 'react';
import { PackageOpen } from 'lucide-react';
import { Link } from 'react-router-dom';

export const EmptyState = ({
  icon: Icon = PackageOpen,
  title = 'No items found',
  description = 'We could not find any items matching your criteria.',
  actionText = null,
  actionLink = null,
  onAction = null
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-white rounded-3xl border border-stone-200/80 shadow-artisan max-w-lg mx-auto my-8">
      <div className="w-20 h-20 bg-artisan-100 rounded-full flex items-center justify-center text-terracotta-600 mb-5 shadow-inner">
        <Icon className="w-10 h-10" />
      </div>
      <h3 className="text-xl font-serif font-bold text-stone-900 mb-2">{title}</h3>
      <p className="text-sm text-stone-500 max-w-sm mb-6 leading-relaxed">{description}</p>
      {actionText && (
        actionLink ? (
          <Link
            to={actionLink}
            className="inline-flex items-center justify-center px-6 py-2.5 rounded-full bg-terracotta-600 hover:bg-terracotta-700 text-white text-sm font-semibold transition-all shadow-md hover:shadow-lg"
          >
            {actionText}
          </Link>
        ) : (
          <button
            onClick={onAction}
            className="inline-flex items-center justify-center px-6 py-2.5 rounded-full bg-terracotta-600 hover:bg-terracotta-700 text-white text-sm font-semibold transition-all shadow-md hover:shadow-lg"
          >
            {actionText}
          </button>
        )
      )}
    </div>
  );
};

export default EmptyState;
