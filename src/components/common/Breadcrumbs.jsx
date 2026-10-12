import React from 'react';
import Link from './Link';
import { ChevronRight, Home } from 'lucide-react';

export default function Breadcrumbs({ items = [] }) {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center text-xs text-[#78716C] py-3">
      <ol className="flex items-center space-x-1.5 flex-wrap">
        <li>
          <Link
            href="/"
            className="text-[#78716C] hover:text-[#1C1917] transition-colors font-medium flex items-center gap-1"
            aria-label="Home"
          >
            <Home className="w-3.5 h-3.5 stroke-[1.5]" />
            <span>Home</span>
          </Link>
        </li>

        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={item.label || index} className="flex items-center space-x-1.5">
              <ChevronRight className="w-3 h-3 text-[#D6D3D1] select-none shrink-0" />
              {isLast || !item.href ? (
                <span className="font-semibold text-[#1C1917] truncate max-w-[200px] sm:max-w-xs">
                  {item.label}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className="hover:text-[#1C1917] text-[#78716C] transition-colors truncate max-w-[150px] font-medium"
                >
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
