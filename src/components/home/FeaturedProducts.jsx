import React from 'react';
import Link from '@/components/common/Link';
import ProductGrid from '@/components/products/ProductGrid';
import { ArrowRight } from 'lucide-react';

export default function FeaturedProducts({ products = [], isLoading = false }) {
  const displayProducts = products.slice(0, 8);

  return (
    <section className="py-20 sm:py-24 bg-[#FAFAF9] border-t border-[#E7E5E4]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4 pb-6 border-b border-[#E7E5E4]">
          <div>
            <span className="text-[11px] font-semibold text-[#78716C] uppercase tracking-[0.2em] block mb-1">
              Seasonal Archive
            </span>
            <h2 className="font-sans text-3xl sm:text-4xl font-normal text-[#1C1917] tracking-tight">
              Featured Acquisitions
            </h2>
          </div>
          <Link
            href="/products"
            className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider font-semibold text-[#1C1917] hover:text-[#78716C] transition-colors"
          >
            <span>View Full Catalog</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <ProductGrid products={displayProducts} isLoading={isLoading} skeletonCount={8} />
      </div>
    </section>
  );
}
