import React from 'react';
import { ChevronDown } from 'lucide-react';

const SORT_OPTIONS = [
  { value: 'featured', label: 'Featured Picks' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'rating-high', label: 'Highest Rated' },
  { value: 'discount-high', label: 'Biggest Discount' },
  { value: 'name-asc', label: 'Name: A to Z' },
  { value: 'name-desc', label: 'Name: Z to A' },
];

export default function SortDropdown({ value, onChange }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#78716C] whitespace-nowrap hidden sm:inline">
        Sort:
      </span>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          aria-label="Sort products by"
          className="appearance-none bg-white border border-[#E7E5E4] hover:border-[#1C1917] text-xs font-medium text-[#1C1917] rounded-xs py-1.5 pl-3 pr-7 focus:outline-none focus:border-[#1C1917] cursor-pointer transition-colors shadow-2xs"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <ChevronDown className="w-3.5 h-3.5 text-[#78716C] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none stroke-[1.5]" />
      </div>
    </div>
  );
}
