'use client';

import React, { useState, useMemo } from 'react';
import Link from '@/components/common/Link';
import Breadcrumbs from '@/components/common/Breadcrumbs';
import ProductCard from '@/components/products/ProductCard';
import ProductCardSkeleton from '@/components/products/ProductCardSkeleton';
import Pagination from '@/components/products/Pagination';
import EmptyState from '@/components/common/EmptyState';
import ErrorState from '@/components/common/ErrorState';
import { useProducts } from '@/hooks/useProducts';
import { Sparkles, ShieldCheck, Award } from 'lucide-react';
import bestSellersBackground from '@/assets/images/1520135516656.jpg';

const heroBackgroundStyle = {
  backgroundImage: `url("${bestSellersBackground.src}")`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
};

export default function BestSellersPage() {
  const { products, loading, error, refetch } = useProducts();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 16;

  // Best sellers sorted by reviews count and rating
  const bestSellers = useMemo(() => {
    if (!products || !products.length) return [];

    let list = [...products];
    list.sort((a, b) => {
      return (b.reviews?.length || 0) - (a.reviews?.length || 0) || (b.rating || 0) - (a.rating || 0);
    });

    return list;
  }, [products]);

  // Pagination calculation
  const totalItems = bestSellers.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return bestSellers.slice(start, start + itemsPerPage);
  }, [bestSellers, currentPage, itemsPerPage]);

  if (error) {
    return (
      <div className="min-h-screen bg-[#FAFAF9]">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <ErrorState
            title="Could not load best sellers"
            message={error}
            onRetry={refetch}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAF9] pb-16">
      {/* Top Breadcrumb row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-2">
        <Breadcrumbs
          items={[
            { label: 'Storefront', href: '/products' },
            { label: 'Best Sellers' },
          ]}
        />
      </div>

      {/* Hero banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-2 pb-8">
        <div
          className="relative w-full rounded-xl sm:rounded-2xl overflow-hidden bg-[#1C1917] border border-[#292524] shadow-md select-none"
          style={heroBackgroundStyle}
        >
          <div className="absolute inset-0 bg-black/60" />

          {/* Banner Content Container */}
          <div className="relative z-10 px-6 sm:px-10 lg:px-12 py-8 sm:py-10 text-center">
            {/* Header Eyebrow & Title */}
            <div className="max-w-2xl mx-auto space-y-2 mb-7">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-[10px] sm:text-[11px] font-mono uppercase tracking-[0.22em] text-[#E7E5E4]">
                <span>CERTIFIED ATELIERS & ICONIC HOUSES</span>
              </div>
              <h1 className="font-sans text-2xl sm:text-3xl lg:text-4xl font-normal text-white tracking-tight leading-tight">
                Best Sellers & Archival Brand Partners
              </h1>
              <p className="text-xs sm:text-sm text-[#A8A29E] font-light max-w-lg mx-auto">
                Discover coveted acquisitions crafted by our world-renowned partner houses and certified design ateliers.
              </p>
            </div>

            {/* Guarantee Trust bar inside banner */}
            <div className="mt-6 pt-5 border-t border-white/10 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-[11px] text-[#A8A29E] font-mono uppercase tracking-wider">
              <span className="flex items-center gap-1.5">
                 100% Verified Provenance
              </span>
              <span className="flex items-center gap-1.5">
                 Top-Rated Client Acquisitions
              </span>
              <span className="flex items-center gap-1.5 hidden sm:inline-flex">
               Complimentary Courier Delivery
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Product Grid directly begins below the Brand Logo Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-4 lg:gap-6">
            {Array.from({ length: 8 }).map((_, idx) => (
              <ProductCardSkeleton key={idx} />
            ))}
          </div>
        ) : paginatedItems.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-4 lg:gap-6">
            {paginatedItems.map((product, idx) => {
              const globalRank = (currentPage - 1) * itemsPerPage + idx + 1;
              return (
                <div key={product.id} className="relative group">
                  {/* Subtle top rank indicator for top 8 */}
                  {globalRank <= 8 && (
                    <div className="absolute top-2 left-2 z-10 bg-[#1C1917]/90 text-white text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-xs shadow-xs pointer-events-none tracking-wider">
                      #{globalRank} BEST SELLER
                    </div>
                  )}
                  <ProductCard product={product} />
                </div>
              );
            })}
          </div>
        ) : (
          <div className="py-12">
            <EmptyState
              title="No best selling editions available"
              description="Check back soon as new archival releases are verified."
              actionLabel="Return to Catalog"
              actionHref="/products"
            />
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-10 flex justify-center">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={(page) => {
                setCurrentPage(page);
                window.scrollTo({ top: 380, behavior: 'smooth' });
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
