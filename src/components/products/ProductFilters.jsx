import React from 'react';
import Button from '@/components/common/Button';
import { Star, RotateCcw } from 'lucide-react';

export default function ProductFilters({
  categories = [],
  selectedCategory,
  onSelectCategory,
  minPrice,
  maxPrice,
  onChangeMinPrice,
  onChangeMaxPrice,
  minRating,
  onChangeMinRating,
  onReset,
  hasActiveFilters,
}) {
  return (
    <aside className="space-y-6 text-left">
      {/* Category Filter */}
      <div>
        <h4 className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#1C1917] mb-3">
          Categories
        </h4>
        <div className="space-y-0.5 max-h-60 overflow-y-auto pr-1">
          <button
            type="button"
            onClick={() => onSelectCategory('all')}
            className={`w-full text-left text-xs py-1.5 px-2.5 rounded-xs transition-colors cursor-pointer flex items-center justify-between ${
              selectedCategory === 'all'
                ? 'bg-[#1C1917] text-white font-medium'
                : 'text-[#57534E] hover:text-[#1C1917] hover:bg-[#F5F5F4]'
            }`}
          >
            <span>All Categories</span>
          </button>

          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.slug;
            return (
              <button
                key={cat.slug}
                type="button"
                onClick={() => onSelectCategory(cat.slug)}
                className={`w-full text-left text-xs py-1.5 px-2.5 rounded-xs transition-colors cursor-pointer flex items-center justify-between capitalize ${
                  isSelected
                    ? 'bg-[#1C1917] text-white font-medium'
                    : 'text-[#57534E] hover:text-[#1C1917] hover:bg-[#F5F5F4]'
                }`}
              >
                <span className="truncate">{cat.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      <hr className="border-[#E7E5E4]" />

      {/* Price Range Filter */}
      <div>
        <h4 className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#1C1917] mb-3">
          Price Range ($)
        </h4>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-[10px] text-[#78716C] font-semibold uppercase tracking-wider block mb-1">Min</label>
            <input
              type="number"
              min="0"
              placeholder="0"
              value={minPrice || ''}
              onChange={(e) => onChangeMinPrice(e.target.value ? Number(e.target.value) : 0)}
              className="w-full text-xs border border-[#E7E5E4] bg-white rounded-xs p-2 text-[#1C1917] focus:outline-none focus:border-[#1C1917]"
            />
          </div>
          <div>
            <label className="text-[10px] text-[#78716C] font-semibold uppercase tracking-wider block mb-1">Max</label>
            <input
              type="number"
              min="0"
              placeholder="Any"
              value={maxPrice === Infinity ? '' : maxPrice}
              onChange={(e) => onChangeMaxPrice(e.target.value ? Number(e.target.value) : Infinity)}
              className="w-full text-xs border border-[#E7E5E4] bg-white rounded-xs p-2 text-[#1C1917] focus:outline-none focus:border-[#1C1917]"
            />
          </div>
        </div>
      </div>

      <hr className="border-[#E7E5E4]" />

      {/* Minimum Rating */}
      <div>
        <h4 className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#1C1917] mb-3">
          Customer Rating
        </h4>
        <div className="space-y-1">
          {[4, 3, 2].map((stars) => {
            const isSelected = minRating === stars;
            return (
              <button
                key={stars}
                type="button"
                onClick={() => onChangeMinRating(isSelected ? 0 : stars)}
                className={`w-full flex items-center justify-between text-xs px-2.5 py-1.5 rounded-xs border cursor-pointer transition-colors ${
                  isSelected
                    ? 'border-[#1C1917] bg-[#1C1917] text-white font-medium'
                    : 'border-[#E7E5E4] hover:border-[#A8A29E] bg-white text-[#57534E]'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <Star className={`w-3.5 h-3.5 ${isSelected ? 'fill-white text-white' : 'fill-[#1C1917] text-[#1C1917]'}`} />
                  <span>{stars} Stars & Up</span>
                </div>
                {isSelected && <span className="text-[10px] uppercase font-mono tracking-wider">Active</span>}
              </button>
            );
          })}
        </div>
      </div>

      {/* Clear Filters CTA */}
      {hasActiveFilters && (
        <div className="pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onReset}
            className="w-full text-xs"
          >
            <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
            Reset All Filters
          </Button>
        </div>
      )}
    </aside>
  );
}
