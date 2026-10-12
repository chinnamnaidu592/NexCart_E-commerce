import React, { useState, useMemo } from 'react';
import Link from '@/components/common/Link';
import ProductGrid from '@/components/products/ProductGrid';
import { ArrowRight } from 'lucide-react';

const TABS = [
  { id: 'bestsellers', label: 'Best Sellers' },
  { id: 'toprated', label: 'Top Rated' },
  { id: 'deals', label: 'Curated Deals' },
];

export default function TrendingShowcase({ products = [], isLoading = false }) {
  const [activeTab, setActiveTab] = useState('bestsellers');

  const displayedProducts = useMemo(() => {
    if (!products || !products.length) return [];
    let list = [...products];

    if (activeTab === 'bestsellers') {
      list.sort((a, b) => (b.reviews?.length || 0) - (a.reviews?.length || 0));
    } else if (activeTab === 'toprated') {
      list.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else if (activeTab === 'deals') {
      list.sort((a, b) => (b.discountPercentage || 0) - (a.discountPercentage || 0));
    }

    return list.slice(0, 8);
  }, [products, activeTab]);

  return (
    <section className="py-14 sm:py-20 bg-[#FAFAF9] border-b border-[#E7E5E4] text-left">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header & Tab Selector */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-12 gap-4 pb-4 border-b border-[#E7E5E4]">
          <div>
            <span className="text-[10px] font-mono font-medium text-[#78716C] uppercase tracking-[0.2em] block mb-1">
              Curator Recommendations
            </span>
            <h2 className="font-sans text-2xl sm:text-3xl font-normal text-[#1C1917] tracking-tight">
              Trending Catalog Edits
            </h2>
          </div>

          {/* Clean Segmented Tab Control without decorative emojis or fire icons */}
          <div
            role="tablist"
            aria-label="Product Showcase Filter"
            className="flex items-center bg-[#F5F5F4] p-1 border border-[#E7E5E4] rounded-xs"
          >
            {TABS.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3.5 py-1.5 text-xs uppercase tracking-wider font-semibold rounded-xs transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-[#1C1917] text-white shadow-xs'
                      : 'text-[#78716C] hover:text-[#1C1917]'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Product Grid */}
        <ProductGrid
          products={displayedProducts}
          isLoading={isLoading}
          skeletonCount={8}
        />

        {/* Bottom Catalog Link */}
        <div className="mt-10 pt-6 border-t border-[#E7E5E4] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <span className="text-[#78716C]">
            Showing 8 curated selections from our active inventory
          </span>
          <Link
            href="/products"
            className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#1C1917] hover:underline"
          >
            <span>Explore All Products</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
