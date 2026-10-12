import React from 'react';
import { Star } from 'lucide-react';

export default function RatingStars({ rating = 0, reviewCount, size = 'sm' }) {
  const numericRating = Number(rating || 0);
  const rounded = Math.round(numericRating * 10) / 10;
  const starSizes = {
    xs: 'w-3 h-3',
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  return (
    <div className="inline-flex items-center gap-1.5" aria-label={`Rating: ${rounded} out of 5 stars`}>
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((index) => {
          const isFilled = index <= Math.floor(numericRating);
          const isHalf = !isFilled && index === Math.ceil(numericRating) && numericRating % 1 >= 0.3;

          return (
            <Star
              key={index}
              className={`${starSizes[size] || starSizes.sm} ${
                isFilled
                  ? 'fill-amber-400 text-amber-400'
                  : isHalf
                  ? 'fill-amber-200 text-amber-400'
                  : 'text-slate-200 fill-slate-100'
              }`}
            />
          );
        })}
      </div>
      <span className="text-xs font-bold text-slate-800 tabular-nums">{rounded}</span>
      {reviewCount !== undefined && (
        <span className="text-[11px] font-medium text-slate-400">({reviewCount})</span>
      )}
    </div>
  );
}
