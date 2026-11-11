'use client';

import React, { useMemo, useRef, useSyncExternalStore } from 'react';
import Link from '@/components/common/Link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { formatCurrency } from '@/utils/formatters';
import {
  getRecentlyViewedProductIdsSnapshot,
  subscribeToRecentlyViewedProducts,
} from '@/utils/recentlyViewed';

export default function RecentlyViewedProducts({ products = [] }) {
  const recentIdsSnapshot = useSyncExternalStore(
    subscribeToRecentlyViewedProducts,
    getRecentlyViewedProductIdsSnapshot,
    () => '[]',
  );
  const recentIds = JSON.parse(recentIdsSnapshot);
  const scrollContainerRef = useRef(null);

  const recentlyViewedProducts = useMemo(() => {
    const productsById = new Map(products.map((product) => [String(product.id), product]));
    return recentIds
      .map((id) => productsById.get(id))
      .filter(Boolean);
  }, [products, recentIds]);

  if (!recentlyViewedProducts.length) return null;

  const scrollProducts = (direction) => {
    const container = scrollContainerRef.current;
    if (!container) return;

    container.scrollBy({
      left: direction * container.clientWidth * 0.8,
      behavior: 'smooth',
    });
  };

  return (
    <section className="border-b border-[#E7E5E4] bg-white py-10 sm:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-5 flex items-end justify-between border-b border-[#E7E5E4] pb-3 sm:mb-6">
          <div>
            <span className="mb-0.5 block text-[10px] font-mono font-medium uppercase tracking-[0.2em] text-[#78716C]">
              Your browsing history
            </span>
            <h2 className="text-xl font-semibold tracking-tight text-[#1C1917] sm:text-2xl">
              Recently Viewed Products
            </h2>
          </div>
          <div className="hidden items-center gap-2 sm:flex">
            <button
              type="button"
              onClick={() => scrollProducts(-1)}
              aria-label="Scroll recently viewed products left"
              className="rounded-full border border-[#E7E5E4] p-2 text-[#57534E] transition-colors hover:border-[#1C1917] hover:text-[#1C1917]"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => scrollProducts(1)}
              aria-label="Scroll recently viewed products right"
              className="rounded-full border border-[#E7E5E4] p-2 text-[#57534E] transition-colors hover:border-[#1C1917] hover:text-[#1C1917]"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div
          ref={scrollContainerRef}
          className="-mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto overscroll-x-contain px-4 pb-2 scroll-smooth sm:mx-0 sm:gap-4 sm:px-0"
        >
          {recentlyViewedProducts.map((product) => (
            <Link
              key={product.id}
              href={`/products/${product.id}`}
              className="group w-48 flex-none snap-start overflow-hidden rounded-xl border border-[#E7E5E4] bg-[#FAFAF9] transition-colors hover:border-[#A8A29E] sm:w-56 sm:rounded-2xl"
            >
              <div className="flex h-40 items-center justify-center overflow-hidden bg-[#F5F5F4] p-4 sm:h-44">
                <img
                  src={product.thumbnail || product.images?.[0] || '/images/category_craft_objects_1791282688777.jpg'}
                  alt={product.title || 'Product image'}
                  loading="lazy"
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="space-y-1.5 p-3.5 sm:p-4">
                <h3 className="line-clamp-2 min-h-9 text-xs leading-snug text-[#1C1917] group-hover:underline sm:text-sm">
                  {product.title}
                </h3>
                <p className="text-sm font-medium tabular-nums text-[#1C1917]">
                  {formatCurrency(product.price)}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
