import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Pagination({
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  scrollToTop = true,
}) {
  if (totalPages <= 1) return null;

  const handlePageClick = (page) => {
    if (page < 1 || page > totalPages || page === currentPage) return;
    onPageChange(page);
    if (scrollToTop && typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const pages = [];
  for (let i = 1; i <= totalPages; i++) {
    if (
      i === 1 ||
      i === totalPages ||
      (i >= currentPage - 1 && i <= currentPage + 1)
    ) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== '...') {
      pages.push('...');
    }
  }

  return (
    <nav
      aria-label="Pagination Navigation"
      className="flex items-center justify-center gap-1.5 my-8 pt-6 border-t border-[#E7E5E4]"
    >
      <button
        type="button"
        disabled={currentPage <= 1}
        onClick={() => handlePageClick(currentPage - 1)}
        className="p-2 rounded-xs border border-[#E7E5E4] bg-white text-[#78716C] hover:border-[#1C1917] hover:text-[#1C1917] disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors shadow-2xs"
        aria-label="Previous page"
      >
        <ChevronLeft className="w-4 h-4 stroke-[1.5]" />
      </button>

      {pages.map((p, idx) => {
        if (p === '...') {
          return (
            <span key={`dots-${idx}`} className="px-2 text-[#A8A29E] text-xs font-mono">
              ···
            </span>
          );
        }

        const isCurrent = p === currentPage;
        return (
          <button
            key={p}
            type="button"
            onClick={() => handlePageClick(p)}
            className={`min-w-8 h-8 px-2.5 rounded-xs text-xs font-mono font-medium transition-all cursor-pointer shadow-2xs ${
              isCurrent
                ? 'bg-[#1C1917] text-white border border-[#1C1917]'
                : 'bg-white border border-[#E7E5E4] text-[#57534E] hover:border-[#1C1917] hover:text-[#1C1917]'
            }`}
            aria-label={`Page ${p}`}
            aria-current={isCurrent ? 'page' : undefined}
          >
            {p}
          </button>
        );
      })}

      <button
        type="button"
        disabled={currentPage >= totalPages}
        onClick={() => handlePageClick(currentPage + 1)}
        className="p-2 rounded-xs border border-[#E7E5E4] bg-white text-[#78716C] hover:border-[#1C1917] hover:text-[#1C1917] disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors shadow-2xs"
        aria-label="Next page"
      >
        <ChevronRight className="w-4 h-4 stroke-[1.5]" />
      </button>
    </nav>
  );
}
