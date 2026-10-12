import React from 'react';
import { Search, X } from 'lucide-react';

export default function SearchBar({ value, onChange, placeholder = 'Search in catalog...' }) {
  return (
    <div className="relative w-full">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        className="w-full bg-white border border-[#E7E5E4] rounded-sm py-2 pl-9 pr-8 text-xs text-[#1C1917] placeholder:text-[#A8A29E] focus:outline-none focus:border-[#1C1917] transition-colors"
      />
      <Search className="w-3.5 h-3.5 text-[#78716C] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none stroke-[1.5]" />
      {value && (
        <button
          type="button"
          onClick={() => onChange('')}
          className="p-1 text-[#A8A29E] hover:text-[#1C1917] absolute right-2.5 top-1/2 -translate-y-1/2 cursor-pointer"
          aria-label="Clear search text"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}
