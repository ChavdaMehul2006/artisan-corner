import React from 'react';
import { Star } from 'lucide-react';

export const StarRating = ({ rating = 0, numReviews = null, size = 'sm', interactive = false, onRatingChange = null }) => {
  const stars = [1, 2, 3, 4, 5];
  const starSizes = {
    xs: 'w-3.5 h-3.5',
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center">
        {stars.map((star) => {
          const isFilled = star <= Math.round(rating);
          return (
            <button
              key={star}
              type="button"
              disabled={!interactive}
              onClick={() => interactive && onRatingChange && onRatingChange(star)}
              className={`${interactive ? 'cursor-pointer hover:scale-110 transition-transform' : 'cursor-default'} p-0.5`}
            >
              <Star
                className={`${starSizes[size] || starSizes.sm} ${
                  isFilled ? 'text-amber-500 fill-amber-400' : 'text-stone-300 fill-stone-100'
                }`}
              />
            </button>
          );
        })}
      </div>
      {rating !== undefined && (
        <span className="text-xs font-semibold text-stone-700 ml-0.5">
          {Number(rating).toFixed(1)}
        </span>
      )}
      {numReviews !== null && (
        <span className="text-xs text-stone-500">
          ({numReviews})
        </span>
      )}
    </div>
  );
};

export default StarRating;
