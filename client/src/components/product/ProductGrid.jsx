import React from 'react';
import ProductCard from './ProductCard';
import { ProductGridSkeleton } from '../common/LoadingSkeleton';
import EmptyState from '../common/EmptyState';

export const ProductGrid = ({
  products = [],
  loading = false,
  emptyTitle = 'No artisan crafts found',
  emptyDescription = 'Try adjusting your search query, price range, or category filter.',
  onClearFilters = null,
  columns = 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4'
}) => {
  if (loading) {
    return <ProductGridSkeleton count={8} />;
  }

  if (!products || products.length === 0) {
    return (
      <EmptyState
        title={emptyTitle}
        description={emptyDescription}
        actionText={onClearFilters ? 'Reset All Filters' : 'Browse All Crafts'}
        onAction={onClearFilters}
        actionLink={!onClearFilters ? '/products' : null}
      />
    );
  }

  return (
    <div className={`grid ${columns} gap-5 sm:gap-6 items-stretch w-full`}>
      {products.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  );
};

export default ProductGrid;
